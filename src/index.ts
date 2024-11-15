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

/**
 * This function is a placeholder for mocking API calls using `fetch` until the real API is available. It simulates an asynchronous request and returns a mocked response after a specified delay.
 *
 * The implementation of this function can be improved once the contract for the real API is defined, particularly for handling success and error responses.
 *
 * After the real API is ready, you can replace `unreadyFetch` with `fetch`, remove the mock data and timeout, and remove the import from `'unready-fetch'`.
 *
 * @param {RequestInfo | URL} input - The resource that you wish to fetch. This can be a URL string or a `Request` object.
 * @param {RequestInit} init [init] - An optional configuration object for the fetch request. This can include methods like `method`, `headers`, `body`, etc.
 * @param {MockData} mock [mock] - Optional mock data that will be returned as the response. If provided, the function will return this mock data after the specified timeout.
 * @param {number} timout [timout=1000] - The time (in milliseconds) to wait before resolving the promise with the mock response. Defaults to 1000ms (1 second).
 *
 * @returns {Promise<MockResponse>} - A promise that resolves to a `MockResponse` object,  which can contain either the mocked data or an error message.
 *
 * @example
 * // Example usage of unreadyFetch
 * const response = await unreadyFetch('https://api.example.com/data', { method: 'GET' }, mockData, 500);
 * console.log(response.data);
 */
export function unreadyFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  mock?: MockData,
  timout: number = 1000
): Promise<MockResponse> {
  return new Promise((resolve) => {
    // Show warning to remind the real API not implemented
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
        // Returns error when status is greater than or equal to 400
        (mock?.status && mock.status >= 400) ||
        // Or returns error when mock success not set but mock error is set
        (!mock?.success && !!mock?.error)
      ) {
        data = mock?.error ?? defaultErrorResponse;

        response.ok = false;
        response.status = mock?.status ?? 400;
      }

      return resolve(response);
    }, timout);
  });
}
