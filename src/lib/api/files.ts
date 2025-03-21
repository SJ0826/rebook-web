import { privateAxiosClient } from '@/lib/api/axios.client';

export async function uploadImagesAPI(
  files: File[]
): Promise<{ files: { uuid: string; imageUrl: string }[] }> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('images', file); // 필드 이름은 서버와 동일하게 'images'
  });

  const response = await privateAxiosClient.post('/images/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
}
