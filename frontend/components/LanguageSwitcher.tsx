"use client"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState("en")

  useEffect(() => {
    setCurrentLang(i18n.language)
  }, [i18n.language])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setCurrentLang(lng)
    // Store language preference in localStorage
    localStorage.setItem("preferredLanguage", lng)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-3">
          {currentLang === "en" ? "🇺🇸 EN" : "🇪🇹 አማ"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")} className={currentLang === "en" ? "bg-muted" : ""}>
          <span className="mr-2">🇺🇸</span> English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("am")} className={currentLang === "am" ? "bg-muted" : ""}>
          <span className="mr-2">🇪🇹</span> አማርኛ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
