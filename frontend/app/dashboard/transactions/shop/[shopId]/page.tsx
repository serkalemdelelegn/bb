"use client";
import { getRetailerCooperativeShopById } from "@/app/api/apiRetailerCooperativeShops";
import { getTransactionsByShopId } from "@/app/api/apiTransactions";
import { decodeJWT } from "@/app/api/auth/decode";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/loader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Download, Search, XCircle } from "lucide-react"; // Added CalendarIcon
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function ShopTransactionsPage() {
  const { t } = useTranslation();
  const params = useParams();
  const shopId = params.shopId as string;
  const [userRole, setUserRole] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [appliedStartDate, setAppliedStartDate] = useState<Date | undefined>(
    undefined
  );
  const [appliedEndDate, setAppliedEndDate] = useState<Date | undefined>(
    undefined
  );

  useEffect(() => {
    const decoded = decodeJWT(localStorage.getItem("token") || "");
    if (decoded) {
      setUserRole(decoded.role.name);
    }
  }, []);

  const { isLoading, data } = useQuery({
    queryKey: ["shopTransactions", shopId, appliedStartDate, appliedEndDate],
    queryFn: () =>
      getTransactionsByShopId(
        localStorage.getItem("token"),
        shopId,
        appliedStartDate,
        appliedEndDate
      ),
    enabled: !!shopId,
  });

  const { data: shopData, isLoading: isLoadingShop } = useQuery({
    queryKey: ["shop", shopId],
    queryFn: () =>
      getRetailerCooperativeShopById(localStorage.getItem("token"), shopId),
    enabled: !!shopId,
  });

  const handleSearchDates = () => {
    setAppliedStartDate(startDate);
    setAppliedEndDate(endDate);
  };

  const handleClearDates = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setAppliedStartDate(undefined);
    setAppliedEndDate(undefined);
  };

  const handleResetFilters = () => {
    setSearchText("");
    setSelectedCommodity("all");
    setSelectedStatus("all");
    setStartDate(undefined);
    setEndDate(undefined);
    setAppliedStartDate(undefined);
    setAppliedEndDate(undefined);
  };

  const filteredData = useMemo(() => {
    if (!data?.data) return [];

    return data.data
      .filter((transaction: any) => {
        const matchesSearch = transaction.customerId?.name
          ?.toLowerCase()
          .includes(searchText.toLowerCase());
        const matchesCommodity =
          selectedCommodity === "all" ||
          transaction.commodity?.name?.toLowerCase() === selectedCommodity;
        const matchesStatus =
          selectedStatus === "all" ||
          transaction.status?.toLowerCase() === selectedStatus;

        return matchesSearch && matchesCommodity && matchesStatus;
      })
      .sort((a: any, b: any) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [searchText, selectedCommodity, selectedStatus, data]);

  // Calculate summary metrics
  const totalTransactions = filteredData.length;
  const totalQuantitySold = filteredData.reduce(
    (sum: number, transaction: any) => sum + (transaction.amount || 0),
    0
  );
  const totalRevenue = filteredData.reduce((sum: number, transaction: any) => {
    const quantity = transaction.amount || 0;
    const pricePerUnit = transaction.commodity?.price || 0;
    return sum + quantity * pricePerUnit;
  }, 0);

  if (isLoading || isLoadingShop) return <Loader />;

  const exportToExcel = (filteredData: any[], shopData: any) => { // Added params
    if (!filteredData || filteredData.length === 0) {
        toast.info("No data to export");
        return;
    }

    const worksheetData: any[][] = [];

    const calculateTotalPrice = (transaction: any) => {
        const quantity = transaction.amount || 0;
        const pricePerUnit = transaction.commodity?.price || 0;
        return (quantity * pricePerUnit); // Return as number for Excel calculation
    };

    const headers = [
        "Name",
        "Date",
        "Commodity",
        "Quantity",
        "Price Per Unit",
        "Total Price",
        "Seller",
        "Status",
    ];

    const transactionsByCommodity: { [key: string]: any[] } = {};
    filteredData.forEach((transaction: any) => {
        const commodityName = transaction.commodity?.name || "Unknown";
        if (!transactionsByCommodity[commodityName]) {
            transactionsByCommodity[commodityName] = [];
        }
        transactionsByCommodity[commodityName].push(transaction);
    });

    let overallTotalQuantity = 0;
    let overallTotalPrice = 0;

    for (const commodityName in transactionsByCommodity) {
        // Add Commodity header
        worksheetData.push([`Commodity: ${commodityName}`]);
        // Add headers for the current commodity group
        worksheetData.push(headers);

        let commodityTotalQuantity = 0;
        let commodityTotalPrice = 0;

        transactionsByCommodity[commodityName].forEach((transaction: any) => {
            const totalPrice = calculateTotalPrice(transaction); // Use numeric value
            commodityTotalQuantity += transaction.amount || 0;
            commodityTotalPrice += totalPrice;

            worksheetData.push([
                transaction.customerId?.name || "-",
                format(new Date(transaction.createdAt), 'yyyy-MM-dd HH:mm:ss'), // Formatted date for Excel
                transaction.commodity?.name || "-",
                transaction.amount,
                transaction.commodity?.price || 0,
                totalPrice, // Keep as number for Excel
                transaction.user?.name || "-",
                transaction.status,
            ]);
        });

        // Add commodity subtotal
        worksheetData.push([
            "", "", "Subtotal",
            commodityTotalQuantity,
            "",
            commodityTotalPrice.toFixed(2), // Format subtotal for display
            "", ""
        ]);
        worksheetData.push([]); // Empty row for spacing between commodity groups
    }

    // Add overall total
    worksheetData.push([
        "Overall Total", "", "", // Empty cells to align
        overallTotalQuantity,
        "",
        overallTotalPrice.toFixed(2), // Format overall total for display
        "", ""
    ]);

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Auto-fit columns (basic)
    const colSizes = worksheetData.reduce((acc, row) => {
        row.forEach((cell, i) => {
            const value = String(cell || ''); // Handle null/undefined cells
            const length = value.length;
            acc[i] = Math.max(acc[i] || 0, length);
        });
        return acc;
    }, []);

    ws['!cols'] = colSizes.map(width => ({ wch: width + 2 })); // Add some padding

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions Report");

    const now = new Date();
    const formattedDate = format(now, "yyyy-MM-dd_HH-mm-ss");
    const fileName = `transactions_${shopData?.data?.name || "data"}-transactions-${formattedDate}.xlsx`;

    XLSX.writeFile(wb, fileName);
};

const exportToPDF = (filteredData: any[], shopData: any) => { // Added params
    if (!filteredData || filteredData.length === 0) {
        toast.info("No data to export");
        return;
    }

    const doc = new jsPDF({
        unit: "pt",
        format: "a4",
        putOnlyUsedFonts: true,
        floatPrecision: 16,
    });

    // Set the default font for the document
    // Change 'NotoSansEthiopic' to 'helvetica' or 'times' if not using Amharic font
    doc.setFont("NotoSansEthiopic");
    doc.setFontSize(16);
    doc.text("Transactions Report", 40, 40); // Main title

    let currentY = 70; // Initial Y position for the first table

    const columns = [
        "Name",
        "Date",
        "Commodity",
        "Quantity",
        "Price Per Unit",
        "Total Price",
        "Seller",
        "Status",
    ];

    const calculateTotalPrice = (transaction: any) => {
        const quantity = transaction.amount || 0;
        const pricePerUnit = transaction.commodity?.price || 0;
        return (quantity * pricePerUnit);
    };

    const transactionsByCommodity: { [key: string]: any[] } = {};
    filteredData.forEach((transaction: any) => {
        const commodityName = transaction.commodity?.name || "Unknown";
        if (!transactionsByCommodity[commodityName]) {
            transactionsByCommodity[commodityName] = [];
        }
        transactionsByCommodity[commodityName].push(transaction);
    });

    let overallTotalQuantity = 0;
    let overallTotalPrice = 0;

    for (const commodityName in transactionsByCommodity) {
        const commodityTransactions = transactionsByCommodity[commodityName];

        // Add commodity section header
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont("NotoSansEthiopic", "bold");
        doc.text(`Commodity: ${commodityName}`, 40, currentY + 15);
        currentY += 30; // Move Y down after the header

        const commodityRows = commodityTransactions.map((transaction: any) => {
            const totalPrice = calculateTotalPrice(transaction);
            return [
                transaction.customerId?.name || "-",
                new Date(transaction.createdAt).toLocaleString(),
                transaction.commodity?.name || "-",
                transaction.amount,
                transaction.commodity?.price || 0,
                totalPrice.toFixed(2),
                transaction.user?.name || "-",
                transaction.status,
            ];
        });

        let commodityTotalQuantity = 0;
        let commodityTotalPrice = 0;
        commodityTransactions.forEach((transaction: any) => {
            commodityTotalQuantity += transaction.amount || 0;
            commodityTotalPrice += calculateTotalPrice(transaction);
        });

        autoTable(doc, {
            head: [columns],
            body: commodityRows,
            startY: currentY,
            styles: {
                font: "NotoSansEthiopic", // Ensure this font is registered
                fontSize: 8,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [0, 0, 0],
                textColor: [255, 255, 255],
                font: "NotoSansEthiopic", // Ensure this font is registered
                fontSize: 9,
                fontStyle: "bold",
            },
            foot: [
                [
                    "", "", "Subtotal", // Empty cells to align
                    commodityTotalQuantity.toFixed(2),
                    "",
                    commodityTotalPrice.toFixed(2),
                    "", ""
                ],
            ],
            footStyles: {
                font: "NotoSansEthiopic", // Ensure this font is registered
                fontSize: 9,
                fontStyle: "bold",
                fillColor: [230, 230, 230],
                textColor: [0, 0, 0],
            },
            didDrawPage: function (data) {
                doc.setFontSize(8);
                doc.setTextColor(100);
                doc.setFont("NotoSansEthiopic", "normal"); // Ensure this font is registered
                doc.text(
                    "Page " + data.pageNumber,
                    data.settings.margin.left,
                    doc.internal.pageSize.height - 20
                );
            },
        });

        // Update currentY after each table using doc.lastAutoTable.finalY
        currentY = (doc as any).lastAutoTable?.finalY + 20;

        overallTotalQuantity += commodityTotalQuantity;
        overallTotalPrice += commodityTotalPrice;
    }

    // Add overall total at the very end
    if (currentY + 50 > doc.internal.pageSize.height) {
        doc.addPage();
        currentY = 40;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("NotoSansEthiopic", "bold");
    doc.text("Overall Summary", 40, currentY);
    currentY += 20;

    doc.setFontSize(10);
    doc.setFont("NotoSansEthiopic", "normal");
    doc.text(`Total Quantity Sold: ${overallTotalQuantity.toFixed(2)}`, 40, currentY);
    currentY += 15;
    doc.text(`Total Revenue: ${overallTotalPrice.toFixed(2)}`, 40, currentY);

    const now = new Date();
    const formattedDate = format(now, "yyyy-MM-dd_HH-mm-ss");
    const fileName = `transactions_${shopData?.data?.name || "data"}-transactions-${formattedDate}.pdf`;

    doc.save(fileName);
};

  const isAnyFilterApplied =
    searchText !== "" ||
    selectedCommodity !== "all" ||
    selectedStatus !== "all" ||
    startDate !== undefined ||
    endDate !== undefined;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl text-center font-bold tracking-tight">
          {t("transactions")} - {shopData?.data?.name}
        </h2>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">
                {t("Total Transactions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalTransactions}</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">
                {t("Total Quantity Sold")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {totalQuantitySold.toFixed(2)} {t("units")}
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">{t("Total Revenue")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {totalRevenue.toFixed(2)} {t("currency")}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToExcel(filteredData, shopData)}
            >
            <Download className="mr-2 h-4 w-4" />
            {t("exportX")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToPDF(filteredData, shopData)}
            >
            <Download className="mr-2 h-4 w-4" />
            {t("exportP")}
          </Button>
            </div>
          <div className="flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="text-start font-normal sm:w-36"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : t("Start Date")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="text-start font-normal sm:w-36"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : t("End Date")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              size="sm"
              onClick={handleSearchDates}
              disabled={!startDate && !endDate}
            >
              <Search className="mr-2 h-4 w-4" />
              {t("Search")}
            </Button>
            {isAnyFilterApplied && (
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                <XCircle className="mr-2 h-4 w-4" />
                {t("Reset Filters")}
              </Button>
            )}
          </div>
        </div>

        {/* Date Range Feedback */}
        <div className="mt-2 text-sm text-muted-foreground text-right pr-2">
          
            {appliedStartDate || appliedEndDate
              ? `${t("Showing data from")} ${
                  appliedStartDate ? format(appliedStartDate, "PPP") : t("the beginning")
                } ${t("To")} ${appliedEndDate ? format(appliedEndDate, "PPP") : t("now")}`
              : t("Showing all dates")}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`${t("searchTransactions")} by customer name`}
              className="w-full pl-8"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <div>
            <Label htmlFor="commodity" className="sr-only">
              {t("commodity")}
            </Label>
            <Select
              value={selectedCommodity}
              onValueChange={setSelectedCommodity}
            >
              <SelectTrigger id="commodity" className="w-full sm:w-[150px]">
                <SelectValue placeholder={t("commodity")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allCommodities")}</SelectItem>
                <SelectItem value="sugar">{t("sugar")}</SelectItem>
                <SelectItem value="oil">{t("oil")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("transactions")}</CardTitle>
          <CardDescription>{t("viewAllTransactions")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("commodity")}</TableHead>
                <TableHead>{t("quantity")}</TableHead>
                <TableHead>{t("seller")}</TableHead>
                <TableHead>{t("status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((transaction: any) => (
                  <TableRow key={transaction._id}>
                    <TableCell className="font-medium">
                      {transaction.customerId?.name}
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{transaction.commodity?.name || "-"}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.user?.name || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          transaction.status === "success"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {t(transaction.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {isLoading
                      ? t("Loading transactions...")
                      : isAnyFilterApplied
                      ? t(
                          "No transactions found matching your applied filters. Please adjust your criteria."
                        )
                      : t("No transactions found for this shop.")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
