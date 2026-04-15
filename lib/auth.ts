import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';

async function getUserByEmail(email: string) {
  try {
    const prisma = (await import('@/lib/prisma')).default;
    return await prisma.user.findUnique({ where: { email } });
  } catch {
    return null;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // --- DEVELOPMENT MOCK BYPASS ---
        if (credentials.email === 'admin@vellure.id' && credentials.password === 'admin123') {
          return {
            id: 'mock-admin-id',
            email: 'admin@vellure.id',
            name: 'Admin User',
            role: 'ADMIN',
          } as any;
        }
        if (credentials.email === 'guest@vellure.id' && credentials.password === 'password') {
          return {
            id: 'mock-user-id',
            email: 'guest@vellure.id',
            name: 'Guest User',
            role: 'USER',
          } as any;
        }
        // -------------------------------

        const user = await getUserByEmail(credentials.email as string);

        if (!user || !user.password) return null;
        if (user.status === 'BANNED') throw new Error('Account has been banned');

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar,
          role: user.role,
        };
      },
    }),
  ],
});
