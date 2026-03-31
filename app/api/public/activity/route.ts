import { NextResponse } from "next/server";
import { getDatabase, hasDatabase } from "@/lib/db";
import { sessions, userProfiles } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export const revalidate = 30;

export async function GET() {
  try {
    if (!hasDatabase()) {
      return NextResponse.json({
        activity: [
          { user: "Alex M.", action: "booked a session", subject: "Mathematics", time: "2 min ago" },
          { user: "Sophie L.", action: "completed a lesson", subject: "Physics", time: "5 min ago" },
          { user: "Daniel K.", action: "improved grade to A", subject: "Chemistry", time: "12 min ago" },
          { user: "Emma R.", action: "joined MegaStar", subject: "English", time: "18 min ago" },
        ],
      });
    }

    const db = getDatabase();
    if (!db) {
      return NextResponse.json({
        activity: [
          { user: "Alex M.", action: "booked a session", subject: "Mathematics", time: "2 min ago" },
          { user: "Sophie L.", action: "completed a lesson", subject: "Physics", time: "5 min ago" },
          { user: "Daniel K.", action: "improved grade to A", subject: "Chemistry", time: "12 min ago" },
          { user: "Emma R.", action: "joined MegaStar", subject: "English", time: "18 min ago" },
        ],
      });
    }

    const recentSessions = await db
      .select({
        id: sessions.id,
        title: sessions.title,
        displayName: userProfiles.displayName,
        createdAt: sessions.createdAt,
      })
      .from(sessions)
      .innerJoin(userProfiles, sql`${sessions.ownerUserId} = ${userProfiles.id}`)
      .where(sql`${sessions.createdAt} > NOW() - INTERVAL '1 hour'`)
      .orderBy(sql`${sessions.createdAt} DESC`)
      .limit(4);

    const activity = recentSessions.map((s, i) => ({
      user: s.displayName?.split(" ")[0] || "Someone",
      action: i % 2 === 0 ? "booked a session" : "completed a lesson",
      subject: s.title?.split("-")[0]?.trim() || "Tutoring",
      time: "Just now",
    }));

    if (activity.length < 4) {
      const fillers = [
        { user: "Emma", action: "improved grade to A", subject: "Mathematics", time: "12 min ago" },
        { user: "James", action: "joined MegaStar", subject: "Physics", time: "18 min ago" },
      ];
      activity.push(...fillers.slice(0, 4 - activity.length));
    }

    return NextResponse.json({ activity });
  } catch (error) {
    console.error("Activity API error:", error);
    return NextResponse.json({
      activity: [
        { user: "Alex M.", action: "booked a session", subject: "Mathematics", time: "2 min ago" },
        { user: "Sophie L.", action: "completed a lesson", subject: "Physics", time: "5 min ago" },
        { user: "Daniel K.", action: "improved grade to A", subject: "Chemistry", time: "12 min ago" },
        { user: "Emma R.", action: "joined MegaStar", subject: "English", time: "18 min ago" },
      ],
    });
  }
}
