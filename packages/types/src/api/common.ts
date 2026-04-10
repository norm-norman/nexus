/**
 * JSON envelope returned by most Nest calendar routes.
 */
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}
