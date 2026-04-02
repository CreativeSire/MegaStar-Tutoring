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
    const testActor = localTestActor || testActorQuery;
    if (testActor) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-megastar-test-actor", testActor);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      response.cookies.set(LOCAL_TEST_AUTH_COOKIE, testActor, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
      });
      return response;
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
