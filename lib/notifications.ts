import type { getWorkspaceOverview } from "@/lib/repository";

type NoticeTone = "good" | "warm" | "alert" | "info";

export type NoticeCard = {
  title: string;
  detail: string;
  tone: NoticeTone;
};

type WorkspaceOverview = Awaited<ReturnType<typeof getWorkspaceOverview>>;

export function buildTutorNotices(overview: WorkspaceOverview) {
  const notices: NoticeCard[] = [
    overview.missedSessionCount > 0
      ? {
          title: "Follow up on missed lessons",
          detail: `${overview.missedSessionCount} lesson${overview.missedSessionCount === 1 ? "" : "s"} still need a gentle follow-up.`,
          tone: "alert",
        }
      : {
          title: "No missed lessons waiting",
          detail: "The week looks calm right now.",
          tone: "good",
        },
    overview.syncs[0]
      ? {
          title: "Calendar is connected",
          detail: `Last updated ${overview.syncs[0].statusMessage.toLowerCase()}.`,
          tone: "info",
        }
      : {
          title: "Calendar is ready",
          detail: "Connect Google Calendar when you want the schedule to flow in automatically.",
          tone: "warm",
        },
    overview.ratingAverage > 0
      ? {
          title: "Tutor score is building",
          detail: `${overview.ratingAverage.toFixed(1)} out of 5 from verified reviews.`,
          tone: "good",
        }
      : {
          title: "Ask for the first review",
          detail: "A short review after a completed lesson helps the profile feel complete.",
          tone: "warm",
        },
  ];

  const scheduleCards: NoticeCard[] = overview.upcomingSessions.length
    ? overview.upcomingSessions.slice(0, 3).map((session) => ({
        title: session.title,
        detail: `${session.status} · ${new Date(session.startsAt).toLocaleString("en-GB", {
          weekday: "short",
          hour: "numeric",
          minute: "2-digit",
        })}`,
        tone: session.status === "missed" ? "alert" : "info",
      }))
    : [
        {
          title: "No lessons lined up yet",
          detail: "Add a student profile to see reminders here.",
          tone: "warm",
        },
      ];

  return { notices, scheduleCards };
}

export function buildStudentNotices(overview: WorkspaceOverview) {
  const notices: NoticeCard[] = [
    overview.upcomingSessions[0]
      ? {
          title: "Next lesson coming up",
          detail: `${overview.upcomingSessions[0].title} is the next thing on your list.`,
          tone: "good",
        }
      : {
          title: "Nothing booked yet",
          detail: "Once a lesson is added, it will appear here.",
          tone: "warm",
        },
    overview.missedSessionCount > 0
      ? {
          title: "One lesson needs attention",
          detail: `${overview.missedSessionCount} lesson${overview.missedSessionCount === 1 ? "" : "s"} may need a new time.`,
          tone: "alert",
        }
      : {
          title: "No missed lessons waiting",
          detail: "Everything looks steady for now.",
          tone: "good",
        },
    overview.syncs[0]
      ? {
          title: "Your calendar is connected",
          detail: overview.syncs[0].statusMessage,
          tone: "info",
        }
      : {
          title: "Calendar ready",
          detail: "Your tutor can connect the calendar when needed.",
          tone: "warm",
        },
  ];

  const sessionCards: NoticeCard[] = overview.recentSessions.length
    ? overview.recentSessions.slice(0, 3).map((session) => ({
        title: session.title,
        detail: session.notes || "A short note from the lesson will appear here.",
        tone: session.status === "missed" ? "alert" : "info",
      }))
    : [
        {
          title: "No recent lessons",
          detail: "Your lesson history will appear after the first session.",
          tone: "warm",
        },
      ];

  return { notices, sessionCards };
}
