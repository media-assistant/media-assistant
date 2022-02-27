export const get = async (input: RequestInfo, init?: RequestInit) => {
  const response = await fetch(input, { ...init, method: "GET" });
  const isError = !(response.status < 400);

  if (isError) {
    return {
      data: null,
      error: await response.json(),
    };
  } else {
    return {
      data: await response.json(),
      error: null,
    };
  }
};

export default async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
}
