import api from "@/lib/api";

export async function createReport(token: any, reportData: any) {
  try {
    const res = await api.post("/reports", reportData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
}

export async function getAllReports(token: any) {
  try {
    const res = await api.get("/reports", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching all reports:", error);
    throw error;
  }
}

export async function getReports(token: any, retailerCooperativeShopId: string) {
  try {
    const res = await api.get(`/reports/${retailerCooperativeShopId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching reports for shop ${retailerCooperativeShopId}:`, error);
    throw error;
  }
}
