import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { ClassroomRoom } from "@/components/classroom-room";
import { buildClassroomViewModel } from "@/lib/classroom";
import { getWorkspaceOverview } from "@/lib/repository";
import { requireActor } from "@/lib/current-actor";

export default async function ClassroomPage({
  searchParams,
}: {
  searchParams?: Promise<{ roomName?: string; testActor?: string }>;
}) {
  const actor = await requireActor();
  const resolvedSearchParams = (await searchParams) || {};
  const overview = await getWorkspaceOverview(actor);
  const classroom = buildClassroomViewModel(overview, actor.role || "tutor", overview.preferences.market);
  const nextSession = overview.upcomingSessions[0] || overview.recentSessions[0] || null;
  const roomName = (resolvedSearchParams.roomName || `megastar-${nextSession?.id || overview.clients[0]?.id || actor.clerkUserId}`).toLowerCase();
  const roomJoinUrl = `/classroom?roomName=${encodeURIComponent(roomName)}`;
  const primaryReturn = actor.role === "client" ? "/dashboard" : "/app";

  return (
    <div className="workspace-grid classroom-page">
      <PageIntro
        eyebrow="Live classroom"
        title="Teach, draw, talk, and keep the lesson together."
        description="A shared teaching room with a whiteboard, video space, lesson trail, and downloadable materials."
      >
        <Link href={primaryReturn} className="button button-secondary">
          Back to dashboard
        </Link>
        <Link href="/app/calendar" className="button button-secondary">
          Open calendar
        </Link>
        <Link href="/app/library" className="button button-secondary">
          Open library
        </Link>
      </PageIntro>

      <ClassroomRoom
        role={actor.role || "tutor"}
        roomTitle={classroom.roomTitle}
        roomSubtitle={classroom.roomSubtitle}
        nextLessonLabel={classroom.nextLessonLabel}
        roomName={roomName}
        roomJoinUrl={roomJoinUrl}
        roomLabel={classroom.roomSubtitle}
        testActorEmail={resolvedSearchParams.testActor || null}
        clients={overview.clients.map((client) => ({
          id: client.id,
          name: client.name,
          billTo: client.billTo,
        }))}
        sessions={overview.upcomingSessions.map((session) => ({
          id: session.id,
          title: session.title,
          startsAt: new Date(session.startsAt).toISOString(),
          status: session.status,
          notes: session.notes,
          billable: session.billable,
          amountCents: session.amountCents,
          clientName: overview.clients.find((client) => client.id === session.clientId)?.name || session.title,
        }))}
        materials={classroom.materials}
        history={classroom.history}
        compliance={classroom.compliance}
        sessionDigest={classroom.sessionDigest}
        archives={overview.archives.map((archive) => ({
          id: archive.id,
          title: archive.title,
          summary: archive.summary,
          boardLabel: archive.boardLabel,
          snapshotJson: archive.snapshotJson,
          fileName: archive.fileName,
          createdAt: new Date(archive.createdAt).toISOString(),
        }))}
      />
    </div>
  );
}
