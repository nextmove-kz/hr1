import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getUser, isLoggedIn } from "../src/api/auth/sign-in";

export const config = {
  matcher: ["/dashboard/:path*"],
};
export async function middleware(request: NextRequest) {
  const auth = await isLoggedIn();
  console.log("middle" + auth);

  if (!auth) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }

  NextResponse.next();
}
