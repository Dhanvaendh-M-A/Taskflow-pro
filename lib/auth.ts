import type { JWT } from "next-auth/jwt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "./mongodb";
import { User } from "./models";
import type { IUser } from "./models";

export const authOptions: NextAuthOptions = {
  // ensure a secret is present (required by Auth.js). For production, set NEXTAUTH_SECRET.
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || (() => {
    console.warn("[auth] WARNING: NEXTAUTH_SECRET is not set. Using fallback dev secret.");
    return "dev_secret_change_me";
  })(),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  logger: {
    error(code, metadata) {
      console.error("[auth][error]", code, metadata);
    },
    warn(code) {
      console.warn("[auth][warn]", code);
    },
    debug(code, metadata) {
      console.debug("[auth][debug]", code, metadata);
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();

        const user = await User.findOne({ email: credentials.email }).lean<IUser | null>();

        if (!user || !user.password) return null;

        const isValid = await new User(user).comparePassword(credentials.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github" || account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email }).lean<IUser | null>();

        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            role: "USER",
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      if (account?.provider === "github" || account?.provider === "google") {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email as string }).lean<IUser | null>();
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = {} as any;
      }
      if (token?.id) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
