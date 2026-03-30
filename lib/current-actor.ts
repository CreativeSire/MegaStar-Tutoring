import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Actor } from "@/lib/repository";

export async function requireActor(): Promise<Actor> {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return {
    clerkUserId: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? null,
    displayName:
      user.fullName ||
      user.firstName ||
      user.username ||
      user.primaryEmailAddress?.emailAddress ||
      "Tutor",
  };
}
