"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ControlBar,
  LiveKitRoom,
  FocusLayout,
  FocusLayoutContainer,
  LayoutContextProvider,
  MediaDeviceMenu,
  ParticipantTile,
  RoomAudioRenderer,
  PreJoin,
  useRoomContext,
  useCreateLayoutContext,
  useSpeakingParticipants,
  useTracks,
} from "@livekit/components-react";
import { ConnectionState, Room, RoomEvent, Track, type RemoteParticipant } from "livekit-client";
import type { LocalUserChoices } from "@livekit/components-core";
import { ClassroomStudio } from "@/components/classroom-studio";
import {
  type ClassroomArchive,
  parseClassroomBoardSnapshot,
  type ClassroomBoardSnapshot,
  type ClassroomRoomParticipant,
  type ClassroomSyncBridge,
} from "@/lib/classroom-sync";
import type { AppRole } from "@/lib/roles";
import type { ClassroomComplianceItem, ClassroomMaterial, ClassroomTimelineItem } from "@/lib/classroom";

type ClassroomRoomProps = {
  role: AppRole;
  roomTitle: string;
  roomSubtitle: string;
  nextLessonLabel: string;
  roomName: string;
  roomJoinUrl: string;
  roomLabel: string;
  testActorEmail?: string | null;
  clients: Array<{
    id: string;
    name: string;
    billTo: string;
  }>;
  sessions: Array<{
    id: string;
    title: string;
    startsAt: string;
    status: string;
    notes: string;
    billable: boolean;
    amountCents: number;
    clientName: string;
  }>;
  materials: ClassroomMaterial[];
  history: ClassroomTimelineItem[];
  compliance: ClassroomComplianceItem[];
  sessionDigest: string;
  archives: ClassroomArchive[];
  onSessionEnded?: () => void;
  onArchiveSaved?: (archive: ClassroomArchive) => void;
  roomWatchdogLabel?: string;
  roomConnectionState?: ConnectionState;
  onReconnectNow?: () => void;
};

type ArchiveBannerProps = {
  archive: ClassroomArchive;
  syncedFromLiveRoom: boolean;
};

function LiveKitSetupCard({ message }: { message: ReactNode }) {
  return (
    <article className="panel classroom-room-setup">
      <div className="section-head compact">
        <div>
          <h2>Live room setup</h2>
          <p>Connect the video room keys, then the classroom becomes a live meeting.</p>
        </div>
      </div>
      <div className="classroom-room-setup-box">{message}</div>
      <ul className="detail-list muted">
        <li>NEXT_PUBLIC_LIVEKIT_URL</li>
        <li>LIVEKIT_API_KEY</li>
        <li>LIVEKIT_API_SECRET</li>
      </ul>
    </article>
  );
}

function formatCountdownLabel(targetIso: string | null) {
  if (!targetIso) {
    return "Token refresh pending";
  }

  const diffMs = new Date(targetIso).getTime() - Date.now();
  if (!Number.isFinite(diffMs) || diffMs <= 0) {
    return "Token refresh due";
  }

  const totalMinutes = Math.ceil(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `Token refresh in ${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }

  return `Token refresh in ${minutes}m`;
}

function RoomInviteBanner({ roomJoinUrl }: { roomJoinUrl: string }) {
  const [copied, setCopied] = useState(false);
  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(roomJoinUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="classroom-room-invite">
      <div>
        <span className="eyebrow">Invite link</span>
        <strong>Share the same room with students or another tutor.</strong>
        <p>{roomJoinUrl}</p>
      </div>
      <div className="classroom-room-invite-actions">
        <span className="room-status-chip room-status-chip-sync">{copied ? "Copied" : "Ready to share"}</span>
        <button type="button" className="button button-secondary button-small" onClick={copyInviteLink}>
          Copy link
        </button>
        <a href={roomJoinUrl} className="button button-secondary button-small">
          Open room link
        </a>
      </div>
    </div>
  );
}

function ArchiveConfirmationBanner({ archive, syncedFromLiveRoom }: ArchiveBannerProps) {
  return (
    <div className="classroom-archive-banner classroom-archive-banner-persistent">
      <div>
        <span className="eyebrow">Lesson archived</span>
        <strong>{archive.title}</strong>
        <p>
          Saved to the library for {archive.boardLabel}. {syncedFromLiveRoom ? "The archive came directly from the live room." : "The record is ready to review."}
        </p>
      </div>
      <div className="classroom-archive-banner-actions">
        <span className="room-status-chip room-status-chip-saved">Archived</span>
        <a href="/app/library" className="button button-secondary button-small">
          Open library
        </a>
      </div>
    </div>
  );
}

function callStyleLabel(roomState: ConnectionState, participantCount: number, speakingCount: number) {
  if (roomState !== ConnectionState.Connected) {
    return "Preparing the room";
  }

  if (speakingCount > 0) {
    return `${speakingCount} active speaker${speakingCount === 1 ? "" : "s"}`;
  }

  return `${participantCount} in the room`;
}

function getRoomAvatarLabel(roomTitle: string) {
  return roomTitle
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getParticipantRoleLabel(participant: { metadata?: string | null }) {
  try {
    const metadata = participant.metadata ? JSON.parse(participant.metadata) : {};
    return typeof metadata.role === "string" && metadata.role.trim() ? metadata.role : "guest";
  } catch {
    return "guest";
  }
}

function getConnectionStrengthLabel(connectionQuality: unknown, roomState: ConnectionState) {
  if (roomState !== ConnectionState.Connected) {
    return "Connecting";
  }

  const normalized = String(connectionQuality ?? "stable").toLowerCase();
  if (/^\d+$/.test(normalized)) {
    return "Stable";
  }
  if (normalized.includes("excellent")) {
    return "Excellent";
  }
  if (normalized.includes("good")) {
    return "Good";
  }
  if (normalized.includes("fair")) {
    return "Fair";
  }
  if (normalized.includes("poor")) {
    return "Poor";
  }
  if (normalized.includes("unknown")) {
    return "Stable";
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function ConnectedClassroomRoom({
  role,
  roomTitle,
  roomSubtitle,
  nextLessonLabel,
  roomName,
  roomJoinUrl,
  roomLabel,
  testActorEmail,
  clients,
  sessions,
  materials,
  history,
  compliance,
  sessionDigest,
  archives,
  onSessionEnded,
  onArchiveSaved,
  roomWatchdogLabel,
  roomConnectionState,
  onReconnectNow,
}: ClassroomRoomProps) {
  const room = useRoomContext();
  const layoutContext = useCreateLayoutContext();
  const speakingParticipants = useSpeakingParticipants();
  const [roomTimeLabel, setRoomTimeLabel] = useState(() =>
    new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date()),
  );
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    {
      onlySubscribed: false,
    },
  );
  const [incomingSnapshot, setIncomingSnapshot] = useState<ClassroomBoardSnapshot | null>(null);
  const [sourceId] = useState(() => globalThis.crypto?.randomUUID?.() || roomName);
  const [focusedTrackId, setFocusedTrackId] = useState<string | null>(null);
  const [controlsExpanded, setControlsExpanded] = useState(false);
  const [mutedTileIds, setMutedTileIds] = useState<string[]>([]);
  const roomAvatar = getRoomAvatarLabel(roomTitle);

  const participants = useMemo<ClassroomRoomParticipant[]>(() => {
    const remote = Array.from(room.remoteParticipants.values()).map((participant: RemoteParticipant) => ({
      id: participant.identity,
      name: participant.name || participant.identity,
      role: (() => {
        try {
          return participant.metadata ? (JSON.parse(participant.metadata || "{}").role as string) || "guest" : "guest";
        } catch {
          return "guest";
        }
      })(),
      active: participant.isSpeaking || participant.connectionQuality !== undefined,
      speaking: participant.isSpeaking,
    }));

    return [
      {
        id: room.localParticipant.identity,
        name: room.localParticipant.name || room.localParticipant.identity,
        role,
        active: true,
        speaking: room.localParticipant.isSpeaking,
      },
      ...remote,
    ];
  }, [room, role]);
  const connectedParticipantCount = 1 + room.remoteParticipants.size;
  const speakingParticipantCount = participants.filter((participant) => participant.speaking).length;
  const activeParticipantCount = participants.filter((participant) => participant.active).length;
  const liveTrackRefs = useMemo(
    () =>
      tracks.filter((trackRef) => {
        const participantIdentity = "participant" in trackRef ? trackRef.participant.identity : null;
        return Boolean(participantIdentity);
      }),
    [tracks],
  );
  const activeSpeakerTrack = useMemo(() => {
    const activeSpeaker = speakingParticipants[0];
    if (!activeSpeaker) {
      return liveTrackRefs[0] || null;
    }

    return (
      liveTrackRefs.find((trackRef) => "participant" in trackRef && trackRef.participant.identity === activeSpeaker.identity) ||
      liveTrackRefs[0] ||
      null
    );
  }, [liveTrackRefs, speakingParticipants]);
  const focusedTrack = useMemo(() => {
    if (focusedTrackId) {
      const selected = liveTrackRefs.find((trackRef) => "participant" in trackRef && trackRef.participant.identity === focusedTrackId);
      if (selected) {
        return selected;
      }
    }

    return activeSpeakerTrack;
  }, [activeSpeakerTrack, focusedTrackId, liveTrackRefs]);
  const sideTracks = useMemo(
    () => liveTrackRefs.filter((trackRef) => trackRef !== focusedTrack),
    [focusedTrack, liveTrackRefs],
  );
  const roomStatusLabel = callStyleLabel(room.state, connectedParticipantCount, speakingParticipantCount);
  const hasSpeakingEnergy = speakingParticipantCount > 0;
  const isFocusedSpeaker = Boolean(hasSpeakingEnergy && focusedTrack && activeSpeakerTrack && focusedTrack === activeSpeakerTrack);
  const connectionStrengthLabel = getConnectionStrengthLabel(room.localParticipant.connectionQuality, room.state);
  const roomStateLabel =
    roomConnectionState || (room.state === ConnectionState.Connected ? "Connected" : room.state === ConnectionState.Reconnecting ? "Reconnecting" : "Connecting");
  const toggleFocusedTrack = (trackIdentity: string) => {
    setFocusedTrackId((current) => (current === trackIdentity ? null : trackIdentity));
  };
  const toggleMutedTile = (trackIdentity: string) => {
    setMutedTileIds((current) =>
      current.includes(trackIdentity) ? current.filter((entry) => entry !== trackIdentity) : [...current, trackIdentity],
    );
  };

  useEffect(() => {
    const updateClock = () => {
      setRoomTimeLabel(
        new Intl.DateTimeFormat(undefined, {
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date()),
      );
    };

    updateClock();
    const timer = window.setInterval(updateClock, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleData = (payload: Uint8Array, _participant?: RemoteParticipant, _kind?: unknown, topic?: string) => {
      if (topic !== "classroom-board") {
        return;
      }

      const snapshot = parseClassroomBoardSnapshot(new TextDecoder().decode(payload));
      if (!snapshot || snapshot.source === sourceId) {
        return;
      }

      setIncomingSnapshot(snapshot);
    };

    room.on(RoomEvent.DataReceived, handleData);
    return () => {
      room.off(RoomEvent.DataReceived, handleData);
    };
  }, [room, sourceId]);

  const syncBridge: ClassroomSyncBridge = {
    connected: room.state === ConnectionState.Connected,
    roomName,
    sourceId,
    participantCount: room.numParticipants,
    publishSnapshot: async (snapshot) => {
      await room.localParticipant.publishData(new TextEncoder().encode(JSON.stringify(snapshot)), {
        reliable: true,
        topic: "classroom-board",
      });
    },
  };

  return (
    <LayoutContextProvider value={layoutContext}>
      <>
      <RoomInviteBanner roomJoinUrl={roomJoinUrl} />
      {room.state !== ConnectionState.Connected ? (
        <div className="classroom-room-reconnect">
          <div>
            <span className="eyebrow">Room status</span>
            <strong>{roomStateLabel}</strong>
            <p>{roomStatusLabel}</p>
          </div>
          <div className="classroom-room-invite-actions">
            <span className="room-status-chip room-status-chip-sync">{roomStateLabel}</span>
            <button type="button" className="button button-secondary button-small" onClick={onReconnectNow}>
              Reconnect now
            </button>
          </div>
        </div>
      ) : null}
      <article className="panel classroom-live-panel">
        <div className="classroom-room-header">
          <div className="section-head compact">
              <div className="classroom-room-identity">
                <div className="classroom-room-avatar" aria-hidden="true">
                  {roomAvatar || "LK"}
                </div>
                <div>
                  <span className="eyebrow">Live classroom</span>
                  <h2>{roomTitle}</h2>
                  <p>{roomLabel}</p>
                  <div className="classroom-room-meta">
                    <span>{roomTimeLabel}</span>
                    <span aria-hidden="true">•</span>
                    <span>Signal {connectionStrengthLabel}</span>
                  </div>
                  <div className="classroom-room-mini-stats">
                    <span className="room-status-chip room-status-chip-present">{connectedParticipantCount} present</span>
                    <span className="room-status-chip room-status-chip-speaking">{speakingParticipantCount} speaking</span>
                  </div>
                </div>
            </div>
          </div>
          <div className="classroom-room-status">
            <span className="room-status-chip room-status-chip-connected">
              {room.state === ConnectionState.Connected ? "Connected" : "Connecting"}
            </span>
            <span className={`room-status-chip room-status-chip-live ${hasSpeakingEnergy ? "room-status-chip-pulse" : ""}`}>
              {roomStatusLabel}
            </span>
            <span className="room-status-chip room-status-chip-active">{activeParticipantCount} active</span>
          </div>
        </div>

        <div className="classroom-live-grid">
            <FocusLayoutContainer className="classroom-meet-layout">
              <aside className="classroom-meet-rail">
                <div className="classroom-meet-rail-card">
                  <div className="classroom-meet-rail-head">
                    <strong>Speaker rail</strong>
                    <button
                      type="button"
                      className="button button-secondary button-small"
                      onClick={() => {
                        if (focusedTrack && "participant" in focusedTrack) {
                          toggleFocusedTrack(focusedTrack.participant.identity);
                        }
                      }}
                      disabled={!focusedTrack || !("participant" in focusedTrack)}
                    >
                      {focusedTrack && "participant" in focusedTrack && focusedTrackId === focusedTrack.participant.identity ? "Unpin speaker" : "Pin speaker"}
                    </button>
                  </div>
                  <span className="classroom-meet-rail-meta">{sideTracks.length ? `${sideTracks.length + 1} video tiles` : "One main tile"}</span>
                  <div className="classroom-meet-rail-thumbs">
                    {focusedTrack ? (
                      <div
                        className={`classroom-meet-thumb classroom-meet-thumb-focus ${focusedTrackId ? "classroom-meet-thumb-pinned" : ""} ${
                          isFocusedSpeaker ? "classroom-meet-thumb-speaking" : ""
                        }`}
                      >
                        <div
                          className="classroom-meet-thumb-surface"
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            if ("participant" in focusedTrack) {
                              toggleFocusedTrack(focusedTrack.participant.identity);
                            }
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              if ("participant" in focusedTrack) {
                                toggleFocusedTrack(focusedTrack.participant.identity);
                              }
                            }
                          }}
                        >
                          <FocusLayout trackRef={focusedTrack} className="classroom-meet-focus-tile" />
                        </div>
                        <div className="classroom-meet-thumb-actions">
                          <button
                            type="button"
                            className="room-status-chip room-status-chip-connected classroom-meet-action"
                            onClick={() => {
                              if ("participant" in focusedTrack) {
                                toggleFocusedTrack(focusedTrack.participant.identity);
                              }
                            }}
                          >
                            {focusedTrackId ? "Unpin" : "Pin"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="empty-state">Waiting for a camera feed.</div>
                    )}
                    {sideTracks.slice(0, 3).map((trackRef, index) => {
                      const participant = "participant" in trackRef ? trackRef.participant : null;
                      const identity = participant ? participant.identity : `placeholder-${index}`;
                      const participantName = participant?.name || identity;
                      const participantRole = participant ? getParticipantRoleLabel(participant) : "guest";
                      const isSpeaking = Boolean(participant?.isSpeaking);
                      const isMuted = mutedTileIds.includes(identity);
                      return (
                        <div
                          key={`side-track-${index}`}
                          className={`classroom-meet-thumb ${focusedTrackId === identity ? "classroom-meet-thumb-pinned" : ""} ${isMuted ? "classroom-meet-thumb-muted" : ""}`}
                        >
                          <div
                            className="classroom-meet-thumb-surface"
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              if (participant) {
                                toggleFocusedTrack(identity);
                              }
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                if (participant) {
                                  toggleFocusedTrack(identity);
                                }
                              }
                            }}
                          >
                            <ParticipantTile trackRef={trackRef} disableSpeakingIndicator />
                          </div>
                          <div className="classroom-meet-thumb-actions">
                            <button
                              type="button"
                              className="room-status-chip room-status-chip-connected classroom-meet-action"
                              onClick={() => {
                                if (participant) {
                                  toggleFocusedTrack(identity);
                                }
                              }}
                            >
                              {focusedTrackId === identity ? "Pinned" : "Pin"}
                            </button>
                            <button
                              type="button"
                              className="room-status-chip room-status-chip-sync classroom-meet-action"
                              onClick={() => {
                                if (participant) {
                                  toggleMutedTile(identity);
                                }
                              }}
                            >
                              {isMuted ? "Unmute tile" : "Mute tile"}
                            </button>
                          </div>
                          <div className="classroom-meet-thumb-footer">
                            <div className="classroom-meet-thumb-labels">
                              <strong>{participantName}</strong>
                              <span>{participantRole}</span>
                            </div>
                            <div className="classroom-meet-thumb-status">
                              <span
                                className={`classroom-meet-thumb-speaking-indicator ${isSpeaking && !isMuted ? "active" : ""}`}
                                aria-hidden="true"
                              />
                              <span className={`room-status-chip room-status-chip-live ${isMuted ? "" : "room-status-chip-pulse"}`}>
                                {isMuted ? "Muted tile" : "Live"}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </aside>

              <section className="classroom-meet-stage">
                <div className={`classroom-meet-stage-surface ${hasSpeakingEnergy ? "classroom-meet-stage-speaking" : ""}`}>
                  {focusedTrack ? (
                    <FocusLayout trackRef={focusedTrack} className="classroom-meet-focus-stage" />
                  ) : (
                    <div className="classroom-meet-empty">
                      <strong>Waiting for video</strong>
                      <span>Use the pre-join screen to start camera and mic, then the call will feel more like Meet.</span>
                    </div>
                  )}
                </div>
              </section>
            </FocusLayoutContainer>
        </div>
        <RoomAudioRenderer />
        <div className="classroom-room-actions">
          <div className="classroom-toolbar classroom-room-toolbar">
            <span className="toolbar-pill active">Camera on</span>
            <span className="toolbar-pill active">Microphone on</span>
            <span className="toolbar-pill active">Screen share ready</span>
            <span className="toolbar-pill active">Room: {roomName}</span>
            {roomWatchdogLabel ? <span className="toolbar-pill active">{roomWatchdogLabel}</span> : null}
          </div>
          <div className="classroom-bottom-dock">
            <button type="button" className="button button-secondary" onClick={() => setControlsExpanded((current) => !current)}>
              {controlsExpanded ? "Hide device setup" : "Show device setup"}
            </button>
            <div className={`classroom-device-panel ${controlsExpanded ? "open" : ""}`}>
              <MediaDeviceMenu kind="audioinput" className="button button-secondary" requestPermissions>
                Microphone
              </MediaDeviceMenu>
              <MediaDeviceMenu kind="videoinput" className="button button-secondary" requestPermissions>
                Camera
              </MediaDeviceMenu>
            </div>
            <ControlBar
              variation="textOnly"
              controls={{ microphone: true, camera: true, screenShare: true, leave: true, chat: false, settings: true }}
            />
          </div>
        </div>
      </article>

      <ClassroomStudio
        role={role}
        roomTitle={roomTitle}
        roomSubtitle={roomSubtitle}
        nextLessonLabel={nextLessonLabel}
        testActorEmail={testActorEmail}
        clients={clients}
        sessions={sessions}
        materials={materials}
        history={history}
        compliance={compliance}
        sessionDigest={sessionDigest}
        archives={archives}
        meetingStatus="Live room connected"
        roomParticipants={participants}
        syncBridge={syncBridge}
        incomingSnapshot={incomingSnapshot}
        onSessionEnded={onSessionEnded}
        onArchiveSaved={onArchiveSaved}
      />
      </>
    </LayoutContextProvider>
  );
}

export function ClassroomRoom(props: ClassroomRoomProps) {
  const testActorEmail = props.testActorEmail;
  const [room] = useState(() => new Room());
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState("");
  const [tokenExpiresAt, setTokenExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [connectionState, setConnectionState] = useState(room.state);
  const [watchdogLabel, setWatchdogLabel] = useState("Token refresh pending");
  const [connectNonce, setConnectNonce] = useState(0);
  const [recentArchive, setRecentArchive] = useState<ClassroomArchive | null>(null);
  const [defaults, setDefaults] = useState<LocalUserChoices | null>(() => ({
    audioEnabled: false,
    audioDeviceId: "",
    videoEnabled: false,
    videoDeviceId: "",
    username: props.roomTitle,
  }));
  const reconnectTimerRef = useRef<number | null>(null);
  const tokenRefreshTimerRef = useRef<number | null>(null);
  const keepConnectedRef = useRef(false);
  const archiveStorageKey = `megastar:classroom:archive:${props.roomName}`;

  const loadRoomAccess = useCallback(async () => {
    setLoading(true);
    setError(null);
    setToken(null);
    setServerUrl("");
    setTokenExpiresAt(null);

    try {
      const tokenUrl = new URL("/api/classroom/token", window.location.origin);
      tokenUrl.searchParams.set("roomName", props.roomName);
      if (testActorEmail) {
        tokenUrl.searchParams.set("testActor", testActorEmail);
      }
      const response = await fetch(tokenUrl, {
        method: "GET",
      });

      const payload = (await response.json()) as {
        token?: string;
        serverUrl?: string;
        expiresAt?: string;
        error?: string;
        setup?: string[];
      };
      if (!response.ok || !payload.token) {
        const setup = payload.setup?.length ? `Missing: ${payload.setup.join(", ")}` : payload.error || "Unable to join the room.";
        throw new Error(setup);
      }

      if (!payload.serverUrl) {
        throw new Error("Live room URL is missing.");
      }

      setToken(payload.token);
      setServerUrl(payload.serverUrl);
      if (payload.expiresAt) {
        setTokenExpiresAt(payload.expiresAt);
        setWatchdogLabel(formatCountdownLabel(payload.expiresAt));
      }

      return {
        token: payload.token,
        serverUrl: payload.serverUrl,
        expiresAt: payload.expiresAt || null,
      };
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to join the room.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [props.roomName, testActorEmail]);

  useEffect(() => {
    try {
      const storedArchive = window.sessionStorage.getItem(archiveStorageKey);
      setRecentArchive(storedArchive ? (JSON.parse(storedArchive) as ClassroomArchive) : null);
    } catch {
      setRecentArchive(null);
    }
  }, [archiveStorageKey]);

  useEffect(() => {
    try {
      if (recentArchive) {
        window.sessionStorage.setItem(archiveStorageKey, JSON.stringify(recentArchive));
      } else {
        window.sessionStorage.removeItem(archiveStorageKey);
      }
    } catch {
      // Session storage is a convenience layer only; ignore persistence failures.
    }
  }, [archiveStorageKey, recentArchive]);

  useEffect(() => {
    void loadRoomAccess();
    return () => {
      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
      }
      if (tokenRefreshTimerRef.current) {
        window.clearTimeout(tokenRefreshTimerRef.current);
      }
      room.disconnect().catch(() => undefined);
    };
  }, [loadRoomAccess, room]);

  useEffect(() => {
    const handleConnected = () => {
      keepConnectedRef.current = true;
      setConnectionState(ConnectionState.Connected);
      setWatchdogLabel(tokenExpiresAt ? formatCountdownLabel(tokenExpiresAt) : "Connected");
    };

    const handleReconnecting = () => {
      setConnectionState(ConnectionState.Reconnecting);
    };

    const handleSignalReconnecting = () => {
      setConnectionState(ConnectionState.SignalReconnecting);
    };

    const handleDisconnected = () => {
      setConnectionState(ConnectionState.Disconnected);
      if (!keepConnectedRef.current || !joined || !serverUrl || !token) {
        return;
      }

      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
      }

      reconnectTimerRef.current = window.setTimeout(() => {
        setWatchdogLabel("Reconnecting...");
        setConnectNonce((current) => current + 1);
      }, 2500);
    };

    const handleReconnected = () => {
      setConnectionState(ConnectionState.Connected);
      setWatchdogLabel(tokenExpiresAt ? formatCountdownLabel(tokenExpiresAt) : "Connected");
    };

    room
      .on(RoomEvent.Connected, handleConnected)
      .on(RoomEvent.Reconnecting, handleReconnecting)
      .on(RoomEvent.SignalReconnecting, handleSignalReconnecting)
      .on(RoomEvent.Disconnected, handleDisconnected)
      .on(RoomEvent.Reconnected, handleReconnected);

    return () => {
      room
        .off(RoomEvent.Connected, handleConnected)
        .off(RoomEvent.Reconnecting, handleReconnecting)
        .off(RoomEvent.SignalReconnecting, handleSignalReconnecting)
        .off(RoomEvent.Disconnected, handleDisconnected)
        .off(RoomEvent.Reconnected, handleReconnected);
    };
  }, [joined, room, serverUrl, token, tokenExpiresAt]);

  useEffect(() => {
    if (!joined || !tokenExpiresAt) {
      return;
    }

    const refreshAt = new Date(tokenExpiresAt).getTime() - 10 * 60 * 1000;
    const delay = Math.max(60_000, refreshAt - Date.now());
    setWatchdogLabel(formatCountdownLabel(tokenExpiresAt));

    if (tokenRefreshTimerRef.current) {
      window.clearTimeout(tokenRefreshTimerRef.current);
    }

    tokenRefreshTimerRef.current = window.setTimeout(() => {
      void loadRoomAccess();
    }, delay);

    return () => {
      if (tokenRefreshTimerRef.current) {
        window.clearTimeout(tokenRefreshTimerRef.current);
      }
    };
  }, [joined, loadRoomAccess, tokenExpiresAt]);

  useEffect(() => {
    if (!joined || !token || !serverUrl) {
      return;
    }

    keepConnectedRef.current = true;
    setError(null);
  }, [joined, serverUrl, token]);

  const reconnectRoom = async () => {
    keepConnectedRef.current = true;
    const access = token && serverUrl ? { token, serverUrl, expiresAt: tokenExpiresAt } : await loadRoomAccess();
    if (!access) {
      return;
    }

    if (room.state !== ConnectionState.Disconnected) {
      await room.disconnect();
    }

    setWatchdogLabel("Reconnecting...");
    setConnectionState(ConnectionState.Reconnecting);
    setConnectNonce((current) => current + 1);
    if (access.expiresAt) {
      setWatchdogLabel(formatCountdownLabel(access.expiresAt));
    }
  };

  const handleArchiveSaved = useCallback((archive: ClassroomArchive) => {
    setRecentArchive(archive);
  }, []);

  const endLiveSession = async () => {
    keepConnectedRef.current = false;
    if (reconnectTimerRef.current) {
      window.clearTimeout(reconnectTimerRef.current);
    }
    if (tokenRefreshTimerRef.current) {
      window.clearTimeout(tokenRefreshTimerRef.current);
    }
    await room.disconnect();
    setJoined(false);
  };

  if (error) {
    return (
      <>
        <RoomInviteBanner roomJoinUrl={props.roomJoinUrl} />
        {recentArchive ? <ArchiveConfirmationBanner archive={recentArchive} syncedFromLiveRoom={true} /> : null}
        <LiveKitSetupCard message={error} />
        <ClassroomStudio
          role={props.role}
          roomTitle={props.roomTitle}
          roomSubtitle={props.roomSubtitle}
          nextLessonLabel={props.nextLessonLabel}
          clients={props.clients}
          sessions={props.sessions}
          materials={props.materials}
          history={props.history}
          compliance={props.compliance}
          sessionDigest={props.sessionDigest}
          archives={props.archives}
          meetingStatus="Live room not connected yet"
          roomWatchdogLabel={watchdogLabel}
          onArchiveSaved={handleArchiveSaved}
        />
      </>
    );
  }

  if (!token || loading) {
    return (
      <>
        <RoomInviteBanner roomJoinUrl={props.roomJoinUrl} />
        {recentArchive ? <ArchiveConfirmationBanner archive={recentArchive} syncedFromLiveRoom={true} /> : null}
        <LiveKitSetupCard
          message={
            loading
              ? "Preparing the live room..."
              : "Waiting for the room token. The lesson board is ready while the meeting layer connects."
          }
        />
        <ClassroomStudio
          role={props.role}
          roomTitle={props.roomTitle}
          roomSubtitle={props.roomSubtitle}
          nextLessonLabel={props.nextLessonLabel}
          clients={props.clients}
          sessions={props.sessions}
          materials={props.materials}
          history={props.history}
          compliance={props.compliance}
          sessionDigest={props.sessionDigest}
          archives={props.archives}
          meetingStatus={loading ? "Preparing the live room" : "Room token pending"}
          roomWatchdogLabel={watchdogLabel}
          onArchiveSaved={handleArchiveSaved}
        />
      </>
    );
  }

  if (!joined) {
    return (
      <>
        <RoomInviteBanner roomJoinUrl={props.roomJoinUrl} />
        {recentArchive ? <ArchiveConfirmationBanner archive={recentArchive} syncedFromLiveRoom={true} /> : null}
        <LiveKitSetupCard
          message="Choose your camera and mic, then join the room with the right device setup."
        />
        <article className="panel classroom-prejoin-panel">
          <div className="classroom-prejoin-layout">
            <div className="classroom-prejoin-card">
              <div className="classroom-prejoin-avatar" aria-hidden="true">
                {getRoomAvatarLabel(props.roomTitle) || "LK"}
              </div>
              <div className="classroom-prejoin-copy">
                <span className="eyebrow">Before you join</span>
                <h2>Meet-style setup</h2>
                <p>Select your devices first so the room opens already tuned for teaching.</p>
              </div>
              <div className="classroom-prejoin-meta">
                <div>
                  <span>Room</span>
                  <strong>{props.roomTitle}</strong>
                </div>
                <div>
                  <span>Mode</span>
                  <strong>Audio + video</strong>
                </div>
                <div>
                  <span>Focus</span>
                  <strong>{props.roomLabel}</strong>
                </div>
              </div>
            </div>
            <div className="classroom-prejoin-form">
              <PreJoin
                defaults={defaults || undefined}
                joinLabel="Enter live room"
                micLabel="Microphone"
                camLabel="Camera"
                userLabel="Your name"
                persistUserChoices
                onSubmit={(values) => {
                  setRecentArchive(null);
                  setDefaults(values);
                  setJoined(true);
                }}
              />
            </div>
          </div>
        </article>
      </>
    );
  }

  return (
    <LiveKitRoom
      key={connectNonce}
      room={room}
      serverUrl={serverUrl}
      token={token}
      audio={defaults?.audioEnabled ? { deviceId: defaults.audioDeviceId || undefined } : false}
      video={defaults?.videoEnabled ? { deviceId: defaults.videoDeviceId || undefined } : false}
      screen={false}
      connect={joined}
      className="classroom-livekit-room"
      data-lk-theme="default"
    >
      <ConnectedClassroomRoom
        {...props}
        roomWatchdogLabel={watchdogLabel}
        roomConnectionState={connectionState}
        onReconnectNow={reconnectRoom}
        onSessionEnded={endLiveSession}
        onArchiveSaved={handleArchiveSaved}
      />
    </LiveKitRoom>
  );
}
