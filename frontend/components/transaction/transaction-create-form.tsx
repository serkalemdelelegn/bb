"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCommodities } from "@/app/api/apiCommodities";
import { createTransaction } from "@/app/api/apiTransactions";
import { toast } from "react-toastify";
import { getUserById } from "@/app/api/auth/apiUsers";
import { decodeJWT } from "@/app/api/auth/decode";
import { getCustomerById } from "@/app/api/apiCustomers";
import {
  getRetailerCooperativeById,
  getRetailerCooperatives,
} from "@/app/api/apiRetailerCooperatives";
import { getCurrentUser } from "@/app/api/auth/auth";
import { getRetailerCooperativeShopById } from "@/app/api/apiRetailerCooperativeShops";

export default function TransactionCreateForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [customerIDNumber, setCustomerIDNumber] = useState("ID0");
  const [customerId, setCustomerId] = useState("");
  const [name, setName] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [woreda, setWoreda] = useState("");
  const [commodity, setCommodity] = useState("");
  const [amount, setAmount] = useState("5");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const role = decodeJWT(localStorage.getItem("token") || "")?.role.name;
    setUserRole(role);
  }, []);

  // Fetch commodities using useQuery
  const {
    data: commoditiesData,
    isLoading: commoditiesLoading,
    error: commoditiesError,
  } = useQuery({
    queryKey: ["commodities"],
    queryFn: () => getCommodities(localStorage.getItem("token") || ""),
  });

  const { data: userDataResult, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(localStorage.getItem("token") || ""),
  });

  const { data: retailerCooperativeData, isLoading: isLoadingCoop } = useQuery({
    queryKey: ["cooperatives"],
    queryFn: () =>
      getRetailerCooperativeShopById(
        localStorage.getItem("token") || "",
        userDataResult?.data.worksAt
      ),
  });

  const handleSearchCustomer = async () => {
    if (!customerIDNumber) {
      toast.error("Please enter a Customer ID Number to search.");
      return;
    }
    setSearching(true);
    try {
      const token = localStorage.getItem("token") || "";
      const res = await getCustomerById(token, customerIDNumber);
      if (res && res.data) {
        setCustomerId(res.data.customer._id || "");
        setName(res.data.customer.name || "");
        setHouseNumber(res.data.customer.house_no || "");
        setWoreda(res.data.customer.woreda.name || "");
      } else {
        toast.error("Customer not found.");
        setCustomerId("");
        setName("");
        setHouseNumber("");
        setWoreda("");
      }
    } catch (error) {
      toast.error("Error fetching customer data.");
      setCustomerId("");
      setName("");
      setHouseNumber("");
      setWoreda("");
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerIDNumber || !commodity || !amount) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        shopId: userDataResult?.data?.worksAt,
        customerIDNumber,
        customerId,
        commodity,
        amount: Number(amount),
      };

      // console.log("Transaction Payload:", payload);
      const res = await createTransaction(
        localStorage.getItem("token") || "",
        payload
      );
      if (res.status !== "success") {
        toast.error(t("transactionFailed"));
        setLoading(false);
      } else {
        toast.success(t("transactionSuccess"));
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.log(err?.response?.data?.message);
      toast.error(t("transactionFailed"));
      // if (err?.response?.data?.message === "read ECONNRESET") {
      //   setError("ኢንተርኔትዎ እንደሚሰራ አረጋግጠው በድጋሜ ይሞክሩ።");
      // }
      setError(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {/* Customer ID Number with search button */}
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <Label htmlFor="customerIDNumber">{t("customerIDNumber")}</Label>
          <Input
            id="customerIDNumber"
            value={customerIDNumber}
            onChange={(e) => setCustomerIDNumber(e.target.value)}
            placeholder="Enter Customer ID Number"
            autoComplete="off"
          />
        </div>
        <Button
          type="button"
          onClick={handleSearchCustomer}
          disabled={searching}
          aria-label="Search Customer"
          className="mt-6"
        >
          🔍
        </Button>
      </div>
      {/* Non-editable fields */}
      <div>
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" value={name} readOnly placeholder="Name" />
      </div>
      <div>
        <Label htmlFor="houseNumber">{t("houseNumber")}</Label>
        <Input
          id="houseNumber"
          value={houseNumber}
          readOnly
          placeholder="House Number"
        />
      </div>
      <div>
        <Label htmlFor="woreda">{t("woreda")}</Label>
        <Input id="woreda" value={woreda} readOnly placeholder="Woreda" />
      </div>
      {/* Commodity */}
      <div>
        <Label htmlFor="commodity">{t("commodity")}</Label>
        <Select
          value={commodity}
          onValueChange={setCommodity}
          disabled={commoditiesLoading || !!commoditiesError}
        >
          <SelectTrigger id="commodity">
            <SelectValue placeholder={t("selectCommodity")} />
          </SelectTrigger>
          <SelectContent>
            {retailerCooperativeData &&
              retailerCooperativeData.data.availableCommodity.map(
                (item: any) => (
                  <SelectItem key={item._id} value={item.commodity._id}>
                    {item.commodity.name}{" "}
                    {item.commodity.price
                      ? `- ${item.commodity.price} birr`
                      : ""}
                  </SelectItem>
                )
              )}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="amount">{t("quantity")}</Label>
        <Input
          id="amount"
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={t("enterQuantity")}
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" disabled={loading}>
        {loading ? t("loading") : t("Create Transaction")}
      </Button>
    </form>
  );
}
