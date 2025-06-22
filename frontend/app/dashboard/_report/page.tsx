// page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getAllReports, createReport } from "@/app/api/apiReport"; // Assuming getAllReports now calls the new endpoint
import { getRetailerCooperativeShops } from "@/app/api/apiRetailerCooperativeShops";
import { format } from 'date-fns'; // For better date formatting

interface Customer {
  _id: string;
  name: string;
  phone: string;
  status: string;
}

interface Transaction {
  _id: string;
  amount: number;
}

interface Commodity {
  _id: string;
  name: string;
}

interface Report {
  _id: string;
  retailerCooperativeShop: string | null; // This will be the name, not ObjectId
  date: string; // The "YYYY-MM-DD" string
  customers: Customer[];
  transactions: Transaction[];
  commodities: Commodity[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface GroupedReports {
  [date: string]: Report[];
}

interface Shop {
  _id: string;
  name: string;
}

const ReportPage: React.FC = () => {
  const [groupedReports, setGroupedReports] = useState<GroupedReports>({});
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null; // Safe localStorage access

  const fetchReports = async () => {
    if (!token) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      // Use the updated getAllReports which now returns grouped data
      const reportsResponse = await getAllReports(token);
      console.log("Fetched Reports Data:", reportsResponse); // Debugging
      setGroupedReports(reportsResponse.groupedReports || {});
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Fetch shops first
        const shopsData = await getRetailerCooperativeShops(token);
        setShops(shopsData.data || []); // Ensure shopsData.data is an array
        
        // Then fetch grouped reports
        await fetchReports();

      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError("Failed to fetch initial data (shops or reports).");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [token]); // Rerun when token changes

  const handleCreateReport = async () => {
    if (!selectedShopId) {
      setCreateError("Please select a shop.");
      return;
    }
    if (!token) {
      setCreateError("User not authenticated.");
      return;
    }
    setCreateError(null);
    setCreating(true);
    try {
      await createReport(token, { retailerCooperativeShopId: selectedShopId });
      // Refresh reports after successful creation
      await fetchReports();
      alert("Report created successfully!"); // User feedback
    } catch (err) {
      console.error("Failed to create report:", err);
      setCreateError("Failed to create report. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg">
        Error: {error}
      </div>
    );
  }

  const renderReport = (report: Report) => (
    <div key={report._id} className="border rounded p-4 mb-4 shadow-sm bg-white dark:bg-gray-700">
      <h3 className="font-semibold mb-2 text-lg text-blue-700 dark:text-blue-300">
        Retailer Cooperative Shop: {report.retailerCooperativeShop || "N/A"}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">Date: {format(new Date(report.date), 'PPP')}</p> {/* Better date format */}
      <p className="text-gray-600 dark:text-gray-300 text-sm">Created At: {format(new Date(report.createdAt), 'Pp')}</p>

      {report.customers && report.customers.length > 0 && (
        <div className="mt-3">
          <h4 className="font-medium text-gray-800 dark:text-gray-200">Customers:</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-400">
            {report.customers.map((customer) => (
              <li key={customer._id}>
                {customer.name} - {customer.phone} - Status: {customer.status}
              </li>
            ))}
          </ul>
        </div>
      )}

      {report.transactions && report.transactions.length > 0 && (
        <div className="mt-3">
          <h4 className="font-medium text-gray-800 dark:text-gray-200">Transactions:</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-400">
            {report.transactions.map((transaction) => (
              <li key={transaction._id}>Amount: {transaction.amount}</li>
            ))}
          </ul>
        </div>
      )}

      {report.commodities && report.commodities.length > 0 && (
        <div className="mt-3">
          <h4 className="font-medium text-gray-800 dark:text-gray-200">Commodities:</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-400">
            {report.commodities.map((commodity) => (
              <li key={commodity._id}>{commodity.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <div className="mb-8 p-4 border rounded-lg shadow-md bg-white dark:bg-gray-700">
        <label htmlFor="shop-select" className="block text-lg font-semibold mb-2">
          Select Retailer Cooperative Shop to create report:
        </label>
        <select
          id="shop-select"
          value={selectedShopId}
          onChange={(e) => setSelectedShopId(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full max-w-xs focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">-- Select a shop --</option>
          {shops.map((shop) => (
            <option key={shop._id} value={shop._id}>
              {shop.name}
            </option>
          ))}
        </select>
        {createError && <p className="text-red-600 dark:text-red-400 mt-2 text-sm">{createError}</p>}
        <button
          onClick={handleCreateReport}
          disabled={creating || !selectedShopId}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {creating ? "Creating..." : "Create Report"}
        </button>
      </div>

      {Object.keys(groupedReports).length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg mt-10">No reports found.</p>
      ) : (
        Object.entries(groupedReports).sort(([dateA], [dateB]) => dateB.localeCompare(dateA)).map(([date, reports]) => ( // Sort dates descending
          <div key={date} className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 border-b-2 border-blue-500 pb-2">
              Reports for {format(new Date(date), 'PPPP')} {/* Nicer date display */}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map(renderReport)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReportPage;