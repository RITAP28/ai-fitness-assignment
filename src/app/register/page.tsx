'use client'

import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


export default function Page() {
    const { setAuth } = useAuthStore();
    const router = useRouter();
    const [name, setName] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async () => {
        if (!email || !password || !name) {
            setError("All fields are required");
            return;
        };

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`/api/auth/register`, {
                email,
                password,
                name
            });

            if (response.status === 201) {
                console.log('response data: ', response.data);
                const user = response.data.user;
                const session = response.data.session;

                // setting the data from the server as global state in the client
                setAuth({
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        emailVerified: user.emailVerified,
                        image: user.image
                    },
                    session: {
                        sessionId: session.id,
                        userId: session.userId,
                        token: session.token,
                        expiresAt: session.expiresAt,
                    }
                });
                toast.success("Registered successfully");
                router.push('/');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
              toast.error("Registration unsuccessfull");
              setError(error.response?.data?.error || "Registration failed");
            } else {
              toast.error("Registration unsuccessfull");
              setError("Something went wrong. Please try again");
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
            <CardTitle className="w-full flex justify-center">Register</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="rahul"
                    required
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  />
                </div>
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
                type="submit"
                className="w-full"
                onClick={handleRegister}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
            <p className="w-full flex justify-center gap-1 text-sm tracking-tight text-gray-500">
              <span className="">Already have an account?</span>
              <span className="underline hover:cursor-pointer" onClick={() => router.push('/login')}>Login Here</span>
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
    )
}