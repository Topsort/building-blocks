import { ZodType } from "zod";

export async function api(url: string, config?: RequestInit) {
  if (!window.fetch) {
    throw "[fetch] Your browser does not support this function";
  }
  const res = await window.fetch(url, config);
  return res.json();
}

export async function enhancedApi<T>(
  schema: ZodType<T>,
  url: string,
  config?: RequestInit
): Promise<T> {
  return schema.parse(await api(url, config));
}
