"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type PointerEvent } from "react";
import { DownloadButton } from "@/components/download-button";
import { formatShortDateTime } from "@/lib/format";
import {
  createClassroomBoardSnapshot,
  type ClassroomBoardAction,
  type ClassroomArchive,
  type ClassroomBoardSnapshot,
  type ClassroomRoomParticipant,
  type ClassroomSyncBridge,
} from "@/lib/classroom-sync";
import type { ClassroomComplianceItem, ClassroomMaterial, ClassroomTimelineItem } from "@/lib/classroom";
import type { AppRole } from "@/lib/roles";

type RoomClient = {
  id: string;
  name: string;
  billTo: string;
};

type RoomSession = {
  id: string;
  title: string;
  startsAt: string;
  status: string;
  notes: string;
  billable: boolean;
  amountCents: number;
  clientName: string;
};

type BoardTool = "pen" | "marker" | "erase" | "text" | "shape";
type BoardAction = ClassroomBoardAction;
type BoardStroke = Extract<ClassroomBoardAction, { type: "stroke" }>;

type SnapshotItem = {
  id: string;
  label: string;
  preview: string;
};

type ClassroomStudioProps = {
  role: AppRole;
  roomTitle: string;
  roomSubtitle: string;
  nextLessonLabel: string;
  testActorEmail?: string | null;
  clients: RoomClient[];
  sessions: RoomSession[];
  materials: ClassroomMaterial[];
  history: ClassroomTimelineItem[];
  compliance: ClassroomComplianceItem[];
  sessionDigest: string;
  archives: ClassroomArchive[];
  meetingStatus?: string;
  roomParticipants?: ClassroomRoomParticipant[];
  syncBridge?: ClassroomSyncBridge | null;
  incomingSnapshot?: ClassroomBoardSnapshot | null;
  roomWatchdogLabel?: string;
  onSessionEnded?: () => void;
  onArchiveSaved?: (archive: ClassroomArchive) => void;
};

const penColors = ["#0f172a", "#f97316", "#3b82f6", "#8b5cf6"];
const stageImage = "/visuals/hero-classroom.svg";

function createActionId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createSummaryText(label: string, actionList: BoardAction[], sessionDigest: string) {
  const body = [
    label,
    "",
    "Session summary",
    sessionDigest,
    "",
    "Board items",
    ...actionList.map((action) => {
      if (action.type === "stroke") return `- Stroke (${action.tool}) with ${action.points.length} point(s)`;
      if (action.type === "text") return `- Text: ${action.text}`;
      if (action.type === "shape") return `- Shape: ${action.width} × ${action.height}`;
      return `- Image: ${action.label}`;
    }),
  ];

  return body.join("\n");
}

function appendTestActorParam(path: string, testActorEmail: string | null | undefined) {
  if (!testActorEmail) {
    return path;
  }

  const url = new URL(path, window.location.origin);
  url.searchParams.set("testActor", testActorEmail);
  return url;
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

async function loadImage(source: string) {
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

export function ClassroomStudio({
  role,
  roomTitle,
  roomSubtitle,
  nextLessonLabel,
  clients,
  sessions,
  materials,
  history,
  compliance,
  sessionDigest,
  archives,
  meetingStatus,
  roomParticipants,
  syncBridge,
  incomingSnapshot,
  roomWatchdogLabel,
  onSessionEnded,
  onArchiveSaved,
  testActorEmail,
}: ClassroomStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const router = useRouter();
  const pendingStrokeRef = useRef<BoardStroke | null>(null);
  const lastRevisionRef = useRef(0);
  const suppressPublishRef = useRef(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const [tool, setTool] = useState<BoardTool>("pen");
  const [color, setColor] = useState(penColors[0]);
  const [status, setStatus] = useState(meetingStatus || "Ready to start the room.");
  const [boardActions, setBoardActions] = useState<BoardAction[]>([]);
  const [snapshots, setSnapshots] = useState<SnapshotItem[]>([]);
  const [boardLabel, setBoardLabel] = useState(roomTitle);
  const [localSourceId] = useState(() => globalThis.crypto?.randomUUID?.() || roomTitle);
  const [lessonArchives, setLessonArchives] = useState<ClassroomArchive[]>(archives);
  const [lastSavedArchive, setLastSavedArchive] = useState<ClassroomArchive | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [roomLive, setRoomLive] = useState(false);
  const [sessionEnding, setSessionEnding] = useState(false);
  const [boardRevision, setBoardRevision] = useState(0);
  const [imageShelf, setImageShelf] = useState<Array<{ id: string; label: string; source: string }>>([]);

  const roleLabel = role === "client" ? "Student view" : role === "admin" ? "Supervisor view" : "Tutor view";
  const selectedSession = sessions[0] || null;
  const roomRoster = roomParticipants?.length
    ? roomParticipants
    : clients.map((client) => ({
        id: client.id,
        name: client.name,
        role: "student",
      }));
  const roomPresentCount = Math.max(1, roomRoster.length);
  const roomSpeakingCount = roomParticipants?.filter((participant) => participant.speaking).length || 0;
  const roomActiveCount = roomParticipants?.filter((participant) => participant.active).length || roomPresentCount;
  const syncConnected = Boolean(syncBridge?.connected);
  const liveStatus = meetingStatus || status;
  const sourceId = syncBridge?.sourceId || localSourceId;
  const syncStatusText = syncConnected ? `Board synced · revision ${boardRevision}` : "Board waits for the room to connect";
  const archiveCount = lessonArchives.length;

  const downloadBundleText = useMemo(
    () => createSummaryText(boardLabel, boardActions, sessionDigest),
    [boardActions, boardLabel, sessionDigest],
  );

  async function updateSessionStatus(
    status: "partial" | "completed",
    notes: string,
  ): Promise<{ archive: ClassroomArchive | null; sessionId: string } | null> {
    if (!selectedSession) {
      return null;
    }

    const response = await fetch(appendTestActorParam(`/api/sessions/${selectedSession.id}`, testActorEmail), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        notes,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as {
      session?: { id: string };
      archive?: ClassroomArchive;
      error?: string;
    };

    if (!response.ok || !payload.session) {
      throw new Error(payload.error || "Unable to update the session.");
    }

      if (payload.archive) {
        setLessonArchives((current) => [payload.archive as ClassroomArchive, ...current.filter((entry) => entry.id !== payload.archive?.id)]);
        setLastSavedArchive(payload.archive as ClassroomArchive);
        onArchiveSaved?.(payload.archive as ClassroomArchive);
      }

    return { archive: payload.archive || null, sessionId: payload.session.id };
  }

  useEffect(() => {
    if (!incomingSnapshot) {
      return;
    }

    const frame = window.setTimeout(() => {
      lastRevisionRef.current = Math.max(lastRevisionRef.current, incomingSnapshot.revision);
      setBoardRevision(incomingSnapshot.revision);
      suppressPublishRef.current = true;
      setBoardLabel(incomingSnapshot.boardLabel);
      setBoardActions(incomingSnapshot.actions);
      setStatus(`Board synced from ${incomingSnapshot.source === syncBridge?.sourceId ? "your board" : "another tutor"}.`);
    }, 0);

    return () => {
      window.clearTimeout(frame);
    };
  }, [incomingSnapshot, syncBridge?.sourceId]);

  useEffect(() => {
    setLessonArchives(archives);
  }, [archives]);

  useEffect(() => {
    if (!syncBridge?.connected) {
      return;
    }

    if (suppressPublishRef.current) {
      suppressPublishRef.current = false;
      return;
    }

    const timeout = window.setTimeout(() => {
      const snapshot = createClassroomBoardSnapshot({
        source: sourceId,
        revision: lastRevisionRef.current + 1,
        boardLabel,
        actions: boardActions,
      });

      lastRevisionRef.current = snapshot.revision;
      setBoardRevision(snapshot.revision);
      void syncBridge.publishSnapshot(snapshot);
    }, 120);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [boardActions, boardLabel, sourceId, syncBridge]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const redraw = async () => {
      const rect = stage.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * scale));
      canvas.height = Math.max(1, Math.floor(rect.height * scale));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);
      context.fillStyle = "#fffdf9";
      context.fillRect(0, 0, rect.width, rect.height);

      const columns = Math.floor(rect.width / 48);
      const rows = Math.floor(rect.height / 48);
      context.strokeStyle = "rgba(15, 23, 42, 0.045)";
      context.lineWidth = 1;
      for (let index = 0; index < columns; index += 1) {
        context.beginPath();
        context.moveTo(index * 48, 0);
        context.lineTo(index * 48, rect.height);
        context.stroke();
      }
      for (let index = 0; index < rows; index += 1) {
        context.beginPath();
        context.moveTo(0, index * 48);
        context.lineTo(rect.width, index * 48);
        context.stroke();
      }

      for (const action of boardActions) {
        if (action.type === "stroke") {
          context.save();
          context.lineCap = "round";
          context.lineJoin = "round";
          context.strokeStyle = action.tool === "marker" ? "rgba(249, 115, 22, 0.45)" : action.color;
          context.lineWidth = action.width;
          context.globalCompositeOperation = action.tool === "erase" ? "destination-out" : "source-over";
          context.beginPath();
          action.points.forEach((point, index) => {
            if (index === 0) {
              context.moveTo(point.x, point.y);
              return;
            }
            context.lineTo(point.x, point.y);
          });
          context.stroke();
          context.restore();
          continue;
        }

        if (action.type === "text") {
          context.save();
          context.fillStyle = action.color;
          context.font = `${action.size}px Inter, sans-serif`;
          context.fillText(action.text, action.x, action.y);
          context.restore();
          continue;
        }

        if (action.type === "shape") {
          context.save();
          context.strokeStyle = action.color;
          context.lineWidth = 3;
          context.fillStyle = "rgba(249, 115, 22, 0.08)";
          drawRoundedRect(context, action.x, action.y, action.width, action.height, 20);
          context.fill();
          context.stroke();
          context.restore();
          continue;
        }

        if (action.type === "image") {
          try {
            const image = await loadImage(action.source);
            context.save();
            drawRoundedRect(context, action.x, action.y, action.width, action.height, 20);
            context.clip();
            context.drawImage(image, action.x, action.y, action.width, action.height);
            context.restore();
            context.save();
            context.fillStyle = "rgba(15, 23, 42, 0.9)";
            context.fillRect(action.x, action.y + action.height - 38, action.width, 38);
            context.fillStyle = "#fff";
            context.font = "600 13px Inter, sans-serif";
            context.fillText(action.label, action.x + 12, action.y + action.height - 14);
            context.restore();
          } catch {
            context.save();
            context.fillStyle = "#fee7d6";
            drawRoundedRect(context, action.x, action.y, action.width, action.height, 20);
            context.fill();
            context.fillStyle = "#0f172a";
            context.font = "600 14px Inter, sans-serif";
            context.fillText(action.label, action.x + 16, action.y + 24);
            context.restore();
          }
        }
      }
    };

    void redraw();

    const resize = () => {
      void redraw();
    };

    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = new ResizeObserver(resize);
    resizeObserverRef.current.observe(stage);

    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, [boardActions]);

  useEffect(() => {
    const element = cameraVideoRef.current;
    if (element && cameraStream) {
      element.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    const element = screenVideoRef.current;
    if (element && screenStream) {
      element.srcObject = screenStream;
    }
  }, [screenStream]);

  useEffect(() => {
    return () => {
      cameraStream?.getTracks().forEach((track) => track.stop());
      screenStream?.getTracks().forEach((track) => track.stop());
    };
  }, [cameraStream, screenStream]);

  function getBoardPoint(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, event.clientX - rect.left);
    const y = Math.max(0, event.clientY - rect.top);
    return { x, y };
  }

  function stopStroke() {
    if (!pendingStrokeRef.current) {
      return;
    }

    pendingStrokeRef.current = null;
    setStatus("Board updated.");
  }

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    const point = getBoardPoint(event);

    if (tool === "text") {
      const text = window.prompt("Write your note on the board", "Key idea");
      if (!text) {
        return;
      }

      setBoardActions((current) => [
        ...current,
        {
          id: createActionId(),
          type: "text",
          text,
          x: point.x,
          y: point.y,
          color: "#0f172a",
          size: 24,
        },
      ]);
      setStatus("Text placed on the board.");
      return;
    }

    if (tool === "shape") {
      setBoardActions((current) => [
        ...current,
        {
          id: createActionId(),
          type: "shape",
          x: Math.max(24, point.x - 72),
          y: Math.max(24, point.y - 48),
          width: 180,
          height: 120,
          color: color || "#f97316",
        },
      ]);
      setStatus("Shape added.");
      return;
    }

    pendingStrokeRef.current = {
      id: createActionId(),
      type: "stroke",
      tool,
      color,
      width: tool === "marker" ? 18 : tool === "erase" ? 28 : 5,
      points: [point],
    };
    setBoardActions((current) => [...current, pendingStrokeRef.current as BoardStroke]);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    if (!pendingStrokeRef.current) {
      return;
    }

    pendingStrokeRef.current.points.push(getBoardPoint(event));
    setBoardActions((current) => {
      if (!current.length) {
        return [pendingStrokeRef.current as BoardStroke];
      }

      return [...current.slice(0, -1), pendingStrokeRef.current as BoardStroke];
    });
  }

  function handlePointerUp() {
    stopStroke();
  }

  async function openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      cameraStream?.getTracks().forEach((track) => track.stop());
      setCameraStream(stream);
      setRoomLive(true);
      setSessionEnding(false);
      setStatus("Camera and audio are ready.");
      if (selectedSession) {
        void updateSessionStatus("partial", "Live classroom session started.").catch(() => {
          setStatus("The room is live, but the session status could not be updated yet.");
        });
      }
    } catch {
      setCameraStream(null);
      setRoomLive(true);
      setSessionEnding(false);
      setStatus("Camera access was blocked, but the live room is ready.");
      if (selectedSession) {
        void updateSessionStatus("partial", "Live classroom session started without local media.").catch(() => {
          setStatus("The room is live, but the session status could not be updated yet.");
        });
      }
    }
  }

  async function shareScreen() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      screenStream?.getTracks().forEach((track) => track.stop());
      setScreenStream(stream);
      setStatus("Screen sharing is live.");
      stream.getVideoTracks()[0]?.addEventListener("ended", () => {
        setScreenStream(null);
        setStatus("Screen share stopped.");
      });
    } catch {
      setStatus("Screen share was cancelled.");
    }
  }

  function leaveRoom() {
    cameraStream?.getTracks().forEach((track) => track.stop());
    screenStream?.getTracks().forEach((track) => track.stop());
    setCameraStream(null);
    setScreenStream(null);
    setRoomLive(false);
    setStatus("Room closed.");
  }

  function undoLastAction() {
    setBoardActions((current) => current.slice(0, -1));
    setStatus("Last board change removed.");
  }

  function clearBoard() {
    setBoardActions([]);
    setStatus("Board cleared.");
  }

  function saveSnapshot() {
    const canvas = canvasRef.current;
    if (!canvas) {
      setStatus("Nothing to save yet.");
      return;
    }

    const preview = canvas.toDataURL("image/png");
    setSnapshots((current) => [
      {
        id: createActionId(),
        label: `${roomTitle} · ${new Date().toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" })}`,
        preview,
      },
      ...current,
    ]);
    setStatus("A board snapshot was saved.");
  }

  async function saveLessonArchive() {
    try {
      const response = await fetch(appendTestActorParam("/api/classroom/archive", testActorEmail), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: selectedSession?.id || null,
          clientId: selectedSession ? clients.find((client) => client.name === selectedSession.clientName)?.id || null : null,
          title: selectedSession?.title || boardLabel,
          summary: sessionDigest,
          boardLabel,
          snapshotJson: JSON.stringify(boardActions),
        }),
      });

      const payload = (await response.json()) as { archive?: ClassroomArchive; error?: string };
      if (!response.ok || !payload.archive) {
        throw new Error(payload.error || "Unable to save the lesson record.");
      }

      setLessonArchives((current) => [payload.archive as ClassroomArchive, ...current.filter((entry) => entry.id !== payload.archive?.id)]);
      setLastSavedArchive(payload.archive as ClassroomArchive);
      onArchiveSaved?.(payload.archive as ClassroomArchive);
      setStatus("Lesson record saved.");
      return payload.archive as ClassroomArchive;
    } catch {
      setStatus("The lesson record could not be saved.");
      return null;
    }
  }

  async function endSession() {
    if (!roomLive) {
      setStatus("Start the room before ending the session.");
      return;
    }

    setSessionEnding(true);
    setStatus("Saving the lesson record and closing the room...");
    try {
        if (selectedSession) {
          const result = await updateSessionStatus(
            "completed",
            "Live classroom session ended and archived from the classroom room.",
          );
          if (result?.archive) {
            leaveRoom();
            setStatus("Session archived and room closed.");
            router.refresh();
            onSessionEnded?.();
            return;
          }
        }

      const archive = await saveLessonArchive();
      if (!archive) {
        return;
      }

        leaveRoom();
        setStatus("Session archived and room closed.");
        router.refresh();
        onSessionEnded?.();
      } catch {
        setStatus("The session could not be closed right now.");
    } finally {
      setSessionEnding(false);
    }
  }

  function exportSnapshot() {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${roomTitle.toLowerCase().replace(/\s+/g, "-")}-board.png`;
    link.click();
    setStatus("Board image downloaded.");
  }

  async function addImageToBoard(imageSource: string, label: string) {
    setBoardActions((current) => [
      ...current,
      {
        id: createActionId(),
        type: "image",
        x: 48 + current.length * 8,
        y: 52 + current.length * 8,
        width: 240,
        height: 160,
        label,
        source: imageSource,
      },
    ]);
    setStatus("Image added to the board.");
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

    const nextImages = files.map((file) => ({
      id: createActionId(),
      label: file.name,
      source: URL.createObjectURL(file),
    }));

    setImageShelf((current) => [...nextImages, ...current]);
    event.target.value = "";
    setStatus("Image ready for the board.");
  }

  return (
    <section className="classroom-shell">
      <div className="classroom-topline">
        <div>
          <span className="eyebrow">{roleLabel}</span>
          <h2>{roomTitle}</h2>
          <p>{roomSubtitle}</p>
        </div>
        <div className="classroom-topline-actions">
          <DownloadButton
            label="Download summary"
            filename={`${boardLabel.toLowerCase().replace(/\s+/g, "-")}-summary.txt`}
            content={downloadBundleText}
            className="button button-secondary"
          />
          <button className="button button-primary" type="button" onClick={roomLive ? endSession : openCamera} disabled={sessionEnding}>
            {roomLive ? (sessionEnding ? "Ending session..." : "End session and archive") : "Start room"}
          </button>
        </div>
      </div>

      {lastSavedArchive ? (
        <div className="classroom-archive-banner">
          <div>
            <span className="eyebrow">Lesson archived</span>
            <strong>{lastSavedArchive.title}</strong>
            <p>
              Saved to the library for {lastSavedArchive.boardLabel}. {syncConnected ? "The archive came directly from the live room." : "The record is ready to review."}
            </p>
          </div>
          <div className="classroom-archive-banner-actions">
            <span className="room-status-chip room-status-chip-saved">Archived</span>
            <Link href="/app/library" className="button button-secondary button-small">
              Open library
            </Link>
          </div>
        </div>
      ) : null}

      <div className="classroom-sync-strip">
        <div className="list-card">
          <strong>{syncStatusText}</strong>
          <span>{liveStatus}</span>
        </div>
        <div className="list-card">
          <strong>{roomPresentCount}</strong>
          <span>People present</span>
        </div>
        <div className="list-card">
          <strong>{archiveCount}</strong>
          <span>Saved records</span>
        </div>
        <div className="list-card">
          <strong>{roomSpeakingCount}</strong>
          <span>Speaking now</span>
        </div>
      </div>
      {roomWatchdogLabel ? (
        <div className="classroom-watchdog">
          <span className="room-status-chip room-status-chip-sync">{roomWatchdogLabel}</span>
        </div>
      ) : null}

      <div className="classroom-grid">
        <div className="classroom-main">
          <article className="panel classroom-video-panel">
            <div className="section-head compact">
              <div>
                <h2>Live room</h2>
                <p>{nextLessonLabel}</p>
              </div>
              <div className="classroom-status">
                <span className="room-status-chip room-status-chip-live">{liveStatus}</span>
                <span className="room-status-chip room-status-chip-present">{roomPresentCount} present</span>
                <span className="room-status-chip room-status-chip-speaking">{roomSpeakingCount} speaking</span>
                <span className="room-status-chip room-status-chip-sync">{syncStatusText}</span>
              </div>
            </div>
            <div className="classroom-video-grid">
              <div className="classroom-video-card">
                {cameraStream ? (
                  <video ref={cameraVideoRef} autoPlay playsInline muted className="classroom-video-feed" />
                ) : (
                  <div className="classroom-video-fallback">
                    <Image src={stageImage} alt="Teaching room preview" fill sizes="(max-width: 900px) 100vw, 50vw" />
                    <div className="classroom-video-copy">
                      <strong>Teaching room</strong>
                      <span>Open the camera to begin.</span>
                    </div>
                  </div>
                )}
                <div className="classroom-video-caption">Tutor camera</div>
              </div>
              <div className="classroom-video-card">
                {screenStream ? (
                  <video ref={screenVideoRef} autoPlay playsInline muted className="classroom-video-feed" />
                ) : (
                  <div className="classroom-video-fallback classroom-video-fallback-soft">
                    <strong>Shared screen</strong>
                    <span>Use screen share for slides, examples, or a quick walkthrough.</span>
                  </div>
                )}
                <div className="classroom-video-caption">Screen share</div>
              </div>
            </div>
            <div className="classroom-video-actions">
              <button className="button button-secondary" type="button" onClick={openCamera}>
                Open camera
              </button>
              <button className="button button-secondary" type="button" onClick={shareScreen}>
                Share screen
              </button>
              <button className="button button-secondary" type="button" onClick={saveSnapshot}>
                Save snapshot
              </button>
              <button className="button button-secondary" type="button" onClick={saveLessonArchive}>
                Save lesson record
              </button>
            </div>
          </article>

          <article className="panel classroom-board-panel">
            <div className="section-head compact">
              <div>
                <h2>Whiteboard</h2>
                <p>Draw, write, highlight, and place images directly on the board.</p>
              </div>
              <div className="classroom-board-tools">
                {penColors.map((itemColor) => (
                  <button
                    key={itemColor}
                    type="button"
                    className={`color-swatch ${color === itemColor ? "active" : ""}`}
                    style={{ background: itemColor }}
                    onClick={() => setColor(itemColor)}
                    aria-label={`Select ${itemColor}`}
                  />
                ))}
              </div>
            </div>

            <div className="classroom-toolbar">
              {[
                { id: "pen", label: "Pen" },
                { id: "marker", label: "Marker" },
                { id: "erase", label: "Erase" },
                { id: "text", label: "Text" },
                { id: "shape", label: "Shape" },
              ].map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className={`toolbar-pill ${tool === entry.id ? "active" : ""}`}
                  onClick={() => setTool(entry.id as BoardTool)}
                >
                  {entry.label}
                </button>
              ))}
              <button type="button" className="toolbar-pill" onClick={undoLastAction}>
                Undo
              </button>
              <button type="button" className="toolbar-pill" onClick={clearBoard}>
                Clear
              </button>
              <button type="button" className="toolbar-pill" onClick={exportSnapshot}>
                Download board
              </button>
            </div>

            <div ref={stageRef} className="classroom-stage">
              <canvas
                ref={canvasRef}
                className="classroom-canvas"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              />

              <div className="classroom-board-card">
                <strong>{selectedSession ? selectedSession.title : "Teaching notes"}</strong>
                <span>{selectedSession ? selectedSession.notes || "No note saved yet." : "Select a lesson to begin."}</span>
                <span>{selectedSession ? formatShortDateTime(selectedSession.startsAt) : "Ready now"}</span>
              </div>

              <div className="classroom-board-card floating-card">
                <strong>Lesson focus</strong>
                <span>{sessionDigest.split("\n").filter(Boolean).slice(0, 3).join(" · ")}</span>
              </div>
            </div>

            <div className="classroom-board-footer">
              <label className="classroom-title-input">
                Board title
                <input value={boardLabel} onChange={(event) => setBoardLabel(event.target.value)} />
              </label>
              <label className="classroom-upload">
                Add image
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </label>
              <div className="classroom-upload-note">Images can be placed on the board once they’re uploaded.</div>
            </div>

            {snapshots.length ? (
              <div className="classroom-snapshot-rail">
                {snapshots.slice(0, 3).map((snapshot) => (
                  <div key={snapshot.id} className="snapshot-card">
                    <Image src={snapshot.preview} alt={snapshot.label} width={240} height={144} />
                    <span>{snapshot.label}</span>
                  </div>
                ))}
              </div>
            ) : null}

            {imageShelf.length ? (
              <div className="classroom-image-shelf">
                {imageShelf.map((image) => (
                  <div key={image.id} className="image-shelf-card">
                    <Image src={image.source} alt={image.label} width={220} height={140} />
                    <div className="image-shelf-card-copy">
                      <strong>{image.label}</strong>
                      <button type="button" className="mini-button" onClick={() => addImageToBoard(image.source, image.label)}>
                        Place on board
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        </div>

        <aside className="classroom-aside">
          <article className="panel">
            <div className="section-head compact">
              <div>
                <h2>People in the room</h2>
                <p>
                  {roomRoster.length
                    ? `${roomRoster.length} person${roomRoster.length === 1 ? "" : "s"} are here.`
                    : "No one has joined yet."}
                </p>
              </div>
            </div>
            <div className="classroom-people">
              {roomRoster.length ? (
                roomRoster.map((participant) => (
                  <div key={participant.id} className="classroom-person-card">
                    <strong>{participant.name}</strong>
                    <span>{participant.role}</span>
                  </div>
                ))
              ) : (
                <div className="empty-state">Open the room to see who is joining.</div>
              )}
            </div>
          </article>

          <article className="panel">
            <div className="section-head compact">
              <div>
                <h2>Lesson trail</h2>
                <p>Recent sessions, in the order you can teach from them.</p>
              </div>
            </div>
            <div className="classroom-list">
              {history.map((item) => (
                <div key={item.id} className={`list-card tone-${item.tone}`}>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                  <span>{item.time}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="section-head compact">
              <div>
                <h2>Materials</h2>
                <p>Downloadable packs for the lesson and follow-up.</p>
              </div>
            </div>
            <div className="classroom-list">
              {materials.map((material) => (
                <div key={material.id} className="classroom-material-card">
                  <div>
                    <span className="material-kicker">{material.kind}</span>
                    <strong>{material.title}</strong>
                    <p>{material.summary}</p>
                  </div>
                  <div className="material-meta">
                    <span>{material.updatedAt}</span>
                    <DownloadButton
                      label="Download"
                      filename={material.fileName}
                      content={material.body}
                      className="button button-secondary button-small"
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="section-head compact">
              <div>
                <h2>Compliance trail</h2>
                <p>What’s captured, who can see it, and what can be downloaded.</p>
              </div>
            </div>
            <div className="classroom-list">
              {compliance.map((item) => (
                <div key={item.id} className={`list-card tone-${item.status}`}>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="section-head compact">
              <div>
                <h2>Saved lesson records</h2>
                <p>Quick exports from the room.</p>
              </div>
            </div>
            <div className="classroom-list">
                {lessonArchives.length ? (
                  lessonArchives.map((archive) => (
                    <div key={archive.id} className="classroom-material-card">
                      <div>
                      <span className="material-kicker">{archive.boardLabel}</span>
                      <div className="classroom-room-status" style={{ marginTop: 10, marginBottom: 10 }}>
                        <span className="room-status-chip room-status-chip-saved">
                          {syncConnected ? "Saved from live room" : "Saved lesson record"}
                        </span>
                        <span className="room-status-chip room-status-chip-present">{roomPresentCount} present</span>
                        <span className="room-status-chip room-status-chip-active">{roomActiveCount} active</span>
                        <span className="room-status-chip room-status-chip-sync">{syncStatusText}</span>
                      </div>
                      <strong>{archive.title}</strong>
                      <p>{archive.summary}</p>
                      </div>
                      <div className="material-meta">
                      <span>{archive.createdAt}</span>
                      <DownloadButton
                        label="Download record"
                        filename={archive.fileName}
                        content={[archive.title, "", archive.summary, "", archive.snapshotJson].join("\n")}
                        className="button button-secondary button-small"
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">Save the first lesson record and it will appear here.</div>
              )}
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
}

