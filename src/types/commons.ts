export interface ApiResponse {
  success: boolean;
  message: string | string[];
  error?: string; // 오류 유형 (예: "Bad Request", "Unauthorized" 등)
  timeStamp: string;
  data: any;
}
