import { NextResponse } from "next/server"
import { auth } from "./lib/auth"

const protectedRoutes = ["/dashboard"]


export default auth((req) => {
  console.log("object")
  const isLoggedIn = !!req.auth
  console.log("AUTH",req?.auth)
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}