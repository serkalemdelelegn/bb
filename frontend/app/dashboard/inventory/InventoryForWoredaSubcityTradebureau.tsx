"use client";

import { getRetailerCooperatives } from "@/app/api/apiRetailerCooperatives";
import { getShopsByRetailerCooperativeId } from "@/app/api/apiRetailerCooperativeShops";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Filter, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type InventoryItem = {
  _id: string;
  quantity: number;
  commodity: {
    name: string;
    unit: string;
  };
};

type ShopInventory = {
  shopId: string;
  shopName: string;
  inventory: InventoryItem[];
};

type RetailerCooperative = {
  _id: string;
  name: string;
  availableCommodity: InventoryItem[];
};

export default function InventoryForWoredaSubcityTradebureau() {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [expandedCoops, setExpandedCoops] = useState<Set<string>>(new Set());
  const [isLoadingShops, setIsLoadingShops] = useState(false);

  const token = localStorage.getItem("token") || "";

  const {
    data: cooperativesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["retailerCooperatives"],
    queryFn: () => getRetailerCooperatives(token),
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
  });

  const [shopsInventoryMap, setShopsInventoryMap] = useState<
    Record<string, ShopInventory[]>
  >({});

  const toggleCoopExpansion = async (coopId: string) => {
    const newExpanded = new Set(expandedCoops);
    if (expandedCoops.has(coopId)) {
      newExpanded.delete(coopId);
      setExpandedCoops(newExpanded);
    } else {
      newExpanded.add(coopId);
      setExpandedCoops(newExpanded);
      // Fetch shops inventory for this coop if not already fetched
      if (!shopsInventoryMap[coopId]) {
        try {
          setIsLoadingShops(true);
          const shops = await getShopsByRetailerCooperativeId(token, coopId);
          const mappedShops: ShopInventory[] = shops.data.map((shop: any) => ({
            shopId: shop._id,
            shopName: shop.name,
            inventory: shop.availableCommodity,
          }));
          setShopsInventoryMap((prev) => ({
            ...prev,
            [coopId]: mappedShops,
          }));
        } catch (err) {
          console.error("Error fetching shops inventory:", err);
        } finally {
          setIsLoadingShops(false);
        }
      }
    }
  };

  if (isLoading) return <Loader />;

  if (error) {
    return <div>{t("errorLoadingData")}</div>;
  }

  // Filter cooperatives by search text on name or commodity name
  const filteredCooperatives =
    cooperativesData?.data.filter((coop: RetailerCooperative) => {
      const coopNameMatch = coop.name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const commodityMatch = coop.availableCommodity.some((item) =>
        item.commodity.name.toLowerCase().includes(searchText.toLowerCase())
      );
      return coopNameMatch || commodityMatch;
    }) || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Input
          type="search"
          placeholder={t("searchRetailerCooperatives")}
          className="max-w-md"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          {t("filter")}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("retailerCooperative")}</TableHead>
            <TableHead>{t("commodity")}</TableHead>
            <TableHead>{t("quantity")}</TableHead>
            <TableHead>{t("unit")}</TableHead>
            <TableHead>{t("shopsInventory")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCooperatives.map((coop: RetailerCooperative) => (
            <React.Fragment key={coop._id}>
              <TableRow>
                <TableCell>{coop.name}</TableCell>
                <TableCell>
                  {coop.availableCommodity
                    .map((item) => item.commodity.name)
                    .join(", ")}
                </TableCell>
                <TableCell>
                  {coop.availableCommodity
                    .map((item) => item.quantity)
                    .join(", ")}
                </TableCell>
                <TableCell>
                  {coop.availableCommodity
                    .map((item) => item.commodity.unit)
                    .join(", ")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCoopExpansion(coop._id)}
                    aria-expanded={expandedCoops.has(coop._id)}
                    aria-controls={`shops-inventory-${coop._id}`}
                  >
                    {expandedCoops.has(coop._id) ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                    {t("viewShopsInventory")}
                  </Button>
                </TableCell>
              </TableRow>
              {expandedCoops.has(coop._id) && (
                <TableRow>
                  <TableCell colSpan={5} id={`shops-inventory-${coop._id}`}>
                    {shopsInventoryMap[coop._id]?.length ? (
                      shopsInventoryMap[coop._id].map((shop) => {
                        // Filter shop inventory by search text
                        const filteredShopInventory = shop.inventory.filter(
                          (item) =>
                            item.commodity.name
                              .toLowerCase()
                              .includes(searchText.toLowerCase())
                        );
                        return (
                          <div key={shop.shopId} className="mb-4">
                            <h4 className="font-semibold mb-2">
                              {shop.shopName}
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>{t("commodity")}</TableHead>
                                  <TableHead>{t("quantity")}</TableHead>
                                  <TableHead>{t("unit")}</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredShopInventory.length ? (
                                  filteredShopInventory.map((item) => (
                                    <TableRow key={item._id}>
                                      <TableCell>
                                        {item.commodity.name}
                                      </TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>
                                        {item.commodity.unit}
                                      </TableCell>
                                    </TableRow>
                                  ))
                                ) : isLoadingShops ? (
                                  <div className="flex justify-center p-4">
                                    <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
                                  </div>
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={3}>
                                      {t("noInventoryFound")}
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        );
                      })
                    ) : (
                      isLoadingShops ? (
                        <div className="flex justify-center p-4">
                          <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
                        </div>
                      ) : (
                        <div>{t("noShopsFound")}</div>
                      )
                    )}
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
