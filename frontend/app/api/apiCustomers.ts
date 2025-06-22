import api from "@/lib/api";

export async function getCustomers(token: any) {
  try {
    const res = await api.get("/customers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
}

export async function getCustomer(token: any) {
  try {
    const res = await api.get("/customers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
}

export async function getCustomerByWoredaOffice(token: any, woredaOfficeId: string) {
  try {
    const res = await api.get(`/customers/woredaOffice/${woredaOfficeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching customers for WoredaOffice ${woredaOfficeId}:`, error);
    throw error;
  }
}

export async function getCustomerByRetailerCooperative(token: any, retailerCooperativeId: string) {
  try {
    const res = await api.get(`/customers/retailerCooperative/${retailerCooperativeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching customers for RetailerCooperative ${retailerCooperativeId}:`, error);
    throw error;
  }
}

export async function getCustomerByShop(token: any, shopId: string) {
  try {
    const res = await api.get(`/customers/shop/${shopId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching customers for shop ${shopId}:`, error);
    throw error;
  }
}

export async function updateCustomer(token: any, customerId: string, customerData: any) {
  try {
    const res = await api.patch(`/customers/${customerId}`, customerData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error updating customer ${customerId}:`, error);
    throw error;
  }
}

export async function createCustomer(token: any, customerData: any) {
  try {
    console.log({ customerData });
    const res = await api.post("/customers", customerData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
}

export async function deleteCustomer(token: any, customerId: string) {
  try {
    const res = await api.delete(`/customers/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error deleting customer ${customerId}:`, error);
    throw error;
  }
}

export async function getCustomerById(token: any, customerId: string) {
  try {
    const res = await api.get(`/customers/id/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching customer by ID ${customerId}:`, error);
    throw error;
  }
}
