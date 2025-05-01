// 거래 상태 enum
enum OrderStatus {
  PENDING,
  COMPLETED,
  CANCELED,
}

// 거래 생성 API 응답 DTO
export interface createOrderDtoOut {
  id: number;
  bookId: number;
  buyerId: number;
  sellerId: number;
  createdAt: Date;
  status: OrderStatus;
}
