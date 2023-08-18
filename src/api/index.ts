import { ZodType } from "zod";

// eslint-disable-next-line no-undef
async function request(url: string, config?: RequestInit) {
  if (!window.fetch) {
    throw "[fetch] Your browser does not support this function";
  }
  const corsConfig = (import.meta.env.DEV && "no-cors") || "cors";
  const response = await window.fetch(url, { ...config, mode: corsConfig });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

export async function api<T>(
  schema: ZodType<T>,
  url: string,
  // eslint-disable-next-line no-undef
  config?: RequestInit
): Promise<T> {
  return schema.parse(await request(url, config));
}
