import { privateAxiosClient } from '@/lib/api/axios.client';
import { ApiResponse } from '@/types/commons';
import { createOrderDtoOut } from '@/types/order';

const ORDERS = '/orders';

export const createOrderAPI = async (bookId: number) => {
  const response = await privateAxiosClient.post<
    ApiResponse<createOrderDtoOut>
  >(ORDERS, { bookId });
  return response.data.data;
};
