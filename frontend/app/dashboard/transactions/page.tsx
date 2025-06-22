"use client";
import { getRetailerCooperatives } from "@/app/api/apiRetailerCooperatives";
import {
  getRetailerCooperativeShopById,
  getRetailerCooperativeShops,
} from "@/app/api/apiRetailerCooperativeShops";
import { getTransactions } from "@/app/api/apiTransactions";
import { getWoredas } from "@/app/api/apiWoreda";
import { getCurrentUser } from "@/app/api/auth/auth";
import { decodeJWT } from "@/app/api/auth/decode";
import TransactionCreateModal from "@/components/transaction/TransactionCreateModal";
import TransactionFilters from "@/components/transaction/TransactionFilters";
import TransactionSummaryCards from "@/components/transaction/TransactionSummaryCards";
import TransactionTable from "@/components/transaction/TransactionTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function TransactionsPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [userRole, setUserRole] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCommodity, setSelectedCommodity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCooperative, setSelectedCooperative] = useState("all");
  const [selectedShop, setSelectedShop] = useState("all");
  const [selectedWoreda, setSelectedWoreda] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [appliedStartDate, setAppliedStartDate] = useState<Date | undefined>(
    undefined
  );
  const [appliedEndDate, setAppliedEndDate] = useState<Date | undefined>(
    undefined
  );

  const ROLES_WITH_NEW_FEATURES = useMemo(
    () => ["RetailerCooperative", "RetailerCooperativeShop"],
    []
  );

  useEffect(() => {
    const decoded = decodeJWT(localStorage.getItem("token") || "");
    if (decoded) {
      setUserRole(decoded.role.name);
    }
  }, []);

  const exportToExcel = () => {
    if (!filteredData || filteredData.length === 0) {
      toast.info("No data available to export");
      return;
    }

    const worksheetData: any[][] = [];

    // Date Range Title Logic
    let dateRangeTitle = "All Transactions";
    if (appliedStartDate && appliedEndDate) {
      dateRangeTitle = `Transactions from ${format(
        appliedStartDate,
        "yyyy-MM-dd"
      )} to ${format(appliedEndDate, "yyyy-MM-dd")}`;
    } else if (appliedStartDate) {
      dateRangeTitle = `Transactions from ${format(
        appliedStartDate,
        "yyyy-MM-dd"
      )} onwards`;
    } else if (appliedEndDate) {
      dateRangeTitle = `Transactions up to ${format(
        appliedEndDate,
        "yyyy-MM-dd"
      )}`;
    } else {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      dateRangeTitle = `Transactions from ${format(
        thirtyDaysAgo,
        "yyyy-MM-dd"
      )} to ${format(today, "yyyy-MM-dd")} (Last 30 Days)`;
    }

    // Add the date range title to the top of the worksheet
    worksheetData.push([dateRangeTitle]);
    worksheetData.push([]); // Empty row for spacing

    const calculateTotalPrice = (transaction: any) => {
      const quantity = transaction.amount || 0;
      const pricePerUnit = transaction.commodity?.price || 0;
      return quantity * pricePerUnit;
    };

    const headers = [
      "Date",
      "Commodity",
      "Amount",
      "Price Per Unit",
      "Total Price",
      "Shop",
      "Customer"
    ];

    let overallTotalQuantity = 0;
    let overallTotalPrice = 0;

    const transactionsByCommodity: { [key: string]: any[] } = {};
    filteredData.forEach((transaction: any) => {
      const commodityName = transaction.commodity?.name || "Unknown";
      if (!transactionsByCommodity[commodityName]) {
        transactionsByCommodity[commodityName] = [];
      }
      transactionsByCommodity[commodityName].push(transaction);
    });

    for (const commodityName in transactionsByCommodity) {
      worksheetData.push([`Commodity: ${commodityName}`]); // Commodity section header
      worksheetData.push(headers); // Headers for this commodity section

      let commodityTotalQuantity = 0;
      let commodityTotalPrice = 0;

      transactionsByCommodity[commodityName].forEach((transaction: any) => {
        const totalPrice = calculateTotalPrice(transaction);
        commodityTotalQuantity += transaction.amount || 0;
        commodityTotalPrice += totalPrice;

        worksheetData.push([
          format(new Date(transaction.createdAt), "yyyy-MM-dd HH:mm:ss"),
          transaction.commodity?.name || "-",
          transaction.amount,
          transaction.commodity?.price || 0,
          totalPrice,
          transaction.shopId?.name || "-",
          transaction.customerId?.name || "-",
        ]);
      });

      worksheetData.push([]); // Empty row for spacing
      worksheetData.push([
        "",
        "Subtotal",
        commodityTotalQuantity,
        "",
        commodityTotalPrice.toFixed(2),
        "",
        "",
      ]);
      worksheetData.push([]); // Empty row for spacing between commodity groups

      overallTotalQuantity += commodityTotalQuantity;
      overallTotalPrice += commodityTotalPrice;
    }

    // Add overall total
    worksheetData.push([
      "Overall Total",
      "",
      overallTotalQuantity,
      "",
      overallTotalPrice.toFixed(2),
      "",
      "",
    ]);

    // Create a new workbook and worksheet
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Auto-fit columns
    const colSizes = worksheetData.reduce((acc, row) => {
      row.forEach((cell, i) => {
        const value = String(cell);
        const length = value.length;
        acc[i] = Math.max(acc[i] || 0, length);
      });
      return acc;
    }, []);

    ws["!cols"] = colSizes.map((width) => ({ wch: width + 2 })); // Add some padding

    // Make the title row bold and larger
    if (ws["A1"]) {
      ws["A1"].s = {
        font: {
          bold: true,
          sz: 14,
        },
      };
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions Report");

    // Write the workbook and trigger download
    XLSX.writeFile(
      wb,
      `transactions_report_${format(new Date(), "yyyy-MM-dd")}.xlsx`
    );
  };

  const exportToPDF = () => {
  if (!filteredData || filteredData.length === 0) {
    toast.info("No data available to export");
    return;
  }

  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
    putOnlyUsedFonts: true,
    floatPrecision: 16,
  });

  // Date Range Title Logic
  let dateRangeTitle = "All Transactions";
  if (appliedStartDate && appliedEndDate) {
    dateRangeTitle = `Transactions from ${format(appliedStartDate, "yyyy-MM-dd")} to ${format(appliedEndDate, "yyyy-MM-dd")}`;
  } else if (appliedStartDate) {
    dateRangeTitle = `Transactions from ${format(appliedStartDate, "yyyy-MM-dd")} onwards`;
  } else if (appliedEndDate) {
    dateRangeTitle = `Transactions up to ${format(appliedEndDate, "yyyy-MM-dd")}`;
  } else {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    dateRangeTitle = `Transactions from ${format(thirtyDaysAgo, "yyyy-MM-dd")} to ${format(today, "yyyy-MM-dd")} (Last 30 Days)`;
  }

  doc.setFont("helvetica");
  doc.setFontSize(16);
  doc.text(dateRangeTitle, 40, 40);

  let currentY = 70;

  const columns = [
    "Date",
    "Amount",
    "Price Per Unit",
    "Total Price",
    "Shop", 
    "Customer"
  ];

  const calculateTotalPrice = (transaction: any) => {
    const quantity = transaction.amount || 0;
    const pricePerUnit = transaction.commodity?.price || 0;
    return quantity * pricePerUnit;
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
    const commodityUnit = commodityTransactions[0]?.commodity?.unit || "unit"; // Get unit from first transaction

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`Commodity: ${commodityName} (${commodityUnit})`, 40, currentY + 15); // Added unit here
    currentY += 30;

    const commodityRows = commodityTransactions.map((transaction: any) => {
      const totalPrice = calculateTotalPrice(transaction);
      return [
        new Date(transaction.createdAt).toLocaleString(),
        `${transaction.amount} ${commodityUnit}`, // Added unit to amount
        transaction.commodity?.price || 0,
        totalPrice.toFixed(2),
        transaction.shopId?.name || "-",
        transaction.customerId?.name || "-",
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
        font: "helvetica",
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
        font: "helvetica",
        fontSize: 9,
        fontStyle: "bold",
      },
      foot: [
        [
          "",
          `Subtotal (${commodityUnit})`, // Added unit to subtotal label
          `${commodityTotalQuantity.toFixed(2)} ${commodityUnit}`, // Added unit to quantity
          "",
          `${commodityTotalPrice.toFixed(2)} 'ETB'`,
          "", 
          "",
        ],
      ],
      footStyles: {
        font: "helvetica",
        fontSize: 9,
        fontStyle: "bold",
        fillColor: [230, 230, 230],
        textColor: [0, 0, 0],
      },
      didDrawPage: function (data) {
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.setFont("helvetica", "normal");
        doc.text(
          "Page " + data.pageNumber,
          data.settings.margin.left,
          doc.internal.pageSize.height - 20
        );
      },
    });

    currentY += 120;
    overallTotalQuantity += commodityTotalQuantity;
    overallTotalPrice += commodityTotalPrice;
  }

  if (currentY + 50 > doc.internal.pageSize.height) {
    doc.addPage();
    currentY = 40;
  }

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Overall Summary", 40, currentY);
  currentY += 20;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Total Quantity Sold: ${overallTotalQuantity.toFixed(2)} units`, // Added generic unit
    40,
    currentY
  );
  currentY += 15;
  doc.text(
    `Total Revenue: ${overallTotalPrice.toFixed(2)}`,
    40,
    currentY
  );

  doc.save(`transactions_data_${new Date().toLocaleDateString()}.pdf`);
};

  const { isLoading, data } = useQuery({
    queryKey: ["transactions", appliedStartDate, appliedEndDate],
    queryFn: () => getTransactions(localStorage.getItem("token")),
    enabled: !!userRole,
    refetchInterval: 1000,
  });

  const { data: cooperativesData, isLoading: cooperativesLoading } = useQuery({
    queryKey: ["retailerCooperatives"],
    queryFn: () => getRetailerCooperatives(localStorage.getItem("token")),
    enabled: ["TradeBureau", "SubCityOffice", "WoredaOffice"].includes(
      userRole || ""
    ),
  });

  const { data: shopsData, isLoading: shopsLoading } = useQuery({
    queryKey: ["retailerShops"],
    queryFn: () =>
      getRetailerCooperativeShops(localStorage.getItem("token") || ""),
    enabled: [
      "TradeBureau",
      "SubCityOffice",
      "WoredaOffice",
      "RetailerCooperative",
    ].includes(userRole || ""),
  });

  const { data: userDataResult, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(localStorage.getItem("token") || ""),
  });

  const { data: currentShopData, isLoading: isLoadingCurrentShop } = useQuery({
    queryKey: ["currentShopAvailableCommodity"],
    queryFn: () =>
      userRole === "RetailerCooperativeShop" &&
      userDataResult?.data?.worksAt &&
      getRetailerCooperativeShopById(
        localStorage.getItem("token") || "",
        userDataResult.data.worksAt
      ),
    enabled:
      userRole === "RetailerCooperativeShop" && !!userDataResult?.data?.worksAt,
    refetchInterval: 1000,
  });

  const { data: woredas, isLoading: isLoadingWoreda } = useQuery({
    queryKey: ["woredas"],
    queryFn: () => getWoredas(localStorage.getItem("token") || ""),
    enabled: userRole === "TradeBureau" || userRole === "SubCityOffice",
  });

  const filteredCooperatives = useMemo(() => {
    if (!cooperativesData?.data) return [];

    let currentCooperatives = cooperativesData.data;

    if (userRole === "WoredaOffice" && userDataResult?.data?.worksAt) {
      currentCooperatives = currentCooperatives.filter((coop: any) => {
        return coop.woredaOffice._id === userDataResult.data.worksAt;
      });
    }

    if (
      ["TradeBureau", "SubCityOffice"].includes(userRole || "") &&
      selectedWoreda !== "all"
    ) {
      currentCooperatives = currentCooperatives.filter((coop: any) => {
        return coop.woredaOffice?._id === selectedWoreda;
      });
    }

    return currentCooperatives;
  }, [cooperativesData, userRole, userDataResult, selectedWoreda]);

  const shopsGroupedByCooperative = useMemo(() => {
    if (!shopsData?.data || !filteredCooperatives) return {};

    const grouped: { [key: string]: { cooperative: any; shops: any[] } } = {};

    shopsData.data.forEach((shop: any) => {
      const cooperativeId = shop.retailerCooperative?._id;
      const cooperativeDetails = filteredCooperatives.find(
        (coop: any) => coop._id === cooperativeId
      );

      if (cooperativeId && cooperativeDetails) {
        if (!grouped[cooperativeId]) {
          grouped[cooperativeId] = {
            cooperative: cooperativeDetails,
            shops: [],
          };
        }
        grouped[cooperativeId].shops.push(shop);
      }
    });
    return grouped;
  }, [shopsData, filteredCooperatives]);

  const filteredData = useMemo(() => {
    if (!isLoading && !userLoading && data) {
      let currentTransactions = data.data;

      if (ROLES_WITH_NEW_FEATURES.includes(userRole || "")) {
        currentTransactions = currentTransactions.filter((transaction: any) => {
          const transactionDate = new Date(transaction.createdAt);
          const matchesStartDate = appliedStartDate
            ? transactionDate >= appliedStartDate
            : true;
          const matchesEndDate = appliedEndDate
            ? transactionDate <= appliedEndDate
            : true;
          return matchesStartDate && matchesEndDate;
        });
      }

      return currentTransactions
        .filter((transaction: any) => {
          if (userRole === "RetailerCooperativeShop") {
            if (transaction.shopId?._id !== userDataResult?.data?.worksAt) {
              return false;
            }
          }

          if (userRole === "RetailerCooperative") {
            const matchesCooperative =
              transaction.shopId?.retailerCooperative?._id ===
              userDataResult?.data?.worksAt;
            const matchesShop =
              selectedShop === "all" ||
              transaction.shopId?._id === selectedShop;
            if (!(matchesCooperative && matchesShop)) {
              return false;
            }
          }

          let matchesSearch = searchText === "";

          if (!matchesSearch) {
            const searchLower = searchText.toLowerCase();

            if (
              ["TradeBureau", "SubCityOffice", "WoredaOffice"].includes(
                userRole || ""
              )
            ) {
              matchesSearch = transaction.shopId?.retailerCooperative?.name
                ?.toLowerCase()
                .includes(searchLower);
            } else if (userRole === "RetailerCooperative") {
              matchesSearch = transaction.shopId?.name
                ?.toLowerCase()
                .includes(searchLower);
            } else if (userRole === "RetailerCooperativeShop") {
              matchesSearch = transaction.customerId?.name
                ?.toLowerCase()
                .includes(searchLower);
            }
          }

          const matchesCommodity =
            selectedCommodity === "all" ||
            transaction.commodity?.name?.toLowerCase() === selectedCommodity;
          const matchesStatus =
            selectedStatus === "all" ||
            transaction.status?.toLowerCase() === selectedStatus;
          const matchesCooperative =
            selectedCooperative === "all" ||
            transaction.shopId?.retailerCooperative?._id ===
              selectedCooperative;

          const matchesWoreda =
            selectedWoreda === "all" ||
            transaction.shopId?.retailerCooperative?.woredaOffice?._id ===
              selectedWoreda;

          return (
            matchesSearch &&
            matchesCommodity &&
            matchesStatus &&
            matchesCooperative &&
            matchesWoreda
          );
        })
        .sort((a: any, b: any) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
    }
    return [];
  }, [
    isLoading,
    userLoading,
    data,
    searchText,
    selectedCommodity,
    selectedStatus,
    selectedCooperative,
    selectedShop,
    selectedWoreda,
    userRole,
    userDataResult,
    appliedStartDate,
    appliedEndDate,
    ROLES_WITH_NEW_FEATURES,
  ]);

  const groupedTransactions = useMemo(() => {
    return filteredData.reduce((acc: any, transaction: any) => {
      const cooperativeId = transaction.shopId?.retailerCooperative?._id;
      if (!cooperativeId) return acc;

      if (
        !filteredCooperatives.some((coop: any) => coop._id === cooperativeId)
      ) {
        return acc;
      }

      if (!acc[cooperativeId]) {
        acc[cooperativeId] = {
          cooperative: transaction.shopId?.retailerCooperative,
          transactions: [],
        };
      }

      acc[cooperativeId].transactions.push(transaction);
      return acc;
    }, {});
  }, [filteredData, filteredCooperatives]);

  const currentCooperativeShops = useMemo(() => {
    if (
      userRole !== "RetailerCooperative" ||
      !shopsData?.data ||
      !userDataResult?.data?.worksAt
    ) {
      return [];
    }
    return shopsData.data.filter(
      (shop: any) =>
        shop.retailerCooperative?._id === userDataResult.data.worksAt
    );
  }, [shopsData, userRole, userDataResult]);

  const totalTransactions = ROLES_WITH_NEW_FEATURES.includes(userRole || "")
    ? filteredData.length
    : 0;
  const totalQuantitySold = ROLES_WITH_NEW_FEATURES.includes(userRole || "")
    ? filteredData.reduce(
        (sum: number, transaction: any) => sum + (transaction.amount || 0),
        0
      )
    : 0;
  const totalRevenue = ROLES_WITH_NEW_FEATURES.includes(userRole || "")
    ? filteredData.reduce((sum: number, transaction: any) => {
        const quantity = transaction.amount || 0;
        const pricePerUnit = transaction.commodity?.price || 0;
        return sum + quantity * pricePerUnit;
      }, 0)
    : 0;

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
    setSelectedCooperative("all");
    setSelectedShop("all");
    setSelectedWoreda("all");
    setStartDate(undefined);
    setEndDate(undefined);
    setAppliedStartDate(undefined);
    setAppliedEndDate(undefined);
  };

  const isAnyFilterApplied = useMemo(() => {
    return (
      searchText !== "" ||
      selectedCommodity !== "all" ||
      selectedStatus !== "all" ||
      selectedCooperative !== "all" ||
      selectedShop !== "all" ||
      selectedWoreda !== "all" ||
      startDate !== undefined ||
      endDate !== undefined
    );
  }, [
    searchText,
    selectedCommodity,
    selectedStatus,
    selectedCooperative,
    selectedShop,
    selectedWoreda,
    startDate,
    endDate,
  ]);

  if (
    userLoading ||
    isLoadingCurrentShop ||
    isLoading ||
    shopsLoading ||
    cooperativesLoading ||
    isLoadingWoreda
  )
    return <Loader />;

  const handleShopClick = (shopId: string) => {
    router.push(`/dashboard/transactions/shop/${shopId}`);
  };

  const showNewFeatures = ROLES_WITH_NEW_FEATURES.includes(userRole || "");

  return (
    <div className="flex flex-col gap-4">
      <TransactionCreateModal
        showCreateForm={showCreateForm}
        setShowCreateForm={setShowCreateForm}
      />
      <h2 className="text-3xl font-bold tracking-tight">{t("transactions")}</h2>

      {showNewFeatures && (
        <>
          <TransactionSummaryCards
            totalTransactions={totalTransactions}
            totalQuantitySold={totalQuantitySold}
            totalRevenue={totalRevenue}
          />
        </>
      )}

      {userRole === "RetailerCooperativeShop" && currentShopData && (
        <div className="flex justify-between items-center mb-4">
          <div className="mb-2 mr-4 p-2 border rounded bg-gray-50 text-sm">
            <strong>{t("Available Commodities")}:</strong>
            <ul>
              {currentShopData.data.availableCommodity?.map((item: any) => (
                <li key={item.commodity._id}>
                  {item.commodity.name}: {item.quantity} {item.commodity.unit}
                </li>
              ))}
            </ul>
          </div>
          <Button
            className="mb-2"
            onClick={() => setShowCreateForm((prev) => !prev)}
            variant="default"
          >
            {showCreateForm ? t("close") : t("Add Transaction")}
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {showNewFeatures && (
          <>
            <TransactionFilters
              userRole={userRole}
              woredas={woredas}
              searchText={searchText}
              setSearchText={setSearchText}
              selectedCommodity={selectedCommodity}
              setSelectedCommodity={setSelectedCommodity}
              selectedWoreda={selectedWoreda}
              setSelectedWoreda={setSelectedWoreda}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              handleSearchDates={handleSearchDates}
              handleClearDates={handleClearDates}
              handleResetFilters={handleResetFilters}
              isAnyFilterApplied={isAnyFilterApplied}
              exportToExcel={exportToExcel}
              exportToPDF={exportToPDF}
            />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("transactions")}</CardTitle>
          <CardDescription>{t("viewAllTransactions")}</CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionTable
            userRole={userRole}
            filteredData={filteredData}
            groupedTransactions={groupedTransactions}
            shopsGroupedByCooperative={shopsGroupedByCooperative}
            currentCooperativeShops={currentCooperativeShops}
            isLoading={isLoading}
            shopsLoading={shopsLoading}
            cooperativesLoading={cooperativesLoading}
            isAnyFilterApplied={isAnyFilterApplied}
            handleShopClick={handleShopClick}
          />
        </CardContent>
      </Card>
    </div>
  );
}
