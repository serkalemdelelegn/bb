import api from "@/lib/api";
import { headers } from "next/headers";

export async function getUsers(token: any) {
  const res = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function getUserById(token: any, id: string) {
  const res = await api.get(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function updateUser(token: any, id: string, userData: any) {
  const res = await api.patch(`/users/${id}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function createUser(token: any, userData: any) {
  const res = await api.post("/users", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function deleteUser(token: any, id: string) {
  const res = await api.delete(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function updateMe(token: any, userData: any) {
  const res = await api.patch('/users/updateMe', userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  return res.data;
}