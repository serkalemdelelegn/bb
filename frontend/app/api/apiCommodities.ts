import api from "@/lib/api";

// Get all commodities
export async function getCommodities(token: any) {
  const res = await api.get("/commodities", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

// Update commodity price
export async function updateCommodityPrice(token: any, id: string, price: number) {
  const res = await api.patch(`/commodities/${id}`, { price }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}
