import api from "@/lib/api";

export async function getAllocations(token: any, start?: string, end?: string) {
  try {
    const params: any = {};
    if (start) params.start = start;
    if (end) params.end = end;

    const res = await api.get("/allocations", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching allocations:", error);
    throw error;
  }
}

export async function getAllocation(token: any, allocationId: string) {
  try {
    const res = await api.get(`/allocations/${allocationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching allocation ${allocationId}:`, error);
    throw error;
  }
}

export async function getAllocationsByWoredaOffice(token: any, woredaOfficeId: string, start?: string, end?: string) {
  try {
    const params: any = {};
    if (start) params.start = start;
    if (end) params.end = end;

    const res = await api.get(`/allocations/woredaOffice/${woredaOfficeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching allocations for WoredaOffice ${woredaOfficeId}:`, error);
    throw error;
  }
}

// Create a new allocation
export async function createAllocation(token: any, allocationData: any) {
  try {
    const res = await api.post("/allocations", allocationData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.status;
  } catch (error) {
    console.error("Error creating allocation:", error);
    throw error;
  }
}

// Update an allocation (PATCH)
export async function updateAllocation(token: any, allocationId: string, allocationData: any) {
  try {
    const res = await api.patch(`/allocations/${allocationId}`, allocationData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error updating allocation ${allocationId}:`, error);
    throw error;
  }
}

// Delete an allocation
export async function deleteAllocation(token: any, allocationId: string) {
  try {
    const res = await api.delete(`/allocations/${allocationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(`Error deleting allocation ${allocationId}:`, error);
    throw error;
  }
}

export async function getAllocationsTo(token: any, id: string, start?: string, end?: string) {
  try {
    const params: any = {};
    if (start) params.start = start;
    if (end) params.end = end;

    const res = await api.get(`/allocations/to/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return res.data;
  } catch (error) {
    console.error(`Error fetching allocations to ${id}:`, error);
    throw error;
  }
}
