"use client";

import { getCommodities, updateCommodityPrice } from "@/app/api/apiCommodities";
import { decodeJWT } from "@/app/api/auth/decode";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CommoditiesPage() {
  const { t } = useTranslation();
  const [selectedCommodity, setSelectedCommodity] = useState<any>(null);
  const [newPrice, setNewPrice] = useState<number | "">("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const storedRole = decodeJWT(localStorage.getItem("token") || "")?.role
      .name;
    setUserRole(storedRole);
  }, []);

  const { isLoading, data } = useQuery({
    queryKey: ["commodities"],
    queryFn: () => getCommodities(localStorage.getItem("token") || ""),
  });

  const mutation = useMutation<
    unknown, // or the return type of updateCommodityPrice if known
    Error,
    { id: string; price: number }
  >({
    mutationFn: ({ id, price }) => updateCommodityPrice(localStorage.getItem("token") || "", id, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commodities"] });
      setSelectedCommodity(null);
      setNewPrice("");
    },
  });

  if (isLoading) return <Loader />

  const handleUpdateClick = (commodity: any) => {
    setSelectedCommodity(commodity);
    setNewPrice(commodity.price);
  };

  const handleSave = () => {
    if (selectedCommodity && newPrice !== "" && newPrice >= 0) {
      mutation.mutate({ id: selectedCommodity._id, price: newPrice });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold tracking-tight">
        {t("commodities") || "Commodities"}
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>
            {t("availableCommodities") || "Available Commodities"}
          </CardTitle>
          <CardDescription>
            {t("manageCommodityPrices") || "Manage commodity prices"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name") || "Name"}</TableHead>
                <TableHead>{t("price") || "Price"}</TableHead>
                <TableHead>{t("unit") || "Unit"}</TableHead>
                {userRole === 'TradeBureau' && <TableHead>{t("actions") || "Actions"}</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                data &&
                data.data.map((commodity: any) => (
                  <TableRow key={commodity._id}>
                    <TableCell>{commodity.name}</TableCell>
                    <TableCell>
                      {selectedCommodity?._id === commodity._id ? (
                        <Input
                          type="number"
                          min={0}
                          value={newPrice}
                          onChange={(e) => setNewPrice(Number(e.target.value))}
                        />
                      ) : (
                        commodity.price
                      )}
                    </TableCell>
                    <TableCell>{commodity.unit}</TableCell>
                    {userRole === 'TradeBureau' &&<TableCell>
                      {selectedCommodity?._id === commodity._id ? (
                        <>
                          <Button
                            onClick={handleSave}
                            // disabled={mutation.isLoading}
                          >
                            {t("save") || "Save"}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => setSelectedCommodity(null)}
                          >
                            {t("cancel") || "Cancel"}
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => handleUpdateClick(commodity)}>
                          {t("updatePrice") || "Update Price"}
                        </Button>
                      )}
                    </TableCell>}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
