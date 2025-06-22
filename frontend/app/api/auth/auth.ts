import api from "@/lib/api";

// User login
export async function loginUser(credentials: {
  username: string;
  password: string;
}) {
  const res = await api.post("users/login", credentials, {
    withCredentials: true,
  });
  return res.data;
}

// User signup (registration)
export async function signUpUser(userData: {
  username: string;
  password: string;
  name: string;
  role: string;
  worksAt?: string;
}) {
  const res = await api.post("/users/signup", userData);
  return res.data;
}

// Logout function (if your backend implements /logout)
export async function logoutUser() {
  await api.get("users/logout", {
    withCredentials: true,
  });
}

// Get current logged-in user (protected route example)
export async function getCurrentUser(token: string) {
  const res = await api.get("/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

// Update password
export async function updatePassword(token: string,data: {
  password: string;
  newPassword: string;
}) {
  const res = await api.patch("/users/updateMyPassword", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return res.data;
}
