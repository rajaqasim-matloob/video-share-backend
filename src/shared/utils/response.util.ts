export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  statusCode: number;
}

export function apiResponse<T>(success: boolean, message: string, statusCode: number, data?: T): ApiResponse<T> {
  return {
    success,
    message,
    statusCode,
    data,
  };
}
