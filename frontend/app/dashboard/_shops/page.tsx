"use client";

import React from "react";

import { getRetailerCooperativeShops } from "@/app/api/apiRetailerCooperativeShops";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Filter, PlusCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getCurrentUser } from "@/app/api/auth/auth";

type Shop = {
  _id: string;
  name: string;
  retailerCooperative: {
    _id?: string;
    name: string;
    woredaOffice?: string | { _id: string };
  } | string;
  availableCommodity: {
    commodity: { name: string } | string;
    quantity: number;
  }[];
};

export default function ShopsPage() {
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userWoreda, setUserWoreda] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRetailer, setSelectedRetailer] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["shops"],
    queryFn: () => getRetailerCooperativeShops(localStorage.getItem("token")),
  });

  const { data: userDataResult, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(localStorage.getItem("token") || ""), // currentUser!.id is safe due to enabled check
  });

  useEffect(() => {
    if (userDataResult?.data) {
      setUserRole(userDataResult.data.role.name);
      setUserWoreda(userDataResult.data.worksAt);
    }
  }, [userDataResult]);

  const handleNewShop = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit the form data to your API
    setIsDialogOpen(false);
  };

  if (!isClient) {
    // return <div>{t("loading")}</div>
  }

  const filteredData =
    !isLoading && data
      ? data.data.filter((shop: Shop) => {
          const matchesSearch = shop.name
            ?.toLowerCase()
            .includes(searchText.toLowerCase());

          const retailer = shop.retailerCooperative;
          const retailerName =
            typeof retailer === "string" ? retailer : retailer?.name;

          const matchesRetailer =
            selectedRetailer === "all" || retailerName === selectedRetailer;

          // Show shops whose retailerCooperative belongs to the user's woreda if user role is WoredaOffice
          const matchesWoreda =
            userRole !== "WoredaOffice" ||
            (typeof retailer !== "string" &&
              retailer?.woredaOffice &&
              ((typeof retailer.woredaOffice === "string" && retailer.woredaOffice === userWoreda) ||
                (typeof retailer.woredaOffice === "object" && retailer.woredaOffice._id === userWoreda)));

          return matchesSearch && matchesRetailer && matchesWoreda;
        })
      : [];

  // Extract unique retailerCooperatives from shops data
  const retailerCooperatives = React.useMemo(() => {
    if (!data?.data) return [];
    const uniqueMap = new Map<string, { name: string; woredaOffice?: string | { _id: string } }>();
    data.data.forEach((shop: Shop) => {
      const retailer = shop.retailerCooperative;
      if (typeof retailer === "string") {
        uniqueMap.set(retailer, { name: retailer });
      } else if (retailer && retailer._id) {
        uniqueMap.set(retailer._id, { name: retailer.name, woredaOffice: retailer.woredaOffice });
      }
    });
    let cooperativesArray = Array.from(uniqueMap.values());
    // Filter by woreda if user role is WoredaOffice
    if (userRole === "WoredaOffice" && userWoreda) {
      cooperativesArray = cooperativesArray.filter((coop) => {
        if (!coop.woredaOffice) return false;
        if (typeof coop.woredaOffice === "string") {
          return coop.woredaOffice === userWoreda;
        } else if (typeof coop.woredaOffice === "object") {
          return coop.woredaOffice._id === userWoreda;
        }
        return false;
      });
    }
    return cooperativesArray;
  }, [data, userRole, userWoreda]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t("Shops")}</h2>
        {userRole === "trade-bureau" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("Add Shop")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("Add New Shop")}</DialogTitle>
                <DialogDescription>
                  {t("Register a new retailer cooperative shop.")}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNewShop}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">{t("Shop Name")}</Label>
                    <Input id="name" placeholder={t("Enter shop name")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="retailerCooperative">
                      {t("Retailer Cooperative")}
                    </Label>
                    <Input
                      id="retailerCooperative"
                      placeholder={t("Enter retailer cooperative")}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{t("Add Shop")}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">{t("All Shops")}</TabsTrigger>
            {/* <TabsTrigger value="active">{t("Active Shops")}</TabsTrigger>
            <TabsTrigger value="inactive">{t("Inactive Shops")}</TabsTrigger> */}
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
                placeholder={t("Search shops")}
                className="w-full pl-8"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <div>
              <Label htmlFor="retailerCooperative-filter" className="sr-only">
                {t("Retailer Cooperative")}
              </Label>
              <Select
                value={selectedRetailer}
                onValueChange={setSelectedRetailer}
              >
                <SelectTrigger
                  id="retailerCooperative-filter"
                  className="w-full sm:w-[180px]"
                >
                  <SelectValue placeholder={t("Retailer Cooperative")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("All Retailer Cooperatives")}
                  </SelectItem>
                  {!isLoading &&
                    retailerCooperatives.map((coop) => (
                      <SelectItem key={coop.name} value={coop.name}>
                        {coop.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>{t("All Shops")}</CardTitle>
              <CardDescription>
                {t("View all registered shops")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("retailerCooperative")}</TableHead>
                    <TableHead>{t("availableCommodity")}</TableHead>
                    {(userRole === "sub-city" ||
                      userRole === "woreda" ||
                      userRole === "cooperative") && (
                      <TableHead>{t("actions")}</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((shop: Shop) => (
                    <TableRow key={shop._id}>
                      <TableCell>{shop.name}</TableCell>
                      <TableCell>
                        {typeof shop.retailerCooperative === "string"
                          ? shop.retailerCooperative
                          : shop.retailerCooperative?.name}
                      </TableCell>
                      <TableCell>
                        {shop.availableCommodity?.map((item, index) => (
                          <div key={index}>
                            {typeof item.commodity === "string"
                              ? item.commodity
                              : item.commodity?.name}
                            : {item.quantity}
                          </div>
                        ))}
                      </TableCell>
                      {(userRole === "sub-city" ||
                        userRole === "woreda" ||
                        userRole === "cooperative") && (
                        <TableCell>{/* Actions can be added here */}</TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Active and inactive tabs can be updated similarly if needed */}
      </Tabs>
    </div>
  );
}
