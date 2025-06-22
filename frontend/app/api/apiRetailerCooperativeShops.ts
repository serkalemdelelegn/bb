import api from "@/lib/api";

export async function getRetailerCooperativeShops(token: any) {
  try {
    const res = await api.get("/retailerCooperativeShops", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching retailer cooperative shops:", error);
    throw error;
  }
}

export async function getRetailerCooperativeShopById(token: any, id: string) {
  try {
    const res = await api.get("/retailerCooperativeShops/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching shop by ID ${id}:`, error);
    throw error;
  }
}

export async function getShopsByRetailerCooperativeId(token: any, retailerCooperativeId: string) {
  try {
    const res = await api.get(`/retailerCooperativeShops/retailerCooperative/${retailerCooperativeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching shops by retailer cooperative ID ${retailerCooperativeId}:`, error);
    throw error;
  }
}

export async function getShopsByWoredaOfficeId(token: any, woredaOfficeId: string) {
  try {
    const res = await api.get(`/retailerCooperativeShops/woredaOffice/${woredaOfficeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching shops by woreda office ID ${woredaOfficeId}:`, error);
    throw error;
  }
}

export async function createRetailerCooperativeShop(data: any, token: any) {
  try {
    const res = await api.post("/retailerCooperativeShops", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating retailer cooperative shop:", error);
    throw error;
  }
}

export async function updateRetailerCooperativeShop(id: string, data: any, token: any) {
  try {
    const res = await api.put("/retailerCooperativeShops/" + id, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error updating retailer cooperative shop ${id}:`, error);
    throw error;
  }
}

export async function deleteRetailerCooperativeShop(id: string, token: any) {
  try {
    const res = await api.delete("/retailerCooperativeShops/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error deleting retailer cooperative shop ${id}:`, error);
    throw error;
  }
}
