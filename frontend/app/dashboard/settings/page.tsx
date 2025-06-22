"use client";

import React, { useState } from "react";
import { updateMe } from "@/app/api/auth/apiUsers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [successProfile, setSuccessProfile] = useState<string | null>(null);
  const [successPassword, setSuccessPassword] = useState<string | null>(null);
  const token = localStorage.getItem("token") || "";

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorProfile(null);
    setSuccessProfile(null);

    setLoadingProfile(true);
    try {
      await updateMe(token, { name, username });
      setSuccessProfile(t("settings.profileUpdateSuccess"));
      setName("");
      setUsername("");
    } catch (err: any) {
      setErrorProfile(
        err?.response?.data?.message ||
          err?.message ||
          t("settings.profileUpdateError")
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorPassword(null);
    setSuccessPassword(null);

    if (newPassword !== newPasswordConfirm) {
      setErrorPassword(t("settings.passwordMismatchError"));
      return;
    }

    setLoadingPassword(true);
    try {
      await updateMe(token, { password, newPassword });
      setSuccessPassword(t("settings.passwordUpdateSuccess"));
      setPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (err: any) {
      setErrorPassword(
        err?.response?.data?.message ||
          err?.message ||
          t("settings.passwordUpdateError")
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="w-full items-center justify-around p-6 rounded shadow bg-background text-foreground space-y-8 flex gap-4">
      <div className="w-full border p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {t("settings.updateProfileTitle")}
        </h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          {errorProfile && <Alert variant="destructive">{errorProfile}</Alert>}
          {successProfile && <Alert variant="default">{successProfile}</Alert>}
          <div>
            <Label htmlFor="name">{t("settings.nameLabel")}</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="username">{t("settings.usernameLabel")}</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            disabled={loadingProfile}
            className="w-full"
          >
            {loadingProfile ? t("settings.updating") : t("settings.updateProfileButton")}
          </Button>
        </form>
      </div>
      <div className="w-full border p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {t("settings.updatePasswordTitle")}
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {errorPassword && <Alert variant="destructive">{errorPassword}</Alert>}
          {successPassword && <Alert variant="default">{successPassword}</Alert>}
          <div>
            <Label htmlFor="password">{t("settings.currentPasswordLabel")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="newPassword">{t("settings.newPasswordLabel")}</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="newPasswordConfirm">
              {t("settings.confirmPasswordLabel")}
            </Label>
            <Input
              id="newPasswordConfirm"
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            disabled={loadingPassword}
            className="w-full"
          >
            {loadingPassword ? t("settings.updating") : t("settings.updatePasswordButton")}
          </Button>
        </form>
      </div>
    </div>
  );
}