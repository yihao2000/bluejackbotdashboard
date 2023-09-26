import { USER_LOGIN_QUERY } from '@/app/utils/constants';
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            name: "credentials",
            credentials:{
                username: {
                    label: "Username",
                    type: 'Username',
                    placeholder: 'andrewgiovanniw@gmail.com',
                },
                password: {
                    label: 'Password',
                    type: 'password'
                },
            },
            async authorize(credentials, req){
                const username = credentials?.username;
                const password = credentials?.password;

                try {
                    const response = await fetch(USER_LOGIN_QUERY, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ username, password }),
                    });

                    if (!response.ok) {
                        // Check for an authentication error (e.g., invalid credentials)
                        if (response.status === 401) {
                            throw new Error("Invalid Username / Password");
                        }

                        // Handle other errors here if needed
                        throw new Error("An error occurred while logging in");
                    }

                    const data = await response.json();
                    if (data.response.LogOnMobileResponse.LogOnMobileResult) {
                        const user = {
                            id: data.response.LogOnMobileResponse.LogOnMobileResult["a:UserId"],
                            name: data.response.LogOnMobileResponse.LogOnMobileResult["a:Name"],
                            role: data.response.LogOnMobileResponse.LogOnMobileResult["a:Roles"]["b:string"],
                            username: data.response.LogOnMobileResponse.LogOnMobileResult["a:UserName"],
                        };
                        return user;
                    } else {
                        throw new Error("Invalid Username / Password");
                    }
                } catch (error: any) {
                    if (error.message === 'fetch failed') {
                        throw new Error("Cannot connect to the server");
                    }
                    throw error;
                }
            }
        })
    ],
    callbacks:{
      async jwt({token, user}){
        return {...token, ...user}
      },
      async session({session, token}) {
        session.user = token
        return session;
      },
    },
    pages:{
        signIn: "/auth/login"
    }
}
