import api from "@/lib/api";

export async function uploadFile(file: File, token: any) {
  const formData = new FormData();
  formData.append("files", file);
  try {
    const res = await api.post('/upload/uploadFile', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: Do NOT set 'Content-Type' when sending FormData — axios will do it correctly.
      },
    });

    return res.data;
  } catch (error) {
    console.error('Failed to upload files', error);
  }
}
