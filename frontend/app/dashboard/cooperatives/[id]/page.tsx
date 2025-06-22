"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getRetailerCooperativeDetails } from "@/app/api/apiRetailerCooperatives";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { decodeJWT } from "@/app/api/auth/decode";

export default function RetailerCooperativeDetailsPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const retailerCooperativeId = params.id;

  useEffect(() => {
      const role = decodeJWT(localStorage.getItem("token") || "")?.role.name;
      if (role !== "SubCityOffice" && role !== "TradeBureau" && role !== "WoredaOffice") {
        router.push("/unauthorized");
        return;
      }
    }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["retailerCooperativeDetails", retailerCooperativeId],
    queryFn: () =>
      getRetailerCooperativeDetails(
        retailerCooperativeId,
        localStorage.getItem("token")
      ),
  });

  if (isLoading) return <Loader />;

  if (error || !data) {
    return <div>{t("failed to load retailer cooperative details")}</div>;
  }

  const { retailerCooperative, shops, customerCount } = data.data;

  return (
    <div className="p-4">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        {t("Back")}
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{retailerCooperative.name}</CardTitle>
          <CardDescription>
            {t("Woreda Office")}:{" "}
            {retailerCooperative.woredaOffice?.name || "-"}
          </CardDescription>
          <CardDescription>
            {t("Number of Customers")}: {customerCount}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className="mb-2 font-semibold">{t("Available Commodities")}</h3>
          {retailerCooperative.availableCommodity.length === 0 ? (
            <p>{t("No available commodities")}</p>
          ) : (
            <ul className="mb-4 list-disc list-inside max-w-4xl">
              {retailerCooperative.availableCommodity.map(
                (item: any, index: number) => (
                  <li key={`${item.commodity._id} - ${index}`}>
                    {item.commodity.name} - {item.quantity} units
                  </li>
                )
              )}
            </ul>
          )}

          <h3 className="mb-2 font-semibold">{t("Shops")}</h3>
          {shops.length === 0 ? (
            <p>{t("No shops found")}</p>
          ) : (
            <div className="max-w-4xl">
              {shops.map((shop: any) => (
                <div key={shop._id} className="mb-6 border rounded p-4">
                  <h4 className="text-lg font-semibold mb-2">{shop.name}</h4>
                  <div className="mb-2">
                    <h5 className="font-semibold">
                      {t("Available Commodities")}
                    </h5>
                    {shop.availableCommodity.length === 0 ? (
                      <p>{t("No available commodities")}</p>
                    ) : (
                      <ul className="list-disc list-inside">
                        {shop.availableCommodity.map((item: any) => (
                          <li key={item.commodity._id}>
                            {item.commodity.name} - {item.quantity} units
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <h5 className="font-semibold">{t("Distributions")}</h5>
                    {shop.distributions.length === 0 ? (
                      <p>{t("No distributions found")}</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t("Commodity")}</TableHead>
                            <TableHead>{t("Amount")}</TableHead>
                            <TableHead>{t("Status")}</TableHead>
                            <TableHead>{t("Date")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {shop.distributions.map(
                            (dist: any, index: number) => (
                              <TableRow key={`${dist._id} - ${index}`}>
                                <TableCell>
                                  {dist.commodity?.name || "-"}
                                </TableCell>
                                <TableCell>{dist.amount}</TableCell>
                                <TableCell>{dist.status}</TableCell>
                                <TableCell>
                                  {new Date(dist.date).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
