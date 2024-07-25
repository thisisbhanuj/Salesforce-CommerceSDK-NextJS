export class SCAPIError extends Error {
    statusCode?: number;
    data?: any;
  
    constructor(message: string, statusCode?: number, data?: any) {
      super(message);
      this.name = 'SCAPIError';
      this.statusCode = statusCode;
      this.data = data;
    }
}
  