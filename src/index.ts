export interface MockData {
  success: any;
  error?: any;
  status?: number;
}

export interface MockResponse {
  url: string;
  ok: boolean;
  status: number;
  json(): Promise<any>;
}

export function mockFetch(
  input: RequestInfo | URL,
  init: RequestInit,
  mock: MockData,
  timout = 1000
): Promise<MockResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response: MockResponse = {
        url: input.toString(),
        ok: true,
        status: mock?.status ?? 200,
        async json() {
          return Promise.resolve(mock.success);
        },
      };

      if (mock?.status && mock.status >= 400) {
        response.ok = false;
        response.status = mock.status;
        response.json = () => Promise.resolve(mock.error);
      }

      return resolve(response);
    }, timout);
  });
}
