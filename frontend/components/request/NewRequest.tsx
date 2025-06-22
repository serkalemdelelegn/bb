"use client";

import { createAlert } from "@/app/api/apiAlerts";
import { getAllEntities } from "@/app/api/apiEntities";
import { Button } from "@/components/ui/button";
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
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// Define a type for the user data prop for better type safety
interface CurrentUser {
  _id: string;
  worksAt: string; // Assuming worksAt is an ID string
  role: {
    name: string;
  };
  // Add other relevant user fields if necessary
}

interface NewRequestProps {
  currentUserData?: CurrentUser; // Make it optional or ensure it's always provided
  apiToken: string | undefined;
  onNewRequestSubmitted: () => void; // Callback to refetch requests list
  userRole: string | null;
}

export function NewRequest({
  currentUserData,
  apiToken,
  userRole,
}: NewRequestProps) {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [alertData, setAlertData] = useState<{ file: File | null }>({
    file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {data:entitiesData, isLoading} = useQuery({
    queryKey: ['entities'],
    queryFn: ()=> getAllEntities(apiToken)
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAlertData({ file });
    } else {
      setAlertData({ file: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!currentUserData || !currentUserData.worksAt || !currentUserData.role) {
      toast.error(
        t("missingUserDataError") ||
          "User data is incomplete to submit a request."
      );
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const message = formData.get("message") as string;
    const file = alertData.file;
    

    let determinedToModel = "";
    // Logic to determine toModel based on current user's role
    if (currentUserData.role.name === "RetailerCooperative") {
      determinedToModel = "WoredaOffice";
    } else if (currentUserData.role.name === "WoredaOffice") {
      determinedToModel = "SubCityOffice"; 
    } else if (currentUserData.role.name === "SubCityOffice") {
      determinedToModel = "TradeBureau";
    }
    
    let toId = null;
    if(currentUserData.role.name === "RetailerCooperative"){
      let company = entitiesData.data.retailerCooperatives?.filter((coop: { _id: string; })=> coop._id === currentUserData.worksAt)[0];
      toId = entitiesData.data.woredas.filter((woreda: any)=> woreda._id === company.woredaOffice)[0]._id;
    } else if(currentUserData.role.name === "WoredaOffice"){
      let company = entitiesData.data.woredas?.filter((woreda: { _id: string; })=> woreda._id === currentUserData.worksAt)[0];
      toId = entitiesData.data.subcities.filter((subcity: any)=> subcity._id === company.subCityOffice)[0]._id;
    } else if(currentUserData.role.name === "SubCityOffice"){
      let company = entitiesData.data.subcities.filter((subcity: { _id: string; })=> subcity._id === currentUserData.worksAt)[0];
      toId = entitiesData.data.tradeBureaus.filter((tradeBureau: any)=> tradeBureau._id === company.tradeBureau)[0]._id;
    }

    if (!toId || !message ) {
      toast.error(
        t("fillAllFieldsError") || "Please fill all required fields."
      );
      setIsSubmitting(false);
      return;
    }

    const newAlert = {
      from: currentUserData.worksAt, // This should be the ID of the user's working entity
      to: toId,
      fromModel: currentUserData.role.name, // The model type of the sender
      toModel: determinedToModel, // The model type of the recipient, from controlled select
      message,
      file,
    };

    // console.log("Submitting new alert:", newAlert);

    try {
      await createAlert(apiToken, newAlert);
      toast.success(
        t("requestSubmittedSuccess")
      );
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create alert:", error);
      toast.error(t("requestSubmissionFailed") || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (currentUserData && currentUserData.role.name === 'TradeBureau') {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {/* The button to trigger new request dialog is shown based on userRole check in parent or here */}
        {/* For this example, let's assume parent decides if NewRequest component is rendered at all.
            If the button must be part of this component and conditionally rendered: */}
        {(userRole === "cooperative" ||
          currentUserData?.role?.name === "RetailerCooperative" ||
          currentUserData?.role?.name === "WoredaOffice" ||
          currentUserData?.role?.name === "SubCityOffice") && (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("newRequest")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("createNewRequest")}</DialogTitle>
          <DialogDescription>
            {t("submitNewRequestDescription")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="message">{t("message")}</Label>
              <Input
                id="message"
                name="message"
                placeholder={t("enterMessage")}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pdf">{t("uploadPdf") || "Upload PDF"}</Label>
              <Input
                id="pdf"
                name="pdf"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submitRequest")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
