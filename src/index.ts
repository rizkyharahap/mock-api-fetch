export interface MockData {
  success?: any;
  error?: any;
  status?: number;
}

export interface MockResponse {
  url: string;
  ok: boolean;
  status: number;
  json(): Promise<any>;
}

const defaultSuccessResponse = {
  status: "success",
  code: 200,
  data: {
    id: 123,
    name: "Sample Data",
  },
  errors: null,
};

const defaultErrorResponse = {
  status: "error",
  code: 400,
  data: null,
  errors: [
    {
      field: "email",
      message: "Email is required",
    },
  ],
  trace_id: "abc123xyz",
};

export function unreadyFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  mock?: MockData,
  timout = 1000
): Promise<MockResponse> {
  return new Promise((resolve) => {
    console.warn(
      "Unready fetch used! Please change to real fetch after API is ready!"
    );

    setTimeout(() => {
      const response: MockResponse = {
        url: input.toString(),
        ok: true,
        status: mock?.status ?? 200,
        async json() {
          return Promise.resolve(mock?.success ?? defaultSuccessResponse);
        },
      };

      if (
        (mock?.status && mock.status >= 400) ||
        (!mock?.success && !!mock?.error)
      ) {
        response.ok = false;
        response.status = mock?.status ?? 400;
        response.json = () =>
          Promise.resolve(mock?.error ?? defaultErrorResponse);
      }

      return resolve(response);
    }, timout);
  });
}
