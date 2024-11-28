import { AxiosError, type AxiosRequestConfig, CanceledError } from "axios";

export interface UnreadyAxiosMock<S = any, E = any> {
  success?: S;
  error?: E;
  status?: number;
}

export interface UnreadyAxiosResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any & {
    data?: D;
  };
  request?: any;
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

export function unreadyAxios<S = any, E = any>(
  mock?: UnreadyAxiosMock<S, E>,
  timeout: number = 1000
) {
  return {
    request<T = S, R = UnreadyAxiosResponse<T>, D = any>(
      config: AxiosRequestConfig<D>
    ): Promise<R> {
      return new Promise((resolve, reject) => {
        let data = mock?.success ?? (defaultSuccessResponse as S);

        const response: UnreadyAxiosResponse<S> = {
          data,
          status: mock?.status || 200,
          statusText: "",
          headers: {},
          request: {},
          config: {
            ...config,
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": undefined,
              ...(config?.headers || {}),
            },
          },
        };

        const timeoutId = setTimeout(() => {
          if (
            // Returns error when status is greater than or equal to 400
            (mock?.status && mock.status >= 400) ||
            // Or returns error when mock success not set but mock error is set
            (!mock?.success && !!mock?.error)
          ) {
            const errData = mock?.error ?? (defaultErrorResponse as E);
            const errorResponse: UnreadyAxiosResponse<E, E> = {
              ...response,
              status: mock?.status ?? 400,
              data: errData,
            };

            return reject(
              new AxiosError(
                `Request failed with status code ${mock.status}`,
                "ERR_BAD_REQUEST",
                errorResponse.config,
                errorResponse.request,
                errorResponse
              )
            );
          }

          return resolve(response as R);
        }, timeout);

        if (config?.signal) {
          // listen event abort
          config.signal.addEventListener?.("abort", () => {
            // clear timeout and throw a signal reason
            clearTimeout(timeoutId);
            return reject(
              new CanceledError(
                undefined,
                undefined,
                response.config,
                response.request
              )
            );
          });
        }
      });
    },
  };
}
