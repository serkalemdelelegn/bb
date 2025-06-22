'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useTranslation } from "react-i18next"

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden">
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
      <Card className="relative z-20 w-full max-w-md rounded-2xl shadow-2xl border border-white/20 bg-white/60 backdrop-blur-lg transition-all duration-300 hover:shadow-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("loginDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Link href="/login">
                <Button className="w-full">{t("login")}</Button>
              </Link>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">{t("footerDescription")}</p>
        </CardFooter>
      </Card>
    </div>
  )
}
