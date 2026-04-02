import type { AppRole } from "@/lib/roles";
import { formatMoney, formatShortDateTime } from "@/lib/format";
import { getMarketProfile } from "@/lib/market";
import type { getWorkspaceOverview } from "@/lib/repository";

type WorkspaceOverview = Awaited<ReturnType<typeof getWorkspaceOverview>>;

export type ClassroomMaterial = {
  id: string;
  title: string;
  summary: string;
  kind: string;
  updatedAt: string;
  fileName: string;
  body: string;
};

export type ClassroomTimelineItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: "good" | "warm" | "alert" | "info";
};

export type ClassroomComplianceItem = {
  id: string;
  title: string;
  detail: string;
  status: "ready" | "recorded" | "review" | "locked";
};

export type ClassroomViewModel = {
  roomTitle: string;
  roomSubtitle: string;
  nextLessonLabel: string;
  materials: ClassroomMaterial[];
  history: ClassroomTimelineItem[];
  compliance: ClassroomComplianceItem[];
  sessionDigest: string;
};

function safeTitle(value: string | undefined, fallback: string) {
  return value && value.trim().length ? value.trim() : fallback;
}

function summarizeSession(session: WorkspaceOverview["sessions"][number], clientName: string, market?: string) {
  return [
    `Student: ${clientName}`,
    `Lesson: ${session.title}`,
    `When: ${formatShortDateTime(session.startsAt, market)}`,
    `Status: ${session.status}`,
    `Billable: ${session.billable ? "Yes" : "No"}`,
    `Amount: ${formatMoney(session.amountCents, market)}`,
    session.notes ? `Notes: ${session.notes}` : "Notes: None yet",
  ].join("\n");
}

export function buildClassroomViewModel(overview: WorkspaceOverview, role: AppRole, market?: string): ClassroomViewModel {
  const nextLesson = overview.upcomingSessions[0] || overview.recentSessions[0] || null;
  const nextClient = nextLesson ? overview.clients.find((client) => client.id === nextLesson.clientId) : null;
  const lessonTitle = nextLesson?.title || "Live classroom";
  const roomTitle = role === "client" ? "Your classroom" : "Teaching room";
  const roomSubtitle =
    role === "client"
      ? "A calm room for talking, drawing, and following the lesson together."
      : "A clear teaching space for live lessons, the whiteboard, and follow-up notes.";

  const materials: ClassroomMaterial[] = [
    {
      id: "lesson-summary",
      title: "Lesson summary",
      summary: "A short note you can save or share after each session.",
      kind: "Summary",
      updatedAt: nextLesson ? formatShortDateTime(nextLesson.startsAt, market) : "Ready now",
      fileName: `MegaStar Lesson Summary ${new Intl.DateTimeFormat(getMarketProfile(market).locale, {
        month: "long",
        year: "numeric",
      }).format(new Date())}.txt`,
      body: nextLesson
        ? summarizeSession(nextLesson, nextClient?.name || nextLesson.title, market)
        : "No lesson has been opened yet.\n\nAdd one session to generate a printable summary.",
    },
    {
      id: "board-notes",
      title: "Board notes",
      summary: "Use this for formulas, examples, and a quick recap of the board.",
      kind: "Board",
      updatedAt: overview.recentSessions[0] ? formatShortDateTime(overview.recentSessions[0].startsAt, market) : "Ready now",
      fileName: "MegaStar Board Notes.txt",
      body: overview.recentSessions
        .slice(0, 3)
        .map((session) => `• ${session.title} — ${session.notes || "No notes yet"}`)
        .join("\n"),
    },
    {
      id: "resource-pack",
      title: "Resource pack",
      summary: "A clean handout for the next lesson or revision block.",
      kind: "Material",
      updatedAt: overview.clients[0] ? formatShortDateTime(overview.clients[0].createdAt, market) : "Ready now",
      fileName: "MegaStar Resource Pack.txt",
      body: [
        "What to bring:",
        "- Notebook or tablet",
        "- Calculator if needed",
        "- Questions from the last lesson",
        "",
        "Lesson focus:",
        nextLesson?.title ? `- ${nextLesson.title}` : "- Set the next topic once a lesson starts.",
      ].join("\n"),
    },
  ];

  const history: ClassroomTimelineItem[] = (overview.upcomingSessions.length ? overview.upcomingSessions : overview.recentSessions)
    .slice(0, 5)
    .map((session) => {
      const client = overview.clients.find((entry) => entry.id === session.clientId);
      const tone =
        session.status === "missed" ? "alert" : session.status === "completed" ? "good" : session.status === "rescheduled" ? "warm" : "info";
      return {
        id: session.id,
        title: safeTitle(client?.name, session.title),
        detail: session.notes || `${session.status} lesson · ${session.billable ? formatMoney(session.amountCents, market) : "Not billable"}`,
        time: formatShortDateTime(session.startsAt, market),
        tone,
      } satisfies ClassroomTimelineItem;
    });

  const compliance: ClassroomComplianceItem[] = [
    {
      id: "access",
      title: "Role access",
      detail: role === "admin" ? "Full access to people, records, and settings." : "Teaching and lesson tools only.",
      status: role === "admin" ? "locked" : "ready",
    },
    {
      id: "history",
      title: "Lesson history",
      detail: overview.recentSessions.length ? "Recent sessions are ready to review or export." : "History will appear once lessons are added.",
      status: overview.recentSessions.length ? "recorded" : "review",
    },
    {
      id: "downloads",
      title: "Download packs",
      detail: "Board snapshots, summaries, and lesson notes can be saved when needed.",
      status: "ready",
    },
    {
      id: "calendar",
      title: "Calendar sync",
      detail: overview.syncs[0] ? overview.syncs[0].statusMessage : "Google Calendar can be connected from the calendar page.",
      status: overview.syncs[0] ? "recorded" : "review",
    },
  ];

  const sessionDigest = nextLesson
    ? summarizeSession(nextLesson, nextClient?.name || nextLesson.title)
    : "No lesson is selected yet.\n\nUse the classroom to begin a new teaching session.";

  return {
    roomTitle,
    roomSubtitle,
    nextLessonLabel: lessonTitle,
    materials,
    history,
    compliance,
    sessionDigest,
  };
}
