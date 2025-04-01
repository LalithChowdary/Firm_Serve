import NextAuth , {NextAuthOptions} from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {prisma} from "@/prisma/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";


export const authOptions : NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers :[
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" , placeholder: "email" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
              throw new Error("Missing credentials")
            }
            const user = await prisma.users.findUnique({
              where: { email: credentials.email }
            })
            if (!user) {
              throw new Error("User not found")
            }
            const valid = await bcrypt.compare(credentials.password, user.hashedPassword)
            if (!valid) {
              throw new Error("Incorrect password")
            }
            return {
              ...user,
              id: user.id.toString(), // Convert numeric ID to string
            }
          }     
    }),
  ]
  
}

const handler = NextAuth(authOptions);
  
  export { handler as GET, handler as POST }