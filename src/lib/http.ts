import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { env } from "@/env.mjs";
import { TOTAL_COUNT_RESPONSE_HEADER, XSRF_TOKEN } from "@/constants/authority";
import { IResponse } from "@/types/response";

function updateHeaders(customCookie?: Record<string, string>) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const xsrfToken = Cookies.get(XSRF_TOKEN);

  if (xsrfToken) {
    headers[`X-XSRF-TOKEN`] = `${xsrfToken}`;
  }

  if (customCookie) {
    for (const [key, value] of Object.entries(customCookie)) {
      headers[key] = value;
    }
  }

  return headers;
}

export function catchException(response: any): void {
  if (!response.ok) {
    if (response.statusText === "Unauthorized") {
      redirect("/auth");
    }
    const errorResponse: IResponse = {
      success: false,
      message: response.statusText,
    };

    throw errorResponse;
  }
}

export type THeaderResponse = {
  total: number;
  xsrfToken: string;
};

class FetchWrapper {
  private baseUrl: string;

  public constructor(baseUrlApi: string = env.NEXT_PUBLIC_API_URL + "/api/") {
    this.baseUrl = baseUrlApi;
  }

  async get<T>(
    endpoint: string,
    customCookie?: any
  ): Promise<{ headers: THeaderResponse; body: T }> {
    const url = this.baseUrl + endpoint;

    const response = await fetch(url, {
      credentials: "include",
      headers: updateHeaders(customCookie),
    });

    catchException(response);

    const total = response.headers.get(TOTAL_COUNT_RESPONSE_HEADER);

    const xsrfToken = String(response.headers.get("X-XSRF-TOKEN"));

    const body = (await response.json()) as T;

    return {
      headers: {
        total: total ? +total : 0,
        xsrfToken,
      },
      body,
    };
  }

  async post(
    endpoint: string,
    data: any,
    customCookie?: Record<string, string>
  ): Promise<any> {
    const url = this.baseUrl + endpoint;
    const requestOptions: RequestInit = {
      method: "POST",
      headers: updateHeaders(customCookie),
      body: JSON.stringify(data),
      credentials: "include",
    };

    const response = await fetch(url, requestOptions);

    catchException(response);

    return response;
  }

  async put(
    endpoint: string,
    data: any,
    customCookie?: Record<string, string>
  ): Promise<any> {
    const url = this.baseUrl + endpoint;
    const requestOptions: RequestInit = {
      method: "PUT",
      headers: updateHeaders(customCookie),
      body: JSON.stringify(data),
      credentials: "include",
    };

    const response = await fetch(url, requestOptions);

    catchException(response);

    return response;
  }

  async patch(
    endpoint: string,
    data: any,
    customCookie?: Record<string, any>
  ): Promise<any> {
    const url = this.baseUrl + endpoint;

    const requestOptions: RequestInit = {
      method: "PATCH",
      headers: updateHeaders(customCookie),
      body: JSON.stringify(data),
      credentials: "include",
    };

    const response = await fetch(url, requestOptions);

    catchException(response);

    return response.json();
  }

  async delete(
    endpoint: string,
    customCookie?: Record<string, string>
  ): Promise<any> {
    const url = this.baseUrl + endpoint;

    const requestOptions: RequestInit = {
      method: "DELETE",
      credentials: "include",
      headers: updateHeaders(customCookie),
    };

    const response = await fetch(url, requestOptions);

    catchException(response);

    return response;
  }
}

const http = new FetchWrapper();
export const httpInternal = new FetchWrapper("");

export default http;
