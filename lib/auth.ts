import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {jwtVerify} from "jose";

const secret = new TextEncoder().encode(
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret'
)

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials ) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials')
                }

                try {
                    const response = await fetch(
                        `${process.env.API_URL || "http://localhost:3000"}/api/v1/auth/sign_in`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                user: {
                                    email: credentials.email,
                                    password: credentials.password
                                }
                            })
                        }
                    )

                    if (!response.ok) {
                        const error = await response.json()
                        throw new Error(error.error || 'Invalid credential')
                    }

                    const {data} = await response.json()
                    const {user, token} = data

                    try {
                        await jwtVerify(token, secret)
                    } catch (error) {
                        throw new Error('Invalid credential')
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.full_name || user.email,
                    }
                } catch (error) {
                    throw new Error(
                        error instanceof Error ? error.message : "Authentication failed"
                    )
                }
            }
        })
    ],

    callbacks: {
        jwt({token, user}) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.accessToken = user.token
            }
            return token
        },
        session({session, token}) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
            }
            return session
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60
    }
})