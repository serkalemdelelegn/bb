"use client";

import {
  getDistributionsFrom,
  getDistributionsTo,
  updateDistribution,
} from "@/app/api/apiDistributions";
import { getCurrentUser } from "@/app/api/auth/auth";
import { decodeJWT } from "@/app/api/auth/decode";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  Search,
  TruckIcon,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function DistributionsPage() {
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [appliedStartDate, setAppliedStartDate] = useState<Date | undefined>(
    undefined
  );
  const [appliedEndDate, setAppliedEndDate] = useState<Date | undefined>(
    undefined
  );
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const role = decodeJWT(localStorage.getItem("token") || "")?.role.name;
    if (role !== "RetailerCooperativeShop" && role !== "RetailerCooperative") {
      router.push("/unauthorized");
      return;
    }
    setUserRole(role);
  }, []);

  const { data: userDataResult, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(localStorage.getItem("token") || ""),
  });

  const { isLoading, data } = useQuery({
    queryKey: ["distributions", appliedStartDate, appliedEndDate],
    queryFn: () => {
      const start = appliedStartDate
        ? appliedStartDate.toISOString()
        : undefined;
      const end = appliedEndDate ? appliedEndDate.toISOString() : undefined;

      return userRole === "RetailerCooperative"
        ? getDistributionsFrom(
            localStorage.getItem("token") || "",
            userDataResult.data.worksAt,
            start,
            end
          )
        : getDistributionsTo(
            localStorage.getItem("token") || "",
            userDataResult.data.worksAt,
            start,
            end
          );
    },
    enabled: !!userRole,
  });

  const filteredDistributions = useMemo(() => {
    if (!data?.data?.distributions) return [];

    return data.data.distributions
      .filter((distribution: any) => {
        const matchesSearch =
          distribution.retailerCooperativeId?.name
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          distribution.retailerCooperativeShopId?.name
            ?.toLowerCase()
            .includes(searchText.toLowerCase());
        const matchesStatus =
          selectedStatus === "all" ||
          distribution.status?.toLowerCase() === selectedStatus.toLowerCase();

        return matchesSearch && matchesStatus;
      })
      .sort((a: any, b: any) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [searchText, selectedStatus, data]);

  if (isLoading || userLoading) return <Loader />;

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    let bgColor = "bg-yellow-100 text-yellow-800";
    let Icon = Clock;
    if (statusLower === "approved") {
      bgColor = "bg-green-100 text-green-800";
      Icon = CheckCircle;
    } else if (statusLower === "rejected" || statusLower === "failed") {
      bgColor = "bg-red-100 text-red-800";
      Icon = TruckIcon;
    }
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor}`}
      >
        <Icon className="mr-1 h-3 w-3" />
        {t(statusLower) || status}
      </span>
    );
  };

  // Function to update distribution status
  const handleUpdateStatus = async (distributionId: string, status: string) => {
    try {
      await updateDistribution(
        localStorage.getItem("token") || "",
        distributionId,
        { status }
      );
      queryClient.invalidateQueries({ queryKey: ["distributions"] });
    } catch (error) {
      console.error("Failed to update distribution status:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {t("commodity distributions") || "commodity distributions"}
        </h1>
        {userRole === "RetailerCooperative" && (
          <Button onClick={() => router.push("distribution/new")}>
            Create a distribution
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4 items-center">
        <div className="flex flex-wrap items-center gap-2 ">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="text-start font-normal sm:w-36"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : t("Start Date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="text-start font-normal sm:w-36"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : t("End Date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            size="sm"
            onClick={() => {
              setAppliedStartDate(startDate);
              setAppliedEndDate(endDate);
            }}
            disabled={!startDate && !endDate}
          >
            <Search className="mr-2 h-4 w-4" />
            {t("Search")}
          </Button>
          {(searchText || selectedStatus !== "all" || startDate || endDate) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchText("");
                setSelectedStatus("all");
                setStartDate(undefined);
                setEndDate(undefined);
                setAppliedStartDate(undefined);
                setAppliedEndDate(undefined);
              }}
            >
              <XCircle className="mr-2 h-4 w-4" />
              {t("Reset Filters")}
            </Button>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {appliedStartDate || appliedEndDate
            ? `Showing distributions from ${
                appliedStartDate
                  ? format(appliedStartDate, "PPP")
                  : "the beginning"
              } to ${appliedEndDate ? format(appliedEndDate, "PPP") : "now"}`
            : "Showing all distributions"}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("search distributions") || "Search distributions"}
              className="w-full pl-8"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder={t("status") || "Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("all statuses") || "All statuses"}
                </SelectItem>
                <SelectItem value="pending">
                  {t("pending") || "Pending"}
                </SelectItem>
                <SelectItem value="approved">
                  {t("approved") || "Approved"}
                </SelectItem>
                <SelectItem value="rejected">
                  {t("rejected") || "Rejected"}
                </SelectItem>
                <SelectItem value="failed">
                  {t("failed") || "Failed"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            {t("all distributions") || "All distributions"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("view all distributions") || "View all distributions"}
          </p>
        </div>
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t("retailer cooperative") || "Retailer Cooperative ID"}
                </TableHead>
                <TableHead>
                  {t("retailer cooperative shop") ||
                    "Retailer Cooperative Shop ID"}
                </TableHead>
                <TableHead>{t("amount") || "Amount"}</TableHead>
                <TableHead>{t("commodity") || "Commodity"}</TableHead>
                <TableHead>{t("date") || "Date"}</TableHead>
                <TableHead>{t("status") || "Status"}</TableHead>
                {userRole === "RetailerCooperativeShop" && (
                  <TableHead>{t("action") || "Actions"}</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading && filteredDistributions.length > 0 ? (
                filteredDistributions.map((distribution: any) => (
                  <TableRow key={distribution._id}>
                    <TableCell className="font-medium">
                      {distribution.retailerCooperativeId?.name || "-"}
                    </TableCell>
                    <TableCell>
                      {distribution.retailerCooperativeShopId?.name || "-"}
                    </TableCell>
                    <TableCell>{distribution?.amount}</TableCell>
                    <TableCell>{distribution.commodity?.name || "-"}</TableCell>
                    <TableCell>
                      {new Date(distribution?.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {renderStatusBadge(distribution?.status)}
                    </TableCell>
                    {userRole === "RetailerCooperativeShop" && (
                      <TableCell>
                        {distribution.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                              onClick={() =>
                                handleUpdateStatus(distribution._id, "approved")
                              }
                            >
                              {t("approve")}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() =>
                                handleUpdateStatus(distribution._id, "rejected")
                              }
                            >
                              {t("reject")}
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {isLoading
                      ? t("Loading distributions...")
                      : searchText ||
                        selectedStatus !== "all" ||
                        appliedStartDate ||
                        appliedEndDate
                      ? t("No distributions match your filters")
                      : t("No distributions found")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
