import api from "@/lib/api";
import { uploadFile } from "./apiFile";

// Get all alerts
export async function getAlerts(token: any, start?: string, end?: string) {
  try {
    const params: any = {};
    if (start) params.start = start;
    if (end) params.end = end;
    const res = await api.get("/alerts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }
}

export async function getAlert(token: any, alertId: string) {
  try {
    const res = await api.get(`/alerts/${alertId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching alert with ID ${alertId}:`, error);
    throw error;
  }
}

// Create a new alert
export async function createAlert(token: any, alertData: any) {
  try {
    if (alertData.file) {
      const data = await uploadFile(alertData.file, token);
      alertData.file = data.data[0].url;
    }

    const res = await api.post("/alerts", alertData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating alert:", error);
    throw error;
  }
}

export async function updateAlert(token: string, alertId: string, alertData: any) {
  try {
    const res = await api.patch(`/alerts/${alertId}`, alertData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating alert:", error);
    throw error;
  }
}

export async function deleteAlert(token: any, alertId: string) {
  try {
    const res = await api.delete(`/alerts/${alertId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error deleting alert:", error);
    throw error;
  }
}

export async function getAlertsTo(token: any, id: string, start?: string, end?: string) {
  try {
    const params: any = {};
    if (start) params.start = start;
    if (end) params.end = end;
    const res = await api.get(`/alerts/to/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching alerts to ID ${id}:`, error);
    throw error;
  }
}
