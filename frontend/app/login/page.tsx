"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { loginUser } from "../api/auth/auth";
import { useAuthStore } from "@/lib/store/authStore";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

interface DecodedToken {
  id: string;
  role: { name: string }; // Update type to reflect expected structure
  iat: number;
  exp: number;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("ferid");
  const [password, setPassword] = useState("121223");
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();

  const { setToken } = useAuthStore();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Call loginUser directly and destructure token
      const { token } = await loginUser({ username, password });

      // Set token in zustand
      setToken(token);

      // Decode and extract role
      const { role } = jwtDecode(token) as DecodedToken;

      if (!role) {
        alert("No role found in token!");
        return;
      }

      // Redirect based on role
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error('Wrong username or password')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
      {/* Theme toggle button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-sm"
      >
        {theme === "light" ? (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Blurred background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/bole_subcity.jpeg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          filter: "blur(7px) brightness(0.8)",
          transform: "scaleX(1.15) scaleY(1.05)",
        }}
        aria-hidden="true"
      />
      {/* Dark overlay for extra contrast */}
      <div className="absolute inset-0 z-10 bg-black/40" aria-hidden="true" />
      {/* Improved Login card */}
      <Card
        className="relative z-20 w-full max-w-md rounded-2xl shadow-2xl border border-white/20
        bg-white/60 backdrop-blur-lg transition-all duration-300 hover:shadow-3xl
        flex flex-col items-center"
        style={{
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
        }}
      >
        <CardHeader className="w-full text-center pb-0">
          <CardTitle className="text-3xl font-bold text-gray-800">
            {t("login")}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {t("loginDescription")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin} className="w-full">
          <CardContent className="grid gap-6 px-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-gray-700">
                {t("username")}
              </Label>
              <Input
                id="username"
                placeholder={t("usernamePlaceholder")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="rounded-lg bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-700">
                {t("password")}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-lg bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </CardContent>
          <CardFooter className="px-6 pb-6">
            <Button
              type="submit"
              className="w-full rounded-lg text-gray-800 hover:text-gray-900 text-white font-semibold shadow-md transition"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("loading")}
                </>
              ) : (
                t("login")
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
