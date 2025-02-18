export interface IException {
  message: string;
  statusCode: number;
  method: string;
  path: string;
  timestamp: string;
  exception: unknown;
}
