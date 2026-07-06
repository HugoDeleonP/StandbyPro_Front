import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE } from "@/lib/auth"

const PUBLIC_PATHS = ["/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value)
  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  )

  // Sem sessão e tentando acessar rota protegida -> envia para o login.
  if (!hasSession && !isPublic) {
    const loginUrl = new URL("/login", request.url)
    if (pathname !== "/") {
      loginUrl.searchParams.set("redirect", pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  // Já autenticado e tentando ver o login -> manda para o dashboard.
  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Protege tudo, exceto assets estáticos e rotas internas do Next.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
