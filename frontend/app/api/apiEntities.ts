import api from "@/lib/api";

export async function getAllEntities(token:any) {
  const response = await api.get('/entities', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}