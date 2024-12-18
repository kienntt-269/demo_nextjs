export interface IResponse {
    success: boolean;
    message: string;
    data?: any;
  }
  
  export interface IQueryParam {
    page: number;
    name?: string;
    limit?: string | number;
  }
  