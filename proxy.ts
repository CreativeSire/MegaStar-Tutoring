import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkConfigured } from "@/lib/clerk-config";
import { LOCAL_TEST_AUTH_COOKIE } from "@/lib/local-test-auth";

const isProtectedRoute = createRouteMatcher(["/app(.*)", "/dashboard(.*)", "/classroom(.*)", "/api(.*)"]);
const isPublicApiRoute = createRouteMatcher(["/api/public(.*)"]);

const middleware = clerkMiddleware(async (auth, request) => {
  if (isPublicApiRoute(request)) {
    return NextResponse.next();
  }

  if (process.env.NODE_ENV !== "production") {
    const localTestActor = request.cookies.get(LOCAL_TEST_AUTH_COOKIE)?.value;
    const testActorQuery = request.nextUrl.searchParams.get("testActor");
    if (localTestActor || testActorQuery) {
      return NextResponse.next();
    }
  }

  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

const devMiddleware = () => NextResponse.next();

export default isClerkConfigured() && process.env.NODE_ENV === "production" ? middleware : devMiddleware;

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
