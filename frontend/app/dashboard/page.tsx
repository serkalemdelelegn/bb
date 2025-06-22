"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Package, BarChart3, Shield, Award, Globe } from "lucide-react";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="p-6">{t("loading")}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-lg">
        <div className="h-[200px] md:h-[280px] w-full">
          <img
            src="/bole_subcity.jpeg"
            alt="Bole Subcity Distribution Center"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex flex-col justify-center p-6 md:p-8">
            <div className="max-w-3xl">
              <h1 className="text-xl md:text-3xl font-bold text-white mb-3">
                {t("Welcome To Bole Subcity Distribution Management System")}
              </h1>
              <p className="text-white/90 text-sm md:text-base max-w-2xl">
                {t(
                  "Efficiently Managing Commodity Distribution And Customer Services For The Community Of Bole Subcity",
                )}
              </p>
            </div>
          </div>
        </div>
          </div>

      {/* Welcome Introduction */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-3">
              {t("Your Digital Distribution Hub")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t(
                "This Comprehensive System Is Designed To Streamline The Distribution Process, Enhance Customer Service, And Provide Valuable Insights For Better Decision Making In Bole Subcity.",
              )}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("Customer Management")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("Register And Manage Customer Information With Ease And Accuracy")}
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="h-6 w-6 text-green-600" />
                    </div>
              <h3 className="text-lg font-semibold mb-2">{t("Distribution Tracking")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("Monitor And Track All Distribution Activities In Real-Time")}
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t("Analytics & Reports")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("Generate Detailed Reports And Analytics For Informed Decision Making")}
                      </p>
                    </div>
                  </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-sm">{t("Secure & Reliable")}</h4>
                      <p className="text-xs text-muted-foreground">
                    {t("Data Protection Guaranteed")}
                      </p>
                    </div>
                  </div>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-sm">{t("Government Approved")}</h4>
                  <p className="text-xs text-muted-foreground">
                    {t("Official System Standards")}
                  </p>
                    </div>
                  </div>
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-purple-600" />
                <div>
                  <h4 className="font-semibold text-sm">{t("Community Focused")}</h4>
                  <p className="text-xs text-muted-foreground">{t("Serving Bole Subcity")}</p>
                </div>
              </div>
            </div>
          </div>
              </CardContent>
            </Card>

      {/* System Overview */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t("System Overview")}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">{t("About The System")}</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {t(
                  "The Bole Subcity Distribution Management System Is A Comprehensive Digital Platform Designed To Enhance The Efficiency And Transparency Of Commodity Distribution Services.",
                )}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm">
                    {t("Comprehensive Customer Database Management")}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm">
                    {t("Real-Time Transaction Monitoring And Reporting")}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                    </div>
                  <span className="text-sm">
                    {t("Advanced Analytics And Data Visualization Tools")}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm">
                    {t("Inventory Management And Stock Control")}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">{t("Key Benefits")}</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                {t("Experience The Advantages Of Digital Distribution Management:")}
              </p>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("Improved Efficiency")}</p>
                      <p className="text-xs text-muted-foreground">
                      {t("Streamlined Processes Reduce Wait Times")}
                      </p>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("Enhanced Transparency")}</p>
                      <p className="text-xs text-muted-foreground">
                      {t("Clear Tracking Of All Distribution Activities")}
                      </p>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t("Better Decision Making")}</p>
                      <p className="text-xs text-muted-foreground">
                      {t("Data-Driven Insights For Strategic Planning")}
                      </p>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    4
                    </div>
                  <div>
                    <p className="text-sm font-medium">{t("Community Service")}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("Better Service Delivery To Bole Subcity Residents")}
                    </p>
                  </div>
                </li>
              </ol>
            </div>
              </div>
            </CardContent>
          </Card>
    </div>
  );
}
