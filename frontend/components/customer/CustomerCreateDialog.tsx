"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface CustomerFormData {
  name: string;
  ID_No: string;
  house_no: string;
  woreda: string;
  phone: string;
  ketena: string;
  numberOfFamilyMembers: string;
  retailerCooperativeShop: string;
}

interface CustomerCreateDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  formData: CustomerFormData;
  handleInputChange: (field: string, value: string) => void;
  handleNewCitizen: (e: React.FormEvent) => void;
  isAddingCustomer: boolean;
  shops: { _id: string; name: string }[];
}

export default function CustomerCreateDialog({
  isDialogOpen,
  setIsDialogOpen,
  formData,
  handleInputChange,
  handleNewCitizen,
  isAddingCustomer,
  shops,
}: CustomerCreateDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("addCustomer")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("addNewCustomer")}</DialogTitle>
          <DialogDescription>{t("registerNewCustomer")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleNewCitizen}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t("fullName")}</Label>
              <Input
                id="name"
                placeholder={t("enterFullName")}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ID_No">{t("idNumber")}</Label>
              <Input
                id="ID_No"
                type="text"
                placeholder={t("enterIdNumber")}
                value={formData.ID_No}
                onChange={(e) => handleInputChange("ID_No", e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="house_no">{t("houseNumber")}</Label>
              <Input
                id="house_no"
                placeholder={t("enterHouseNumber")}
                value={formData.house_no}
                onChange={(e) => handleInputChange("house_no", e.target.value)}
              />
            </div>
            {/* Woreda input removed as per requirement */}
            <div className="grid gap-2">
              <Label htmlFor="retailerCooperativeShop">{t("retailerCooperativeShop")}</Label>
              <Select
                value={formData.retailerCooperativeShop}
                onValueChange={(value) => handleInputChange("retailerCooperativeShop", value)}
                required
              >
                <SelectTrigger id="retailerCooperativeShop" className="w-full">
                  <SelectValue placeholder={t("selectRetailerCooperativeShop")} />
                </SelectTrigger>
                <SelectContent>
                  {shops.map((shop) => (
                    <SelectItem key={shop._id} value={shop._id}>
                      {shop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input
                id="phone"
                placeholder={t("enterPhone")}
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ketena">{t("ketena")}</Label>
              <Input
                id="ketena"
                placeholder={t("enterKetena")}
                value={formData.ketena}
                onChange={(e) => handleInputChange("ketena", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="numberOfFamilyMembers">{t("numberOfFamilyMembers")}</Label>
              <Input
                id="numberOfFamilyMembers"
                type="number"
                placeholder={t("enterNumberOfFamilyMembers")}
                value={formData.numberOfFamilyMembers}
                onChange={(e) => handleInputChange("numberOfFamilyMembers", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isAddingCustomer}>
              {isAddingCustomer ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("adding")}
                </>
              ) : (
                t("addCustomer")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
