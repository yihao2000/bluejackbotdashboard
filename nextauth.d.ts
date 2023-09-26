import NextAuth, { User } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string,
        name: string,
        role: string,
        username: string
      }
  interface Session {
    user: {
    exp: string
    iat: string
    id: string
    jti: string
    name: string
    role: string
    sub: string
    username: string
    };
  }
}

declare module "next-auth/jwt" {
    interface JWT {
        exp: string
        iat: string
        id: string
        jti: string
        name: string
        role: string
        sub: string
        username: string
    }
  }