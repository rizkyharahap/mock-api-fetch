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
  text(): Promise<string>;
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
      let data = mock?.success ?? defaultSuccessResponse;

      const response: MockResponse = {
        url: input.toString(),
        ok: true,
        status: mock?.status ?? 200,
        json() {
          return Promise.resolve(data);
        },
        text() {
          return Promise.resolve(JSON.stringify(data));
        },
      };

      if (
        (mock?.status && mock.status >= 400) ||
        (!mock?.success && !!mock?.error)
      ) {
        data = mock?.error ?? defaultErrorResponse;

        response.ok = false;
        response.status = mock?.status ?? 400;
        response.json = () => Promise.resolve(data);
        response.text = () => Promise.resolve(JSON.stringify(data));
      }

      return resolve(response);
    }, timout);
  });
}
