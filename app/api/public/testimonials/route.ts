import { NextResponse } from "next/server";
import { getDatabase, hasDatabase } from "@/lib/db";
import { ratings, userProfiles } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export const revalidate = 300;

export async function GET() {
  try {
    if (!hasDatabase()) {
      return NextResponse.json({ testimonials: [] });
    }

    const db = getDatabase();
    if (!db) {
      return NextResponse.json({ testimonials: [] });
    }

    const topRatings = await db
      .select({
        id: ratings.id,
        score: ratings.score,
        comment: ratings.comment,
        category: ratings.category,
        displayName: userProfiles.displayName,
      })
      .from(ratings)
      .innerJoin(userProfiles, sql`${ratings.ownerUserId} = ${userProfiles.id}`)
      .where(sql`${ratings.score} >= 4 AND ${ratings.comment} IS NOT NULL AND ${ratings.comment} != ''`)
      .orderBy(sql`${ratings.score} DESC, ${ratings.createdAt} DESC`)
      .limit(6);

    const testimonials = topRatings.map((r) => ({
      id: r.id,
      name: r.displayName || "Anonymous",
      role: r.category === "tutor" ? "Tutor" : "Parent",
      quote: r.comment,
      result: r.score === 5 ? "Grade improved" : "Progress made",
      subject: r.category || "Tutoring",
      rating: r.score,
      image: ["/visuals/testimonial-1.svg", "/visuals/testimonial-2.svg", "/visuals/testimonial-3.svg"][Math.floor(Math.random() * 3)],
    }));

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("Testimonials API error:", error);
    return NextResponse.json({ testimonials: [] });
  }
}

