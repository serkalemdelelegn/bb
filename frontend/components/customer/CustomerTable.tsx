"use client";

import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter, Edit } from "lucide-react"; // Import the Edit icon
import CustomerStatusBadge from "./CustomerStatusBadge";

// Define a more specific interface for CustomerData
interface CustomerData {
  _id: string; // Essential for identifying the customer to update
  name: string;
  ID_No: string;
  house_no: string;
  woreda: { _id: string; name: string } | null; // Can be null if not fully populated or if API sends it that way
  phone: string;
  ketena: string;
  numberOfFamilyMembers: number;
  retailerCooperativeShop: { _id: string; name: string } | null; // Can be null
  status: string;
}

interface CustomerTableProps {
  userRole: string | null;
  currentRecords: CustomerData[]; // Use the new CustomerData interface
  nPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onEditCustomer?: (customer: CustomerData) => void; // New prop for the edit handler
}

export default function CustomerTable({
  userRole,
  currentRecords,
  nPages,
  currentPage,
  setCurrentPage,
  onEditCustomer, // Destructure the new prop
}: CustomerTableProps) {
  const { t } = useTranslation();

  // Helper boolean for role checks to make conditions cleaner
  const isRetailerCooperativeOrShop = userRole === "RetailerCooperative" || userRole === "RetailerCooperativeShop";
  const isWoredaOffice = userRole === "WoredaOffice"; // Only WoredaOffice can update

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <TabsList>
          <TabsTrigger value="all">{t("allCustomers")}</TabsTrigger>
          {userRole !== "TradeBureau" &&
            userRole !== "SubCityOffice" &&
            userRole !== "WoredaOffice" && (
              <>
                <TabsTrigger value="available">
                  {t("availableCustomers")}
                </TabsTrigger>
                <TabsTrigger value="taken">{t("takenCustomers")}</TabsTrigger>
              </>
            )}
        </TabsList>
        <div className="mt-2 flex items-center gap-2 sm:mt-0">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            {t("filter")}
          </Button>
        </div>
      </div>

      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>{t("allCustomers")}</CardTitle>
            <CardDescription>{t("viewAllCustomers")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  {!isRetailerCooperativeOrShop && (
                    <TableHead>{t("idNumber")}</TableHead>
                  )}
                  <TableHead>{t("houseNumber")}</TableHead>
                  <TableHead>{t("woreda")}</TableHead>
                  <TableHead>{t("phone")}</TableHead>
                  <TableHead>{t("ketena")}</TableHead>
                  <TableHead>{t("numberOfFamilyMembers")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  {isWoredaOffice && ( // Only show "Actions" header for WoredaOffice
                    <TableHead>{t("actions")}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      {!isRetailerCooperativeOrShop && (
                        <TableCell>{customer.ID_No}</TableCell>
                      )}
                      <TableCell>{customer.house_no || "-"}</TableCell>
                      <TableCell>
                        {customer.woreda?.name
                          ?.split(" ")
                          .slice(0, 2)
                          .join(" ") || "-"}
                      </TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.ketena}</TableCell>
                      <TableCell>{customer.numberOfFamilyMembers}</TableCell>
                      <TableCell>
                        <CustomerStatusBadge status={customer.status} />
                      </TableCell>
                      {isWoredaOffice && ( // Only show actions for WoredaOffice
                        <TableCell>
                          {/* Edit Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditCustomer && onEditCustomer(customer)}
                            className="h-8 w-8 p-0"
                            title={t("edit")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {/* Add other actions like delete if needed */}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={isWoredaOffice ? 9 : 8} className="h-24 text-center">
                      {t("noCustomersFound")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
            <div className="flex justify-end space-x-2 p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                {t("previous")}
              </Button>
              <span className="flex items-center">
                {t("page")} {currentPage} {t("of")} {nPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, nPages))
                }
                disabled={currentPage === nPages}
              >
                {t("next")}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="available">
        <Card>
          <CardHeader>
            <CardTitle>{t("availableCustomers")}</CardTitle>
            <CardDescription>{t("viewAvailableCustomers")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  {!isRetailerCooperativeOrShop && (
                    <TableHead>{t("idNumber")}</TableHead>
                  )}
                  <TableHead>{t("houseNumber")}</TableHead>
                  <TableHead>{t("woreda")}</TableHead>
                  <TableHead>{t("phone")}</TableHead>
                  <TableHead>{t("ketena")}</TableHead>
                  <TableHead>{t("numberOfFamilyMembers")}</TableHead>
                  {isWoredaOffice && (
                    <TableHead>{t("actions")}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords
                  .filter((customer) => customer.status === "available")
                  .map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      {!isRetailerCooperativeOrShop && (
                        <TableCell>{customer.ID_No}</TableCell>
                      )}
                      <TableCell>{customer.house_no || "-"}</TableCell>
                      <TableCell>{customer.woreda?.name || "-"}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.ketena}</TableCell>
                      <TableCell>{customer.numberOfFamilyMembers}</TableCell>
                      {isWoredaOffice && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditCustomer && onEditCustomer(customer)}
                            className="h-8 w-8 p-0"
                            title={t("edit")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {/* Pagination Controls for Available Customers */}
            <div className="flex justify-end space-x-2 p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                {t("previous")}
              </Button>
              <span className="flex items-center">
                {t("page")} {currentPage} {t("of")} {nPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, nPages))
                }
                disabled={currentPage === nPages}
              >
                {t("next")}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="taken">
        <Card>
          <CardHeader>
            <CardTitle>{t("takenCustomers")}</CardTitle>
            <CardDescription>{t("viewTakenCustomers")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  {!isRetailerCooperativeOrShop &&
                    userRole !== "RetailerCooperative" && (
                      <TableHead>{t("idNumber")}</TableHead>
                    )}
                  <TableHead>{t("houseNumber")}</TableHead>
                  <TableHead>{t("woreda")}</TableHead>
                  <TableHead>{t("phone")}</TableHead>
                  <TableHead>{t("ketena")}</TableHead>
                  <TableHead>{t("numberOfFamilyMembers")}</TableHead>
                  {isWoredaOffice && (
                    <TableHead>{t("actions")}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords
                  .filter((customer) => customer.status === "taken")
                  .map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      {!isRetailerCooperativeOrShop && (
                        <TableCell>{customer.ID_No}</TableCell>
                      )}
                      <TableCell>{customer.house_no || "-"}</TableCell>
                      <TableCell>{customer.woreda?.name || "-"}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.ketena}</TableCell>
                      <TableCell>{customer.numberOfFamilyMembers}</TableCell>
                      {isWoredaOffice && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditCustomer && onEditCustomer(customer)}
                            className="h-8 w-8 p-0"
                            title={t("edit")}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {/* Pagination Controls for Taken Customers */}
            <div className="flex justify-end space-x-2 p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                {t("previous")}
              </Button>
              <span className="flex items-center">
                {t("page")} {currentPage} {t("of")} {nPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, nPages))
                }
                disabled={currentPage === nPages}
              >
                {t("next")}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}