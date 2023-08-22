import { ZodType } from "zod";

// eslint-disable-next-line no-undef
async function request(url: URL, config?: RequestInit) {
  if (!window.fetch) {
    throw "[fetch] Your browser does not support this function";
  }
  const response = await window.fetch(url, config);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

export async function api<T>(apiParams: {
  schema: ZodType<T>;
  url: string;
  // eslint-disable-next-line no-undef
  config?: RequestInit;
  urlSearchParamas?: URLSearchParams;
}): Promise<T> {
  const requestURL = new URL(apiParams.url);
  if (apiParams.urlSearchParamas)
    requestURL.search = apiParams.urlSearchParamas?.toString();
  return apiParams.schema.parse(await request(requestURL, apiParams.config));
}
