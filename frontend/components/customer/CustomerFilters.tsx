"use client";

import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CustomerFiltersProps {
  userRole: string | null;
  woredas: any;
  selectedWoreda: string;
  setSelectedWoreda: (value: string) => void;
  searchText: string;
  setSearchText: (value: string) => void;
}

export default function CustomerFilters({
  userRole,
  woredas,
  selectedWoreda,
  setSelectedWoreda,
  searchText,
  setSearchText,
}: CustomerFiltersProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("searchCustomers")}
              className="w-full pl-8"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
        {(userRole === "TradeBureau" || userRole === "SubCityOffice") && (
          <div>
            <Label htmlFor="woreda-filter" className="sr-only">
              {t("woreda")}
            </Label>
            <Select value={selectedWoreda} onValueChange={setSelectedWoreda}>
              <SelectTrigger id="woreda-filter" className="w-full sm:w-[150px]">
                <SelectValue placeholder={t("woreda")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allWoredas")}</SelectItem>
                {woredas?.data?.length > 0 ? (
                  woredas.data.map((woreda: any) => (
                    <SelectItem key={woreda._id} value={woreda.name}>
                      {woreda.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-woredas" disabled>
                    No Woredas Found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </>
  );
}
