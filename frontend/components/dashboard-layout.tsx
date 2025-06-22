"use client";

import type React from "react";

import { getAlertsTo } from "@/app/api/apiAlerts";
import { getAllocationsTo } from "@/app/api/apiAllocations";
import { getDistributionsTo } from "@/app/api/apiDistributions";
import { getCurrentUser, logoutUser } from "@/app/api/auth/auth";
import { decodeJWT } from "@/app/api/auth/decode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Building,
  Building2,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Moon,
  Package,
  Settings,
  SettingsIcon,
  ShoppingBag,
  Store,
  Sun,
  Users,
  Warehouse,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import Loader from "./ui/loader";

type RoleConfig = {
  title: string;
  icon: React.ElementType;
  menuItems: {
    title: string;
    icon: React.ElementType;
    href: string;
    roles: string[];
    notificationCount?: number;
  }[];
};

const roleNames: Record<string, string> = {
  SubCityOffice: "Sub-City Office",
  TradeBureau: "Trade Bureau",
  WoredaOffice: "Woreda Office",
  RetailerCooperative: "Retailer Cooperative",
  RetailerCooperativeShop: "Retailer Cooperative Shop",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState(t("adminUser"));
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = decodeJWT(localStorage.getItem("token") || "")?.role.name;
    if (!token) {
      router.push("/login");
      return;
    }

    setUserRole(role);
  }, [router]);

  const { data: userDataResult, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(localStorage.getItem("token") || ""), // currentUser!.id is safe due to enabled check
  });

  const { data, isLoading } = useQuery({
    queryKey: ["requests"],
    queryFn: () =>
      getAlertsTo(
        localStorage.getItem("token") || "",
        userDataResult.data.worksAt
      ),
    enabled: userRole !== "RetailerCooperativeShop" && !userLoading,
    refetchInterval: 1000,
  });
  const { data: allocationsItem, isLoading: isLoadingAllocation } = useQuery({
    queryKey: ["allocationsTo"],
    queryFn: () =>
      getAllocationsTo(
        localStorage.getItem("token") || "",
        userDataResult.data.worksAt
      ),
    enabled: userRole === "RetailerCooperative" && !userLoading,
    refetchInterval: 1000,
  });

  const { data: distributionsData, isLoading: isLoadingDistribution } =
    useQuery({
      queryKey: ["distributionsTo"],
      queryFn: () =>
        getDistributionsTo(
          localStorage.getItem("token") || "",
          userDataResult?.data?.worksAt
        ),
      enabled: userRole === "RetailerCooperativeShop",
      refetchInterval: 1000,
    });

  if (userLoading || isLoading || isLoadingAllocation || isLoadingDistribution)
    return <Loader />;

  const menuConfig: RoleConfig[] = [
    {
      title: "Dashboard",
      icon: Home,
      menuItems: [
        {
          title: "Welcome",
          icon: Home,
          href: "/dashboard",
          roles: [
            "SubCityOffice",
            "TradeBureau",
            "WoredaOffice",
            "RetailerCooperative",
            "RetailerCooperativeShop",
          ],
        },
      ],
    },
    {
      title: "Distribution",
      icon: Box,
      menuItems: [
        {
          title: "Transactions",
          icon: ClipboardList,
          href: "/dashboard/transactions",
          roles: [
            "SubCityOffice",
            "TradeBureau",
            "WoredaOffice",
            "RetailerCooperative",
            "RetailerCooperativeShop",
          ],
        },
        {
          title: "Inventory",
          icon: Package,
          href: "/dashboard/inventory",
          roles: [
            "SubCityOffice",
            "TradeBureau",
            "WoredaOffice",
            "RetailerCooperative",
            "RetailerCooperativeShop",
          ],
        },
        {
          title: "Requests",
          icon: ShoppingBag,
          href: "/dashboard/requests",
          roles: [
            "TradeBureau",
            "RetailerCooperative",
            "WoredaOffice",
            // "RetailerCooperativeShop",
            "SubCityOffice",
          ],
          notificationCount:
            data?.data?.alerts?.filter(
              (alert: { status: string }) => alert.status === "sent"
            ).length || 0,
        },
        {
          title: "Allocation",
          icon: Building2,
          href: "/dashboard/allocation",
          roles: [
            "TradeBureau",
            "RetailerCooperative",
            "SubCityOffice",
            "WoredaOffice",
          ],
          notificationCount:
            allocationsItem?.data?.filter(
              (alert: { status: string }) => alert.status === "pending"
            ).length || 0,
        },
        {
          title: "Distribution",
          icon: ClipboardList,
          href: "/dashboard/distribution",
          roles: ["RetailerCooperative", "RetailerCooperativeShop"],
          notificationCount:
            distributionsData?.data?.distributions?.filter(
              (dist: { status: string }) => dist.status === "pending"
            ).length || 0,
        },
        {
          title: "Commodities",
          icon: Warehouse,
          href: "/dashboard/commodities",
          roles: [
            "SubCityOffice",
            "TradeBureau",
            "WoredaOffice",
            "RetailerCooperative",
            "RetailerCooperativeShop",
          ],
        },
        {
          title: "Report",
          icon: FileText,
          href: "/dashboard/report",
          roles: [
            // "SubCityOffice",
            // "TradeBureau",
            // "WoredaOffice",
            // "RetailerCooperative",
            // "RetailerCooperativeShop",
          ],
        },
      ],
    },
    {
      title: "Management",
      icon: Settings,
      menuItems: [
        {
          title: "Customers",
          icon: Users,
          href: "/dashboard/customers",
          roles: [
            "SubCityOffice",
            "WoredaOffice",
            "RetailerCooperativeShop",
            "RetailerCooperative",
            "TradeBureau",
          ],
        },
        {
          title: "Cooperatives",
          icon: Building,
          href: "/dashboard/cooperatives",
          roles: ["SubCityOffice", "TradeBureau", "WoredaOffice"],
        },
        {
          title: "Shops",
          icon: Store,
          href: "/dashboard/shops",
          roles: [
            // "SubCityOffice",
            // "WoredaOffice",
            // "RetailerCooperative",
            // "TradeBureau",
          ],
        },
        {
          title: "Settings",
          icon: SettingsIcon,
          href: "/dashboard/settings",
          roles: [
            "SubCityOffice",
            "TradeBureau",
            "WoredaOffice",
            "RetailerCooperative",
            "RetailerCooperativeShop",
          ],
        },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await logoutUser(); // Calls the API and clears the cookie
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      queryClient.clear(); // Clear cached data
      localStorage.removeItem("token"); // Remove token if stored
      router.push("/login"); // Redirect to login page
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2 py-3">
              <Image
                src="/favicon.ico"
                alt="Logo"
                width={32}
                height={32}
                className="mb-1"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold">
                  {t("commodityDistribution")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t(roleNames[userRole || ""])}
                </span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {menuConfig.map((group) => {
              const filteredItems = group.menuItems.filter((item) =>
                item.roles.includes(userRole || "")
              );

              if (filteredItems.length === 0) return null;

              return (
                <SidebarGroup key={group.title}>
                  <SidebarGroupLabel>
                    <group.icon className="mr-2 h-4 w-4" />
                    {t(group.title)}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {filteredItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            {/* The `a` tag or Link component is where the badge needs to be */}
                            <Link
                              href={item.href}
                              className="flex items-center justify-between w-full"
                            >
                              <div className="flex items-center gap-2">
                                {" "}
                                {/* Inner div for icon and text */}
                                <item.icon className="h-4 w-4" />
                                <span>{t(item.title)}</span>
                              </div>
                              {/* Notification Badge */}
                              {item.notificationCount !== undefined &&
                                item.notificationCount > 0 && (
                                  <span className="text-red-500">
                                    {item.notificationCount}
                                  </span>
                                )}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt={userName} />
                  <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs text-muted-foreground">
                    {t(roleNames[userRole || ""])}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                {t(roleNames[userRole || ""])} {t("dashboard")}
              </h1>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <LanguageSwitcher />
          </header>
          <div className="flex-1 p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
