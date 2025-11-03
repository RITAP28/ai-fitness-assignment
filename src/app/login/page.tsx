'use client'

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("All fields are required");
            return;
        };

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`/api/auth/login`, {
                email,
                password
            });

            if (response.status === 200) {
                console.log('response data: ', response.data);
                const user = response.data.user;
                const session = response.data.session;

                // setting the authentication data received from the login into the global state of the client
                setAuth({
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        emailVerified: user.emailVerified,
                    },
                    session: {
                        sessionId: session.id,
                        userId: session.userId,
                        token: session.token,
                        expiresAt: session.expiresAt,
                    }
                });
                toast.success("Login successfull");
                router.push('/');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
              toast.error("Login unsuccessfull");
              setError(error?.response?.data?.error || "Login failed");
            } else {
              toast.error("Login unsuccessfull");
              setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-full flex justify-center items-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" required onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
                type="submit"
                className="w-full"
                onClick={handleLogin}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
            <p className="w-full flex justify-center gap-1 text-sm tracking-tight text-gray-500">
              <span className="">No account?</span>
              <span className="underline hover:cursor-pointer" onClick={() => router.push('/register')}>Register Here</span>
            </p>
            {error && (
                <div className="w-full px-2">
                    <p className="text-red-400 text-sm tracking-tight">{error}</p>
                </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
