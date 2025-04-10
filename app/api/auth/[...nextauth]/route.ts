import NextAuth from "next-auth";
import { authOptions } from "@/components/authOptions"; // path depends on your project structure

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
