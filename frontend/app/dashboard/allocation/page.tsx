"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Textarea } from "@/components/ui/textarea";
import {
  PlusCircle,
  Search,
  Loader2,
  XCircle,
  CalendarIcon,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createAllocation,
  getAllocations,
  getAllocationsByWoredaOffice,
  getAllocationsTo,
  updateAllocation,
} from "@/app/api/apiAllocations";
import { decodeJWT } from "@/app/api/auth/decode";
import { getRetailerCooperatives } from "@/app/api/apiRetailerCooperatives";
import { getUserById } from "@/app/api/auth/apiUsers";
import { toast } from "react-toastify";
import { getCommodities } from "@/app/api/apiCommodities";
import { getCurrentUser } from "@/app/api/auth/auth";
import Loader from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export default function AllocationsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [commodity, setCommodity] = useState("");
  const [allocationFormData, setAllocationFormData] = useState({
    quantity: "",
    requestedBy: "",
  });
  const [isAllocating, setIsAllocating] = useState(false);
  const [allocations, setAllocations] = useState<any[]>([]);
  // const [isLoadingAllocations, setIsLoadingAllocations] = useState(true);
  const [approvingAllocationId, setApprovingAllocationId] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [appliedStartDate, setAppliedStartDate] = useState<Date | undefined>(
    undefined
  );
  const [appliedEndDate, setAppliedEndDate] = useState<Date | undefined>(
    undefined
  );
  const [searchText, setSearchText] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const role = decodeJWT(localStorage.getItem("token") || "")?.role.name;
    if (role === "RetailerCooperativeShop") {
      router.push("/unauthorized");
      return;
    }
    setUserRole(role);
  }, [userRole]);

  const { data: userDataResult, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(localStorage.getItem("token") || ""), // currentUser!.id is safe due to enabled check
  });

  const { data: retailerCooperativesData, isLoading: isLoadingData } = useQuery(
    {
      queryKey: ["retailerCooperatives"],
      queryFn: () =>
        getRetailerCooperatives(localStorage.getItem("token") || ""),
    }
  );

  const { data: allocationsData, isLoading: isLoadingAllocations } = useQuery({
    queryKey: ["allocations", appliedStartDate, appliedEndDate],
    queryFn: async () => {
      const worksAt = userDataResult?.data?.worksAt;
      const token = localStorage.getItem("token") || "";
      const start = appliedStartDate?.toISOString();
      const end = appliedEndDate?.toISOString();
      if (userRole === "TradeBureau" || userRole === "SubCityOffice") {
        console.log({ start, end });
        return await getAllocations(token, start, end);
      } else if (userRole === "WoredaOffice") {
        return await getAllocationsByWoredaOffice(token, worksAt, start, end);
      } else if (userRole === "RetailerCooperative") {
        return await getAllocationsTo(token, worksAt, start, end);
      } else {
        return { data: [] };
      }
    },
    enabled: !!userRole && !userLoading,
    refetchInterval: 1000,
  });

  const {
    data: commoditiesData,
    isLoading: commoditiesLoading,
    error: commoditiesError,
  } = useQuery({
    queryKey: ["commodities"],
    queryFn: () => getCommodities(localStorage.getItem("token") || ""),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (allocationId: string) =>
      updateAllocation(localStorage.getItem("token") || "", allocationId, {
        status: "approved",
      }),
    onMutate: (allocationId) => {
      // Set the ID of the allocation currently being approved
      setApprovingAllocationId(allocationId);
    },
  });

  const filteredAllocations = useMemo(() => {
  if (!allocationsData || !allocationsData.data) return []; // Ensure allocationsData and its data property exist

  const sortedAndFiltered = allocationsData.data
    .filter((allocation: any) => {
      const matchesCommodity =
        selectedCommodity === "all" ||
        allocation.commodity?.name?.toLowerCase() === selectedCommodity;
      const matchesStatus =
        selectedStatus === "all" ||
        allocation.status?.toLowerCase() === selectedStatus;

      return matchesCommodity && matchesStatus;
    })
    .sort((a: any, b: any) => {
      // 1. Define the custom order for statuses
      const statusOrder: { [key: string]: number } = {
        pending: 1,
        approved: 2,
      };

      // Get the status value for comparison, defaulting to a high number for statuses not explicitly ordered
      const statusAValue = statusOrder[a.status?.toLowerCase()] || 99;
      const statusBValue = statusOrder[b.status?.toLowerCase()] || 99;

      // 2. Compare by status first
      if (statusAValue < statusBValue) {
        return -1; // 'a' comes before 'b' (e.g., pending before approved)
      }
      if (statusAValue > statusBValue) {
        return 1; // 'b' comes before 'a'
      }

      // 3. If statuses are the same, then sort by createdAt in descending order (latest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return sortedAndFiltered;
}, [
  appliedStartDate,
  appliedEndDate, 
  selectedCommodity,
  selectedStatus,
  allocationsData,
]);

  if (
    isLoadingData ||
    userLoading ||
    commoditiesLoading ||
    isLoadingAllocations
  )
    return <Loader />;

  const handleNewAllocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAllocating(true);
    try {
      const allocationData = {
        commodity,
        amount: allocationFormData.quantity,
        tradeBureauId: userDataResult?.data?.worksAt,
        retailerCooperativeId: allocationFormData.requestedBy,
      };

      const res = await createAllocation(
        localStorage.getItem("token") || "",
        allocationData
      );

      if (res === 201) {
        toast.success("Allocation Made Successfully");
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to allocate resources");
    } finally {
      setIsAllocating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setAllocationFormData({
      ...allocationFormData,
      [field]: value,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {t("commodity allocations") || "Commodity Allocations"}
        </h2>
        {userRole === "TradeBureau" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("new allocation") || "New Allocation"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>
                  {t("create new allocation") || "Create New Allocation"}
                </DialogTitle>
                <DialogDescription>
                  {t("allocate commodity to cooperative") ||
                    "Allocate a commodity to a cooperative."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNewAllocation}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2"></div>
                    <div className="grid gap-2"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="commodity">
                        {t("commodity") || "Commodity"}
                      </Label>
                      <Select
                        value={commodity}
                        onValueChange={setCommodity}
                        disabled={commoditiesLoading || !!commoditiesError}
                      >
                        <SelectTrigger id="commodity">
                          <SelectValue placeholder={t("selectCommodity")} />
                        </SelectTrigger>
                        <SelectContent>
                          {commoditiesData &&
                            commoditiesData.data.map((item: any) => (
                              <SelectItem key={item._id} value={item._id}>
                                {item.name}{" "}
                                {item.price ? `- ${item.price} birr` : ""}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="quantity">
                        {t("quantity") || "Quantity"}
                      </Label>
                      <Input
                        id="quantity"
                        required
                        placeholder={
                          t("enter quantity") ||
                          "Enter quantity in liters or kg"
                        }
                        value={allocationFormData.quantity}
                        onChange={(e) =>
                          handleInputChange("quantity", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="requestedBy">
                      {t("allocated to") || "Allocated To"}
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("requestedBy", value)
                      }
                    >
                      <SelectTrigger id="requestedBy">
                        <SelectValue
                          placeholder={
                            t("select cooperative") || "Select cooperative"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {retailerCooperativesData &&
                          retailerCooperativesData.data.map(
                            (cooperative: any) => (
                              <SelectItem
                                key={cooperative._id}
                                value={cooperative._id}
                              >
                                {cooperative.name}
                              </SelectItem>
                            )
                          )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isAllocating}
                  >
                    {isAllocating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("allocating")}
                      </>
                    ) : (
                      t("create allocation") || "Create Allocation"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
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
        {(searchText ||
          selectedCommodity !== "all" ||
          selectedStatus !== "all" ||
          startDate ||
          endDate) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchText("");
              setSelectedCommodity("all");
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
        <div className="text-sm text-muted-foreground">
          {appliedStartDate || appliedEndDate
            ? `Showing allocations from ${
                appliedStartDate
                  ? format(appliedStartDate, "PPP")
                  : "the beginning"
              } to ${appliedEndDate ? format(appliedEndDate, "PPP") : "now"}`
            : "Showing all allocations"}
        </div>
      </div>
      {/* Allocations Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("search allocations") || "Search allocations..."}
                className="w-full pl-8"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
          <div>
            <Label htmlFor="commodity" className="sr-only">
              {t("commodity")}
            </Label>
            <Select
              value={selectedCommodity}
              onValueChange={setSelectedCommodity}
            >
              <SelectTrigger id="commodity" className="w-full sm:w-[150px]">
                <SelectValue placeholder={t("commodity")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCommodities")}</SelectItem>
                <SelectItem value="sugar">{t("sugar")}</SelectItem>
                <SelectItem value="oil">{t("oil")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("all allocations") || "All Allocations"}</CardTitle>
            <CardDescription>
              {t("view all allocations") || "View all commodity allocations"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("date") || "Date"}</TableHead>
                  <TableHead>{t("commodity") || "Commodity"}</TableHead>
                  <TableHead>{t("quantity") || "Quantity"}</TableHead>
                  <TableHead>{t("allocated to") || "Allocated To"}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  {userRole === "RetailerCooperative" && (
                    <TableHead>{t("actions") || "Actions"}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!isLoadingAllocations &&
                  allocationsData?.data?.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={userRole === "RetailerCooperative" ? 6 : 5}
                        className="text-center py-4"
                      >
                        {t("no allocations found") || "No allocations found"}
                      </TableCell>
                    </TableRow>
                  )}

                {!isLoadingAllocations &&
                  allocationsData &&
                  filteredAllocations.map((allocation: any) => (
                    <TableRow key={allocation._id}>
                      <TableCell>
                        {new Date(allocation.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{allocation.commodity?.name || "-"}</TableCell>
                      <TableCell>{allocation.amount}</TableCell>
                      <TableCell>
                        {allocation.retailerCooperativeId?.name || "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            allocation.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : allocation.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {allocation.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {userRole !== "TradeBureau" &&
                          userRole !== "SubCityOffice" &&
                          allocation.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                                disabled={isPending}
                                onClick={() => mutate(allocation._id)}
                              >
                                {isPending &&
                                approvingAllocationId === allocation._id ? (
                                  <Loader2 className="animate-spin" />
                                ) : (
                                  t("approve")
                                )}
                              </Button>
                            </div>
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
