import api from "@/lib/api";

export async function getRetailerCooperatives(token: any) {
  try {
    const res = await api.get("/retailerCooperatives", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching retailer cooperatives:", error);
    throw error;
  }
}

export async function getRetailerCooperativeById(token: any, id: string) {
  try {
    const res = await api.get("/retailerCooperatives/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching retailer cooperative by ID ${id}:`, error);
    throw error;
  }
}

export async function createRetailerCooperative(data: any, token: any) {
  try {
    const res = await api.post("/retailerCooperatives", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating retailer cooperative:", error);
    throw error;
  }
}

export async function updateRetailerCooperative(id: string, data: any, token: any) {
  try {
    const res = await api.put("/retailerCooperatives/" + id, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error updating retailer cooperative ${id}:`, error);
    throw error;
  }
}

export async function deleteRetailerCooperative(id: string, token: any) {
  try {
    const res = await api.delete("/retailerCooperatives/" + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error deleting retailer cooperative ${id}:`, error);
    throw error;
  }
}

export async function getRetailerCooperativeDetails(id: any, token: any) {
  try {
    const res = await api.get(`/retailerCooperatives/details/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching retailer cooperative details for ID ${id}:`, error);
    throw error;
  }
}
