import { AxiosError, CanceledError } from "axios";
import { unreadyAxios } from "./unready-axios";

describe("unready-axios", () => {
  test("Return success value", async () => {
    const response = await unreadyAxios().request({ method: "GET" });

    expect(response).toStrictEqual({
      config: {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": undefined,
        },
        method: "GET",
      },
      data: {
        code: 200,
        data: { id: 123, name: "Sample Data" },
        errors: null,
        status: "success",
      },
      headers: {},
      request: {},
      status: 200,
      statusText: "",
    });
  });

  test("Return success value with custom success data", async () => {
    const successData = { data: { id: 1, name: "Test" } };
    const response = await unreadyAxios({ success: successData }, 10).request({
      method: "GET",
    });

    expect(response.data).toStrictEqual(successData);
  });

  test("Return success value with custom status", async () => {
    const successData = { data: { id: 1, name: "Test" } };
    const response = await unreadyAxios(
      { success: successData, status: 201 },
      10
    ).request({
      method: "GET",
    });

    expect(response.status).toBe(201);
  });

  test("Return error if set http status larger or equal 400", async () => {
    try {
      await unreadyAxios({ status: 400 }, 10).request({
        method: "GET",
      });

      throw new Error("unreadyAxios not throw error");
    } catch (error) {
      if (error instanceof AxiosError) {
        expect(error.name).toBe("AxiosError");
        expect(error.response?.status).toBe(400);
        expect(error.response?.data).toStrictEqual({
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
        });
        return;
      }

      throw new Error("Error not throw AxiosError");
    }
  });

  test("Return error if only asigned error", async () => {
    const errorData = { error: "Oops something when wrong !", code: 400 };

    try {
      await unreadyAxios({ error: errorData }, 10).request({
        method: "GET",
      });

      throw new Error("unreadyAxios not throw error");
    } catch (error) {
      if (error instanceof AxiosError) {
        expect(error.response?.data).toStrictEqual(errorData);
        return;
      }

      throw new Error("Error not throw AxiosError");
    }
  });
});

describe("unready-fetch with AbortController", () => {
  test("Throw an CanceledError when controller is aborted", async () => {
    try {
      const controller = new AbortController();

      setTimeout(() => {
        controller.abort();
      }, 50);

      await unreadyAxios(undefined, 100).request({
        signal: controller.signal,
      });

      throw new Error("Controller not aborted");
    } catch (error) {
      if (error instanceof CanceledError) {
        expect(error.name).toBe("CanceledError");
        return;
      }

      throw new Error("Controller not throw CanceledError");
    }
  });

  test("Throw an CanceledError when signal timout is set", async () => {
    try {
      await unreadyAxios(undefined, 100).request({
        method: "GET",
        signal: AbortSignal.timeout(50),
      });

      throw new Error("Controller not aborted");
    } catch (error) {
      if (error! instanceof CanceledError) {
        expect(error.name).toBe("CanceledError");
        return;
      }

      throw new Error("Controller not throw CanceledError");
    }
  });
});
