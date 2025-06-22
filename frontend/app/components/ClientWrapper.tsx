// app/components/ClientWrapper.tsx
'use client';

import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
        {children}
      </I18nextProvider>
    </ThemeProvider>
  );
}
