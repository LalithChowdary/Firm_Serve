// types/next-auth.d.ts
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: string;
    id?: string; // Add user ID to User interface
  }
  
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      id?: string; // Add this line to fix the error
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string; // Add user ID to JWT interface
  }
}
