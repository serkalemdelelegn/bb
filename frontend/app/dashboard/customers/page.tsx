"use client";

import type React from "react";

import {
  createCustomer,
  getCustomerByRetailerCooperative,
  getCustomerByShop,
  getCustomerByWoredaOffice,
  getCustomers,
  updateCustomer, // Import the new updateCustomer API
} from "@/app/api/apiCustomers";
import { getWoredas } from "@/app/api/apiWoreda";
import { getCurrentUser } from "@/app/api/auth/auth";
import { decodeJWT } from "@/app/api/auth/decode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { getShopsByWoredaOfficeId } from "@/app/api/apiRetailerCooperativeShops";
import CustomerCreateDialog from "@/components/customer/CustomerCreateDialog";
import CustomerUpdateDialog from "@/components/customer/CustomerUpdateDialog"; // Import the update dialog
import CustomerFilters from "@/components/customer/CustomerFilters";
import CustomerTable from "@/components/customer/CustomerTable";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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

// This interface should correctly reflect the data structure of a customer
// as returned by your API, including the _id.
interface CustomerDataFromServer {
  _id: string; // Add _id for updating
  name: string;
  ID_No: string;
  house_no: string;
  woreda: { _id: string; name: string } | null; // <--- CHANGED: Allow null here
  phone: string;
  ketena: string;
  numberOfFamilyMembers: number;
  retailerCooperativeShop: { _id: string; name: string } | null; // <--- CHANGED: Allow null here
  status: string; // Add status property as it's used in CustomerTable
}


export default function CitizensPage() {
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // Renamed for clarity
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false); // New state for update dialog
  const [editingCustomer, setEditingCustomer] = useState<CustomerDataFromServer | null>(null); // New state to hold customer being edited
  const [selectedWoreda, setSelectedWoreda] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    ID_No: "",
    house_no: "",
    woreda: "",
    phone: "",
    ketena: "",
    numberOfFamilyMembers: "",
    retailerCooperativeShop: "",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10); // Show 10 records per page

  const queryClient = useQueryClient();

  const { data: userDataResult, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getCurrentUser(localStorage.getItem("token") || ""),
  });

  useEffect(() => {
    const role = decodeJWT(localStorage.getItem("token") || "")?.role.name;
    setUserRole(role);
  }, []);

  const { data, isLoading, refetch } = useQuery({ // Added refetch
    queryKey: ["customers"],
    queryFn: () => {
      const token = localStorage.getItem("token") || "";
      const worksAtId = userDataResult?.data?.worksAt;

      if (!worksAtId) return Promise.resolve({ data: [] }); // Handle case where worksAt is not yet available

      switch (userRole) {
        case "WoredaOffice":
          return getCustomerByWoredaOffice(token, worksAtId);
        case "RetailerCooperativeShop":
          return getCustomerByShop(token, worksAtId);
        case "RetailerCooperative":
          return getCustomerByRetailerCooperative(token, worksAtId);
        default:
          return getCustomers(token);
      }
    },
    enabled: !!userRole && !userLoading,
  });

  const { data: woredas, isLoading: isLoadingWoreda } = useQuery({
    queryKey: ["woredas"],
    queryFn: () => getWoredas(localStorage.getItem("token") || ""),
    enabled:
      userRole !== "RetailerCooperativeShop" &&
      userRole !== "RetailerCooperative" &&
      !userLoading,
  });

  // For RetailerCooperativeShop users, shops data is not needed directly for dropdown
  // but if WoredaOffice users are creating customers, they need shops for dropdown
  const { data: shops, isLoading: isLoadingShops } = useQuery({
    queryKey: ["shops"],
    queryFn: () =>
      getShopsByWoredaOfficeId(
        localStorage.getItem("token") || "",
        userDataResult?.data?.worksAt // Use optional chaining here
      ),
    enabled:
      userRole === "WoredaOffice" && // Only enabled for WoredaOffice role
      !userLoading &&
      !!userDataResult?.data?.worksAt, // Ensure worksAt is available
  });

  // Mutation for adding a customer
  const { mutate: addCustomer, isPending: isAddingCustomer } = useMutation({
    mutationFn: (customerData: CustomerFormData) => // Use CustomerFormData for input
      createCustomer(localStorage.getItem("token") || "", {
        ...customerData,
        numberOfFamilyMembers: parseInt(customerData.numberOfFamilyMembers),
        woreda: userDataResult?.data?.worksAt || '', // Ensure woreda is set if WoredaOffice
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success(t("customerAddedSuccessfully"));
      setIsCreateDialogOpen(false); // Close create dialog
      setFormData({ // Reset form data
        name: "", ID_No: "", house_no: "", woreda: "", phone: "", ketena: "",
        numberOfFamilyMembers: "", retailerCooperativeShop: "",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("errorAddingCustomer"));
    },
  });

  // NEW: Mutation for updating a customer
  const { mutate: updateCustomerMutation, isPending: isUpdatingCustomer } = useMutation({
    mutationFn: ({ customerId, customerData }: { customerId: string, customerData: Partial<CustomerFormData> }) =>
      updateCustomer(localStorage.getItem("token") || "", customerId, {
        ...customerData,
        // Convert to number if it's being updated
        ...(customerData.numberOfFamilyMembers && { numberOfFamilyMembers: parseInt(customerData.numberOfFamilyMembers) }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success(t("customerUpdatedSuccessfully"));
      setIsUpdateDialogOpen(false); // Close update dialog
      setEditingCustomer(null); // Clear editing customer
      setFormData({ // Reset form data
        name: "", ID_No: "", house_no: "", woreda: "", phone: "", ketena: "",
        numberOfFamilyMembers: "", retailerCooperativeShop: "",
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t("errorUpdatingCustomer"));
    },
  });


  const sortedAndFilteredCustomers = useMemo(() => {
    let customers = data?.data || [];

    customers = customers.filter((customer: CustomerDataFromServer) => { // Use CustomerDataFromServer type
      const woredaMatch =
        selectedWoreda === "all" || (customer.woreda && customer.woreda.name === selectedWoreda);
      const searchMatch =
        customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.ID_No.toLowerCase().includes(searchText.toLowerCase()) || // Allow searching by ID_No
        customer.phone.toLowerCase().includes(searchText.toLowerCase()) || // Allow searching by Phone
        (customer.retailerCooperativeShop?.name || "").toLowerCase().includes(searchText.toLowerCase()); // Search by shop name

      const shopMatch =
        userRole === "RetailerCooperativeShop"
          ? customer.retailerCooperativeShop?._id ===
            userDataResult?.data?.worksAt
          : true;
      return woredaMatch && searchMatch && shopMatch;
    });

    // Sort by name (A-Z)
    customers.sort((a: any, b: any) => a.name.localeCompare(b.name));

    return customers;
  }, [data, selectedWoreda, searchText, userRole, userDataResult]);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedAndFilteredCustomers.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const nPages = Math.ceil(sortedAndFilteredCustomers.length / recordsPerPage);

  if (isLoading || userLoading || isLoadingWoreda || isLoadingShops)
    return <Loader />;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // For the create customer dialog
  const handleNewCitizen = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.ID_No ||
      !formData.retailerCooperativeShop
    ) {
      toast.error(t("pleaseCompleteRequiredFields"));
      return;
    }

    // `woreda` should be the ID of the WoredaOffice for creation, which comes from `userDataResult.data.worksAt`
    const customerDataForCreation: CustomerFormData = {
      ...formData,
      woreda: userDataResult?.data?.worksAt || '', // Assuming worksAt is the woreda ID for WoredaOffice role
    };

    addCustomer(customerDataForCreation);
  };

  // NEW: Function to handle editing a customer
  const handleEditCustomer = (customer: CustomerDataFromServer) => {
    setEditingCustomer(customer);
    // Populate the formData with the existing customer's data for editing
    setFormData({
      name: customer.name,
      ID_No: customer.ID_No,
      house_no: customer.house_no,
      woreda: customer.woreda?._id || '', // Populate with ID if it's an object
      phone: customer.phone,
      ketena: customer.ketena,
      numberOfFamilyMembers: String(customer.numberOfFamilyMembers), // Convert to string for input
      retailerCooperativeShop: customer.retailerCooperativeShop?._id || '', // Populate with ID if it's an object
    });
    setIsUpdateDialogOpen(true); // Open the update dialog
  };

  // NEW: Function to handle the submission of the update form
  const handleUpdateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCustomer?._id) {
      toast.error(t("noCustomerSelectedForUpdate"));
      return;
    }

    if (
      !formData.name ||
      !formData.ID_No ||
      !formData.retailerCooperativeShop
    ) {
      toast.error(t("pleaseCompleteRequiredFields"));
      return;
    }

    const updatedData: Partial<CustomerFormData> = {
      name: formData.name,
      ID_No: formData.ID_No,
      house_no: formData.house_no,
      phone: formData.phone,
      ketena: formData.ketena,
      numberOfFamilyMembers: formData.numberOfFamilyMembers,
      retailerCooperativeShop: formData.retailerCooperativeShop,
      // Woreda is generally not updated from the customer form,
      // as it's tied to the WoredaOffice user.
      // If it can be changed, you'd need a dropdown for it.
    };

    updateCustomerMutation({
      customerId: editingCustomer._id,
      customerData: updatedData,
    });
  };


  const exportToPDF = () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    });

    const columns = [
      "No",
      "name",
      ...(userRole !== "RetailerCooperative" &&
      userRole !== "RetailerCooperativeShop"
        ? ["Id number"]
        : []),
      "House number",
      "Woreda",
      "Phone",
      "Ketena",
      "Family number",
      "shop",
    ];

    const rows = sortedAndFilteredCustomers.map((customer: any, index: number) => {
      const row = [
        index + 1,
        customer.name,
        ...(userRole !== "RetailerCooperative" &&
        userRole !== "RetailerCooperativeShop"
          ? [customer.ID_No]
          : []),
        customer.house_no,
        customer.woreda.name,
        customer.phone,
        customer.ketena,
        customer.numberOfFamilyMembers,
        customer.retailerCooperativeShop.name,
      ];
      return row;
    });

    doc.text("Customer Data", 40, 40);
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 60,
      styles: { font: "helvetica", fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    });
    doc.save(`customer_data_${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {t("customersManagement")}
        </h2>
        <Button
          onClick={exportToPDF}
          className='w-fit'
        >
          <Download className="mr-2 h-4 w-4" /> {/* Added class for spacing */}
          {t("exportP")}
        </Button>
        {userRole === "WoredaOffice" && (
          <CustomerCreateDialog
            isDialogOpen={isCreateDialogOpen} // Use renamed state
            setIsDialogOpen={setIsCreateDialogOpen} // Use renamed setter
            formData={formData}
            handleInputChange={handleInputChange}
            handleNewCitizen={handleNewCitizen}
            isAddingCustomer={isAddingCustomer}
            shops={shops?.data || []}
          />
        )}
      </div>
      <CustomerFilters
        userRole={userRole}
        woredas={woredas}
        selectedWoreda={selectedWoreda}
        setSelectedWoreda={setSelectedWoreda}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <CustomerTable
        userRole={userRole}
        currentRecords={currentRecords}
        nPages={nPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onEditCustomer={userRole === "WoredaOffice" ? handleEditCustomer : undefined} // Pass edit handler only for WoredaOffice
      />

      {/* NEW: Customer Update Dialog */}
      {userRole === "WoredaOffice" && editingCustomer && (
        <CustomerUpdateDialog
          isDialogOpen={isUpdateDialogOpen}
          setIsDialogOpen={setIsUpdateDialogOpen}
          formData={formData} // This will be pre-filled by handleEditCustomer
          handleInputChange={handleInputChange}
          handleUpdateCustomer={handleUpdateCustomerSubmit}
          isUpdatingCustomer={isUpdatingCustomer}
          shops={shops?.data || []} // Pass shops to the update dialog too
        />
      )}
    </div>
  );
}