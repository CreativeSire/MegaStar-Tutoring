import { formatShortDateTime } from "@/lib/format";
import type { getWorkspaceOverview } from "@/lib/repository";

type WorkspaceOverview = Awaited<ReturnType<typeof getWorkspaceOverview>>;

type Tone = "good" | "warm" | "alert" | "info";

export type MessageCard = {
  title: string;
  detail: string;
  meta: string;
  tone: Tone;
  href?: string;
  linkLabel?: string;
};

export type NoteCard = {
  title: string;
  detail: string;
  meta: string;
  tone: Tone;
  href?: string;
  linkLabel?: string;
};

function statusLabel(status: WorkspaceOverview["sessions"][number]["status"]) {
  switch (status) {
    case "completed":
      return "Done";
    case "missed":
      return "Needs follow-up";
    case "rescheduled":
      return "Moved";
    case "partial":
      return "Partly done";
    default:
      return "Planned";
  }
}

function toneForStatus(status: WorkspaceOverview["sessions"][number]["status"]) {
  switch (status) {
    case "completed":
      return "good";
    case "missed":
      return "alert";
    case "rescheduled":
      return "warm";
    default:
      return "info";
  }
}

function sessionClientName(overview: WorkspaceOverview, clientId: string | null) {
  return overview.clients.find((client) => client.id === clientId)?.name || "Unassigned";
}

export function buildTutorLessonNotes(overview: WorkspaceOverview) {
  const latestSession = overview.recentSessions[0] || null;
  const noteCards: NoteCard[] = overview.recentSessions.length
    ? overview.recentSessions.slice(0, 5).map((session) => ({
        title: session.title,
        detail: session.notes || "No note added yet.",
        meta: `${sessionClientName(overview, session.clientId)} · ${formatShortDateTime(session.startsAt)}`,
        tone: toneForStatus(session.status),
        href: session.clientId ? `/app/clients/${session.clientId}` : undefined,
        linkLabel: "Open student",
      }))
    : [
        {
          title: "No lesson notes yet",
          detail: "Once a lesson is saved, the note will appear here.",
          meta: "Ready for your first session",
          tone: "warm",
        },
      ];

  const focusCards: NoteCard[] = [
    latestSession
      ? {
          title: "Latest note",
          detail: latestSession.notes || "The most recent lesson note will show here.",
          meta: `${sessionClientName(overview, latestSession.clientId)} · ${formatShortDateTime(latestSession.startsAt)}`,
          tone: toneForStatus(latestSession.status),
          href: latestSession.clientId ? `/app/clients/${latestSession.clientId}` : undefined,
          linkLabel: "Open student",
        }
      : {
          title: "Latest note",
          detail: "Your next saved lesson will become the latest note.",
          meta: "Waiting for a lesson",
          tone: "warm",
        },
    overview.missedSessionCount > 0
      ? {
          title: "Follow-up needed",
          detail: `${overview.missedSessionCount} lesson${overview.missedSessionCount === 1 ? "" : "s"} may need a gentle check-in.`,
          meta: "Best to handle soon",
          tone: "alert",
        }
      : {
          title: "Follow-up needed",
          detail: "No follow-ups are waiting right now.",
          meta: "The week looks steady",
          tone: "good",
        },
    overview.upcomingSessions[0]
      ? {
          title: "Next lesson",
          detail: overview.upcomingSessions[0].notes || "A short note for the next lesson will appear here.",
          meta: `${sessionClientName(overview, overview.upcomingSessions[0].clientId)} · ${formatShortDateTime(overview.upcomingSessions[0].startsAt)}`,
          tone: "info",
        }
      : {
          title: "Next lesson",
          detail: "Add a lesson to keep the week moving.",
          meta: "Nothing booked yet",
          tone: "warm",
        },
  ];

  const quickPrompts: NoteCard[] = [
    {
      title: "Keep the same time",
      detail: "A short note to say the lesson stays on the same rhythm.",
      meta: "Calm and simple",
      tone: "info",
    },
    {
      title: "Move to another slot",
      detail: "A friendly note that gives the client a new time option.",
      meta: "Good for reschedules",
      tone: "warm",
    },
    {
      title: "Lesson summary",
      detail: "A short summary that keeps the important details together.",
      meta: "Useful after each lesson",
      tone: "good",
    },
  ];

  return { latestSession, noteCards, focusCards, quickPrompts };
}

export function buildTutorMessages(overview: WorkspaceOverview) {
  const threads: MessageCard[] = overview.clients.length
    ? overview.clients.slice(0, 5).map((client) => {
        const clientSessions = overview.sessions.filter((session) => session.clientId === client.id);
        const latestSession = clientSessions[0] || null;
        return {
          title: client.name,
          detail: latestSession?.notes || client.notes || "A short reply can go here after the latest lesson.",
          meta: latestSession
            ? `${statusLabel(latestSession.status)} · ${formatShortDateTime(latestSession.startsAt)}`
            : "No lesson yet",
          tone: latestSession ? toneForStatus(latestSession.status) : "warm",
          href: `/app/clients/${client.id}`,
          linkLabel: "Open student",
        };
      })
    : [
        {
          title: "No students yet",
          detail: "Add a student profile to begin a conversation.",
          meta: "Ready when you are",
          tone: "warm",
        },
      ];

  const replySuggestions: NoteCard[] = [
    {
      title: "Thanks, that works for me.",
      detail: "A simple reply that keeps the flow easy.",
      meta: "Short and clear",
      tone: "good",
    },
    {
      title: "Can we move this lesson?",
      detail: "A gentle way to ask for a new time.",
      meta: "Good for reschedules",
      tone: "warm",
    },
    {
      title: "Let's keep the same plan.",
      detail: "A quick note to keep the lesson moving forward.",
      meta: "Plain and calm",
      tone: "info",
    },
  ];

  const focusCards: NoteCard[] = [
    overview.missedSessionCount > 0
      ? {
          title: "Messages needing a reply",
          detail: `${overview.missedSessionCount} lesson${overview.missedSessionCount === 1 ? "" : "s"} may need a quick follow-up.`,
          meta: "Best to answer soon",
          tone: "alert",
        }
      : {
          title: "Messages needing a reply",
          detail: "No message is waiting right now.",
          meta: "The inbox looks calm",
          tone: "good",
        },
    overview.syncs[0]
      ? {
          title: "Calendar connected",
          detail: overview.syncs[0].statusMessage,
          meta: "Helpful for timing",
          tone: "info",
        }
      : {
          title: "Calendar ready",
          detail: "Connect the calendar when you want lessons to flow in automatically.",
          meta: "Optional",
          tone: "warm",
        },
    overview.upcomingSessions[0]
      ? {
          title: "Next lesson at a glance",
          detail: overview.upcomingSessions[0].title,
          meta: formatShortDateTime(overview.upcomingSessions[0].startsAt),
          tone: "good",
        }
      : {
          title: "Next lesson at a glance",
          detail: "Your next lesson will show here once it is booked.",
          meta: "Nothing booked yet",
          tone: "warm",
        },
  ];

  return { threads, replySuggestions, focusCards };
}

export function buildStudentMessages(overview: WorkspaceOverview) {
  const latestSession = overview.recentSessions[0] || null;
  const threads: MessageCard[] = overview.recentSessions.length
    ? overview.recentSessions.slice(0, 4).map((session) => ({
        title: session.title,
        detail: session.notes || "A short note from your tutor will appear here.",
        meta: `${statusLabel(session.status)} · ${formatShortDateTime(session.startsAt)}`,
        tone: toneForStatus(session.status),
      }))
    : [
        {
          title: "No messages yet",
          detail: "Once a lesson is added, the latest note will appear here.",
          meta: "Waiting for your first lesson",
          tone: "warm",
        },
      ];

  const replySuggestions: NoteCard[] = [
    {
      title: "Thanks, I'll take a look.",
      detail: "A polite reply that keeps the conversation moving.",
      meta: "Simple and clear",
      tone: "good",
    },
    {
      title: "Could we move this lesson?",
      detail: "A helpful way to ask for a new time.",
      meta: "For reschedules",
      tone: "warm",
    },
    {
      title: "That works for me.",
      detail: "A short reply when the plan is fine.",
      meta: "Quick and easy",
      tone: "info",
    },
  ];

  const focusCards: NoteCard[] = [
    latestSession
      ? {
          title: "Latest note",
          detail: latestSession.notes || "A short note from the last lesson will appear here.",
          meta: formatShortDateTime(latestSession.startsAt),
          tone: toneForStatus(latestSession.status),
        }
      : {
          title: "Latest note",
          detail: "Your most recent lesson will show here once it is booked.",
          meta: "Waiting for a lesson",
          tone: "warm",
        },
    overview.upcomingSessions[0]
      ? {
          title: "Next lesson",
          detail: overview.upcomingSessions[0].title,
          meta: formatShortDateTime(overview.upcomingSessions[0].startsAt),
          tone: "info",
        }
      : {
          title: "Next lesson",
          detail: "Your next lesson will appear here when it is booked.",
          meta: "Nothing scheduled yet",
          tone: "warm",
        },
    overview.missedSessionCount > 0
      ? {
          title: "Needs a new time",
          detail: `${overview.missedSessionCount} lesson${overview.missedSessionCount === 1 ? "" : "s"} may need a fresh slot.`,
          meta: "If you want to move it",
          tone: "alert",
        }
      : {
          title: "Needs a new time",
          detail: "No lesson needs a new slot right now.",
          meta: "All clear",
          tone: "good",
        },
  ];

  return { threads, replySuggestions, focusCards };
}
