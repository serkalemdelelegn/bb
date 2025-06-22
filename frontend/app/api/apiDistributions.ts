import api from "@/lib/api";

// Get all distributions
export async function getDistributions(token: any, start?: string, end?: string) {
  try {
    const params: any = {};
    if (start) params.start = start;
    if (end) params.end = end;

    const res = await api.get("/distributions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching distributions:", error);
    throw error;
  }
}

// Get a single distribution by ID
export async function getDistribution(token: any, distributionId: string) {
  try {
    const res = await api.get(`/distributions/${distributionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching distribution ${distributionId}:`, error);
    throw error;
  }
}

// Create a new distribution
export async function createDistribution(token: any, distributionData: any) {
  try {
    const res = await api.post("/distributions", distributionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error creating distribution:", error);
    throw error;
  }
}

// Update a distribution (PATCH)
export async function updateDistribution(token: any, distributionId: string, distributionData: any) {
  try {
    const res = await api.patch(`/distributions/${distributionId}`, distributionData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error updating distribution ${distributionId}:`, error);
    throw error;
  }
}

// Delete a distribution
export async function deleteDistribution(token: any, distributionId: string) {
  try {
    const res = await api.delete(`/distributions/${distributionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error deleting distribution ${distributionId}:`, error);
    throw error;
  }
}

// Get distributions sent to an entity
export async function getDistributionsTo(token: any, id: string, start?: string, end?: string) {
  try {
    const params: any = {};
    if (start) params.start = start;
    if (end) params.end = end;

    const res = await api.get(`/distributions/to/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching distributions to ${id}:`, error);
    throw error;
  }
}

 // Get distributions sent from an entity
export async function getDistributionsFrom(token: any, id: string, start?: string, end?: string) {
  try {
    const params: any = {};
    if (start) params.start = start;
    if (end) params.end = end;

    const res = await api.get(`/distributions/from/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching distributions from ${id}:`, error);
    throw error;
  }
}
