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
 * This function is a placeholder for mocking API calls using `fetch` until the real API is available.
 * It simulates an asynchronous request and returns a mocked response after a specified delay.
 *
 * The implementation of this function can be replaced with the real `fetch` API once the backend is ready.
 * Remove the mock data, timeout, and `unready-fetch` import when transitioning to the real API.
 *
 * @param {MockData} [mock] - Optional mock data to simulate the API response. If not provided, default mock success and error responses are used.
 * @param {number} [timeout=1000] - Time (in milliseconds) to wait before resolving the promise with the mock response. Defaults to 1000ms (1 second).
 *
 * @returns {fn(input: RequestInfo | URL, init?: RequestInit): Promise<MockResponse>} - A function that simulates a fetch request, returning a promise that resolves to a `MockResponse` object.
 *
 * @example
 * // Example usage of unreadyFetch
 * const mockData = {
 *   success: { message: "Success!", data: [] },
 *   status: 200,
 * };
 *
 * const response = await unreadyFetch(mockData, 500)('https://api.example.com/data', { method: 'GET' });
 * if (response.ok) {
 *   console.log(await response.json());
 * } else {
 *   console.error(await response.json());
 * }
 *
 */
export function unreadyFetch(mock?: MockData, timout: number = 1000) {
  // Show warning to remind the real API not implemented
  console.warn(
    "Unready fetch used! Please change to real fetch after API is ready!"
  );

  /**
   * Simulates a fetch request using the provided mock data, timeout, and configuration options.
   *
   * This function behaves like the native `fetch` API but uses mocked data to simulate
   * the response. It supports aborting the request if an `AbortSignal` is provided in `init.signal`.
   *
   * @param {RequestInfo | URL} input - The resource to fetch. Can be a URL string or a `Request` object.
   * @param {RequestInit} [init] - Optional configuration object for the fetch request. This can include HTTP methods, headers, request body, and an `AbortSignal`.
   *
   * @returns {Promise<MockResponse>} - A promise that resolves to a simulated `MockResponse` object containing mock data, status, and other response properties.
   */
  return function (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<MockResponse> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
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

      if (init?.signal) {
        // listen event abort
        init.signal.addEventListener("abort", () => {
          // clear timeout and throw a signal reason
          clearTimeout(timeoutId);
          return reject(init.signal?.reason);
        });
      }
    });
  };
}
