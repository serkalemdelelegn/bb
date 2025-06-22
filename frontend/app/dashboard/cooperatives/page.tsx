"use client";

import { getRetailerCooperatives } from "@/app/api/apiRetailerCooperatives";
import { getWoredas } from "@/app/api/apiWoreda";
import { getCurrentUser } from "@/app/api/auth/auth";
import { decodeJWT } from "@/app/api/auth/decode";
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
import Loader from "@/components/ui/loader";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Filter, PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Cooperative = {
  _id: string;
  name: string;
  woredaOffice: {
    _id: string;
    name: string;
  };
  availableCommodity: Array<{
    commodity: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  status: string;
  createdAt: string;
};

export default function CooperativesPage() {
  const { t } = useTranslation();
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    const role = decodeJWT(localStorage.getItem("token") || "")?.role.name;
    if (role !== "SubCityOffice" && role !== "TradeBureau" && role !== "WoredaOffice") {
      router.push("/unauthorized");
      return;
    }
    setUserRole(role);
  }, []);


  const { data: cooperativesData, isLoading } = useQuery({
    queryKey: ["retailerCooperatives"],
    queryFn: () => getRetailerCooperatives(localStorage.getItem("token")),
    enabled: ["TradeBureau", "SubCityOffice", "WoredaOffice"].includes(
      userRole || ""
    ),
  });

  const { data: userDataResult, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(localStorage.getItem("token") || ""),
  });

  const { data: woredaData, isLoading: isLoadingWoreda } = useQuery({
    queryKey: ["woredas"],
    queryFn: () => getWoredas(localStorage.getItem("token") || ""),
  });

  if (isLoadingWoreda || userLoading || isLoading) return <Loader />

  
  const handleNewCooperative = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement cooperative creation
    setIsDialogOpen(false);
  };

  const filteredCooperatives = cooperativesData?.data
    ? cooperativesData.data.filter((coop: Cooperative) => {
        const matchesSearch = coop.name
          .toLowerCase()
          .includes(searchText.toLowerCase());
        const matchesStatus =
          selectedStatus === "all" || coop.status === selectedStatus;
        const matchesWoreda =
          userRole === "WoredaOffice"
            ? coop.woredaOffice._id === userDataResult?.data?.worksAt
            : true;

        return matchesSearch && matchesStatus && matchesWoreda;
      })
    : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {t("Cooperatives")}
        </h2>
        {userRole === "TradeBureau" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("Add Cooperative")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("Add New Cooperative")}</DialogTitle>
                <DialogDescription>
                  {t("Register a new retailer cooperative.")}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNewCooperative}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">{t("Cooperative Name")}</Label>
                    <Input
                      id="name"
                      placeholder={t("Enter cooperative name")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="woredaOffice">{t("Woreda Office")}</Label>
                    <Select>
                      <SelectTrigger id="woredaOffice">
                        <SelectValue placeholder={t("Select woreda office")} />
                      </SelectTrigger>
                      <SelectContent>
                        {/* TODO: Add woreda offices */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{t("Add Cooperative")}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">{t("All Cooperatives")}</TabsTrigger>
            
          </TabsList>
          <div className="mt-2 flex items-center gap-2 sm:mt-0">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              {t("filter")}
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("Search cooperatives")}
                className="w-full pl-8"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:flex">
            <div>
              {/* <Label htmlFor="status" className="sr-only">
                {t("Status")}
              </Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status" className="w-full sm:w-[180px]">
                  <SelectValue placeholder={t("Status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All Status")}</SelectItem>
                </SelectContent>
              </Select> */}
            </div>
          </div>
        </div>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>{t("All Cooperatives")}</CardTitle>
              <CardDescription>
                {t("View all registered cooperatives")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("woreda")}</TableHead>
                    <TableHead>{t("availableCommodities")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        {t("loading")}
                      </TableCell>
                    </TableRow>
                  ) : filteredCooperatives.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        {t("No cooperatives found")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCooperatives.map((coop: Cooperative) => (
                      <TableRow key={coop._id}>
                        <TableCell className="font-medium">
                          {coop.name}
                        </TableCell>
                        <TableCell>{coop.woredaOffice.name}</TableCell>
                        <TableCell>
                          {coop.availableCommodity.map((item) => (
                            <div
                              key={item.commodity._id}
                              className="flex justify-between items-center"
                            >
                              <span>{item.commodity.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {item.quantity} units
                              </span>
                            </div>
                          ))}
                        </TableCell>

                        <TableCell>
                          
                          <Link className="py-4 rounded-md px-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground" href={`/dashboard/cooperatives/${coop._id}`}>Details</Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
