"use server";

import { JSESSIONID, XSRF_TOKEN } from "@/constants/authority";
import { cookies } from "next/headers";

export async function getHeader(): Promise<Record<string, string>> {
  const cookieStore = cookies();
  const token = cookieStore.get(JSESSIONID);
  const xsrf = cookieStore.get(XSRF_TOKEN);
  return {
    Cookie: `${JSESSIONID}=${token?.value};XSRF-TOKEN=${xsrf?.value}`,
    "X-XSRF-TOKEN": xsrf?.value ?? "",
  };
}
