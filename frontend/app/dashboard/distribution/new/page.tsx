"use client";

import type React from "react";

import { createDistribution } from "@/app/api/apiDistributions";
import {
  getRetailerCooperativeById
} from "@/app/api/apiRetailerCooperatives";
import { getShopsByRetailerCooperativeId } from "@/app/api/apiRetailerCooperativeShops";
import { getCurrentUser } from "@/app/api/auth/auth";
import { decodeJWT } from "@/app/api/auth/decode";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function NewDistributionPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    commodity: "",
    amount: "",
    retailerCooperativeId: "",
    shop: "",
  });

  useEffect(() => {
      const role = decodeJWT(localStorage.getItem("token") || "")?.role.name;
      if(role !== 'RetailerCooperative') router.push('/unauthorized')
      setUserRole(role);
    }, []);

  const {
    data: userData,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser( localStorage.getItem("token") || ""),
  });

  const {
    data: retailerCooperativesData,
    isLoading: retailerCooperativesLoading,
  } = useQuery({
    queryKey: ["retailerCooperative"],
    queryFn: () => getRetailerCooperativeById(  localStorage.getItem("token") || "", userData?.data?.worksAt),
  });

  const {
    data: shopsData,
    refetch: refetchShops,
    isLoading: shopsLoading,
  } = useQuery({
    queryKey: ["shops"],
    queryFn: () => getShopsByRetailerCooperativeId(localStorage.getItem("token") || "", userData?.data?.worksAt),
  });

  useEffect(() => {
    if (userData?.data?.worksAt) {
      refetchShops();
      setFormData((prev) => ({
        ...prev,
        retailerCooperativeId: userData.data.worksAt,
      }));
    }
  }, [userData, refetchShops]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (
      !formData.commodity ||
      !formData.amount ||
      !formData.shop ||
      !formData.retailerCooperativeId
    ) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await createDistribution(localStorage.getItem("token") || "", {
        commodity: formData.commodity,
        amount: Number(formData.amount),
        retailerCooperativeId: retailerCooperativesData.data._id,
        retailerCooperativeShopId: formData.shop,
      });
      if(res.status === 'success'){
        toast.success(t("distribution created successfully") || "Distribution created successfully");
        handleReset();
        };
    } catch (error) {
      toast.error(
        t("error creating distribution") || "Error creating distribution" + error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      commodity: "",
      amount: "",
      retailerCooperativeId: userData?.data?.worksAt || "",
      shop: "",
    });
    setSelectedFile(null);
  };

  if (shopsLoading || userLoading || retailerCooperativesLoading) return <Loader />

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => router.push("/dashboard/distribution")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("back") || "Back"}
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {t("distribute commodities to retailer shops") ||
              "Distribute Commodities to Retailer Shops"}
          </h1> 
          <p className="text-muted-foreground mt-1">
            {t("create a new distribution record") ||
              "Create a new distribution record for your retailer shops"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("distribution form") || "Distribution Form"}</CardTitle>
          <CardDescription>
            {t("fill in the details to distribute commodities") ||
              "Fill in the details to distribute commodities to a retailer shop"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="commodity" className="text-sm font-medium">
                  {t("commodity") || "Commodity"}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.commodity}
                  onValueChange={(value) =>
                    handleInputChange("commodity", value)
                  }
                >
                  <SelectTrigger id="commodity">
                    <SelectValue
                      placeholder={t("select commodity") || "Select commodity"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {retailerCooperativesData?.data?.availableCommodity?.map(
                      (item: any) => (
                        <SelectItem
                          key={item._id}
                          value={item.commodity._id}
                        >
                          {item.commodity.name} - {item.commodity.price} Birr
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  {t("amount") || "Amount"}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="flex">
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    value={formData.amount}
                    onChange={(e) =>
                      handleInputChange("amount", e.target.value)
                    }
                    placeholder={
                      t("enter amount in liters/kg") ||
                      "Enter amount in liters/kg"
                    }
                    className="rounded-r-none"
                    required
                  />
                  <div className="inline-flex items-center justify-center rounded-r-md border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                    {formData.commodity === "Oil" ? "L" : "kg"}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shop" className="text-sm font-medium">
                  {t("shop") || "Shop"} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.shop}
                  onValueChange={(value) => handleInputChange("shop", value)}
                >
                  <SelectTrigger id="shop">
                    <SelectValue
                      placeholder={t("select shop") || "Select shop"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {shopsData?.data?.map((shop: any) => (
                      <SelectItem key={shop._id} value={shop._id}>
                        {shop.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleReset}>
                {t("reset") || "Reset"}
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#1e293b] hover:bg-[#334155]">
                {isSubmitting ? t("submitting") || "Submitting..." : t("submit distribution") || "Submit Distribution"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardFooter className="flex justify-center border-t p-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/distribution")}>
            {t("view all distributions") || "View All Distributions"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}