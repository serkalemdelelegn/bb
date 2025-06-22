import api from "@/lib/api";

export async function getWoredas(token: any) {
  try {
    const res = await api.get("/woredaoffices", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching woredas:", error);
    throw error;
  }
}

export async function getWoredaById(token: any, id: any) {
  try {
    const res = await api.get(`/woredaoffices/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching woreda with ID ${id}:`, error);
    throw error;
  }
}

export async function createWoreda(token: any, woredaData: any) {
  try {
    const res = await api.post("/woredaoffices", woredaData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating woreda:", error);
    throw error;
  }
}

export async function updateWoreda(token: any, id: any, woredaData: any) {
  try {
    const res = await api.patch(`/woredaoffices/${id}`, woredaData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error updating woreda with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteWoreda(token: any, id: any) {
  try {
    const res = await api.delete(`/woredaoffices/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error deleting woreda with ID ${id}:`, error);
    throw error;
  }
}
