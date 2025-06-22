import api from "@/lib/api";

export async function getSubCities(token: any) {
  const response = await api.get('/subcityoffices', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function createSubCity(data: any, token: any) {
  const response = await api.post('/subcityoffices', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateSubCity(id: string, data: any, token: any) {
  const response = await api.put(`/subcityoffices/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deleteSubCity(id: string, token: any) {
  const response = await api.delete(`/subcityoffices/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
