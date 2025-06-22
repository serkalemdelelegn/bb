"use client";

import React, { useEffect, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Search } from "lucide-react";
import { decodeJWT } from "@/app/api/auth/decode";
import { getRetailerCooperativeById } from "@/app/api/apiRetailerCooperatives";
import {
  getRetailerCooperativeShopById,
  getShopsByRetailerCooperativeId,
} from "@/app/api/apiRetailerCooperativeShops";
import { getCurrentUser } from "@/app/api/auth/auth";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import InventoryForWoredaSubcityTradebureau from "./InventoryForWoredaSubcityTradebureau";
import Loader from "@/components/ui/loader";

// Define the type for inventory items
type InventoryItem = {
  _id: string;
  quantity: number;
  commodity: {
    name: string;
    unit: string;
  };
};

// Define the type for shop inventory
type ShopInventory = {
  shopId: string;
  shopName: string;
  inventory: InventoryItem[];
};

export default function InventoryPage() {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [shopInventories, setShopInventories] = useState<ShopInventory[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const role = decodeJWT(localStorage.getItem("token") || "")?.role.name;
    setUserRole(role);
  }, []);

  const { data: userDataResult } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(localStorage.getItem("token") || ""),
  });

  const fetchRetailerCooperativeInventory = async () => {
    const token = localStorage.getItem("token") || "";
    const user = (await getCurrentUser(token)).data;

    if (user.role.name === "RetailerCooperative") {
      const coopRes = await getRetailerCooperativeById(token, user.worksAt);
      const shopsRes = await getShopsByRetailerCooperativeId(
        token,
        user.worksAt
      );

      const cooperativeInventory = coopRes.data.availableCommodity;

      const shopInventories: ShopInventory[] = shopsRes.data.map(
        (shop: any) => ({
          shopId: shop._id,
          shopName: shop.name,
          inventory: shop.availableCommodity,
        })
      );

      return {
        inventory: cooperativeInventory,
        shops: shopInventories,
      };
    } else if (user.role.name === "RetailerCooperativeShop") {
      const shopRes = await getRetailerCooperativeShopById(token, user.worksAt);
      return {
        inventory: shopRes.data.availableCommodity,
        shops: [],
      };
    }

    return { inventory: [], shops: [] };
  };

  const {
    data: inventoryData,
    isLoading: inventoryLoading,
  } = useQuery({
    queryKey: ["inventory", userDataResult?.data?.id],
    queryFn: fetchRetailerCooperativeInventory,
    enabled: !!userDataResult,
    refetchInterval: 10, // every second
  });

  useEffect(() => {
    if (inventoryData) {
      setInventory(inventoryData.inventory);
      setShopInventories(inventoryData.shops);
    }
  }, [inventoryData]);

  if(inventoryLoading) return <Loader />

  const filteredInventory = inventory.filter((item) =>
    item.commodity.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredShopInventories = shopInventories.map((shop) => ({
    ...shop,
    inventory: shop.inventory.filter((item) =>
      item.commodity.name.toLowerCase().includes(searchText.toLowerCase())
    ),
  }));

  if (
    userRole === "TradeBureau" ||
    userRole === "WoredaOffice" ||
    userRole === "SubCityOffice"
  )
    return <InventoryForWoredaSubcityTradebureau />;

  return (
    <div className="flex flex-col gap-4">
      {userRole === "RetailerCooperative" && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {filteredInventory.map((item) => (
              <Card
                key={item._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item.commodity.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {item.quantity} - {item.commodity.unit}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("acrossAllLocations")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Display inventories for each shop */}
          {filteredShopInventories.map((shop) => (
            <div key={shop.shopId} className="mt-6">
              <h2 className="text-lg font-semibold mb-2">{shop.shopName}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {shop.inventory.map((item) => (
                  <Card
                    key={item._id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {item.commodity.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {item.quantity} - {item.commodity.unit}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("shopInventory")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">{t("allInventory")}</TabsTrigger>
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
                placeholder={t("searchInventory")}
                className="w-full pl-8"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>{t("allInventory")}</CardTitle>
              <CardDescription>{t("viewAllInventory")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("commodity")}</TableHead>
                    <TableHead>{t("quantity")}</TableHead>
                    <TableHead>{t("unit")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.commodity.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.commodity.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
