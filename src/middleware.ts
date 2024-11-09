import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getUser, isLoggedIn } from "../src/api/auth/sign-in";
import { usePathname } from "next/navigation";

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
export async function middleware(request: NextRequest) {
  const auth = await isLoggedIn();
  const path = request.nextUrl.pathname;

  if (path.includes("/dashboard") && !auth) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  } else if (path === "/" && auth) {
    const url = new URL("/dashboard", request.url);
    return NextResponse.redirect(url);
  }

  NextResponse.next();
}
