// Example structure for your parent component (e.g., RequestsPage.tsx)
"use client";

import { useMutation, useQuery } from "@tanstack/react-query"; // Import useQueryClient for refetching
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAlerts, updateAlert } from "@/app/api/apiAlerts";
import { getCurrentUser } from "@/app/api/auth/auth";
import { decodeJWT } from "@/app/api/auth/decode";
import { NewRequest } from "@/components/request/NewRequest";
import { Request } from "@/components/request/Requests";
import Loader from "@/components/ui/loader";
import { useRouter } from "next/navigation";

// Define CurrentUser type (can be moved to a shared types file)
interface CurrentUser {
  _id: string;
  worksAt: string;
  role: { name: string };
  woredaOffice?: string; // if used by getWoredaById
  // other fields...
}

export default function RequestsPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [appliedStartDate, setAppliedStartDate] = useState<Date | undefined>(
    undefined
  );
  const [appliedEndDate, setAppliedEndDate] = useState<Date | undefined>(
    undefined
  );
  const [selectedRequestId, setSelectedRequestId] = useState<string>("")

  useEffect(() => {
    const role = decodeJWT(localStorage.getItem("token") || "")?.role.name;
    if (role === "RetailerCooperativeShop") {
      router.push("/unauthorized");
      return;
    }
    setUserRole(role);
  }, []);

  const {
    data: alertsQueryResult,
    isLoading: isLoadingAlerts,
    refetch: refetchAlerts,
  } = useQuery({
    queryKey: ["alerts", appliedStartDate, appliedEndDate], // Add dates to query key
    queryFn: () => {
      const start = appliedStartDate
        ? appliedStartDate.toISOString()
        : undefined;
      const end = appliedEndDate ? appliedEndDate.toISOString() : undefined;
      return getAlerts(localStorage.getItem("token") || "", start, end);
    },
    refetchInterval: 1000,
  });

  const { data: userDataResult, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(localStorage.getItem("token") || ""), // currentUser!.id is safe due to enabled check
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (alertId: string) => {
      setSelectedRequestId(alertId);
      return updateAlert(localStorage.getItem("token") || "", alertId, {
        status: "read",
      });
    },

  });

  const typedCurrentUserDate = userDataResult?.data as CurrentUser | undefined;

  const handleNewRequestSubmitted = () => {
    refetchAlerts(); // Refetch the list of requests
  };

  if (isLoadingAlerts || userLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {t("commodityRequests")}
        </h2>
        {/* NewRequest component now handles its own trigger button based on userRole */}
        <NewRequest
          currentUserData={typedCurrentUserDate}
          apiToken={localStorage.getItem("token") || ""}
          onNewRequestSubmitted={handleNewRequestSubmitted}
          userRole={userRole || typedCurrentUserDate?.role?.name || null} // Pass effective user role
        />
      </div>

      <Request
        alertsData={alertsQueryResult?.data}
        isLoadingAlerts={isLoadingAlerts}
        userRole={userRole || typedCurrentUserDate?.role?.name || null} // Pass effective user role
        currentUserData={typedCurrentUserDate} // Pass current user data for context
        onApprove={mutate}
        selectedReqId={selectedRequestId}
        isApproving={isPending}
        onDateFilterChange={(start, end) => {
          setAppliedStartDate(start);
          setAppliedEndDate(end);
        }}
        appliedStartDate={appliedStartDate}
        appliedEndDate={appliedEndDate}
      />
    </div>
  );
}
