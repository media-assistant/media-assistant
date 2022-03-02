type GenericObject = Record<string, unknown>;

const getDefaults = (): RequestInit => ({
  headers: {
    "Content-Type": "application/json",
  },
});

const customFetch = async <T>(
  input: RequestInfo,
  init?: RequestInit | undefined
): Promise<T> => {
  init = { ...getDefaults(), ...init };

  const response = await fetch(input, init);

  // if (response.status === 401) {
  //   // Throw a different error when unauthorized?
  // }

  if (!response.ok) {
    throw await responseToError(response);
  }

  return (await response.json()) as T;
};

const responseToError = async (response: Response): Promise<Error> => {
  let response_errors = {} as GenericObject;

  try {
    response_errors = (await response.json()) as GenericObject;
  } catch (error) {
    return new Error(response.statusText);
  }
  const errors = (response_errors.errors ?? {}) as GenericObject;

  let message = String(response_errors.message ?? response.statusText);

  for (const key of Object.keys(errors)) {
    message += " " + String(errors[key]);
  }

  return new Error(message);
};

export const dataToInit = (data: GenericObject): RequestInit => ({
  body: JSON.stringify(data),
});

export const get = async <T>(
  input: RequestInfo,
  init?: RequestInit | undefined
): Promise<T> => customFetch<T>(input, init);

export const post = async <T>(
  input: RequestInfo,
  body?: GenericObject,
  init?: Omit<RequestInit, "body"> | undefined
): Promise<T> =>
  customFetch<T>(input, {
    method: "POST",
    ...(body && { body: JSON.stringify(body) }),
    ...init,
  });

export const put = async <T>(
  input: RequestInfo,
  init?: RequestInit | undefined
): Promise<T> => customFetch<T>(input, { method: "PUT", ...init });

export const patch = async <T>(
  input: RequestInfo,
  init?: RequestInit | undefined
): Promise<T> => customFetch<T>(input, { method: "PATCH", ...init });

export const del = async <T>(
  input: RequestInfo,
  init?: RequestInit | undefined
): Promise<T> => customFetch<T>(input, { method: "DELETE", ...init });

export const upload = async <T>(
  input: RequestInfo,
  form_data: FormData,
  init?: RequestInit | undefined
): Promise<T> =>
  customFetch<T>(input, {
    method: "PUT",
    ...init,
    body: form_data,
  });
