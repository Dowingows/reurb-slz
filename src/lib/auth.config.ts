import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [],
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const { pathname } = nextUrl;

      if (!isLoggedIn) return false;

      if (pathname.startsWith("/admin") && role !== "ADMIN") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      if (pathname.startsWith("/campo") && role !== "CADASTRADOR") {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      if (pathname.startsWith("/dashboard") && role === "CADASTRADOR") {
        return Response.redirect(new URL("/campo", nextUrl));
      }

      return true;
    },
  },
};
