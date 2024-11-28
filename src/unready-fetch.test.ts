import { unreadyFetch } from "./unready-fetch";

describe("unready-fetch", () => {
  test("Return success value", async () => {
    const response = await unreadyFetch()("mock-url", {
      method: "GET",
    });

    expect(response.url).toBe("mock-url");
    expect(response.ok).toBeTruthy();
    expect(response.status).toBe(200);
    expect(await response.json()).toStrictEqual({
      status: "success",
      code: 200,
      data: {
        id: 123,
        name: "Sample Data",
      },
      errors: null,
    });
    expect(await response.text()).toBe(
      '{"status":"success","code":200,"data":{"id":123,"name":"Sample Data"},"errors":null}'
    );
  });

  test("Return success value with custom success data", async () => {
    const successData = { data: { id: 1, name: "Test" } };
    const errData = { data: { err: 1, name: "Test" } };

    const response = await unreadyFetch(
      {
        success: successData,
        error: errData,
      },
      10
    )("mock-url", { method: "GET" });

    const data = await response.json();

    data.data;

    expect(await response.json()).toStrictEqual(successData);
  });

  test("Return success value with custom status", async () => {
    const successData = { data: { id: 1, name: "Test" } };

    const response = await unreadyFetch(
      {
        success: successData,
        status: 201,
      },
      10
    )("mock-url", { method: "GET" });

    expect(response.status).toBe(201);
  });

  test("Return error if set http status larger or equal 400", async () => {
    const response = await unreadyFetch(
      {
        status: 400,
      },
      10
    )("mock-url", { method: "GET" });

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
    expect(await response.json()).toStrictEqual({
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
    expect(await response.text()).toStrictEqual(
      '{"status":"error","code":400,"data":null,"errors":[{"field":"email","message":"Email is required"}],"trace_id":"abc123xyz"}'
    );
  });

  test("Return error if only asigned error", async () => {
    const errorData = { error: "Oops something when wrong !", code: 400 };

    const response = await unreadyFetch(
      {
        error: errorData,
      },
      10
    )("mock-url", { method: "GET" });

    expect(await response.json()).toStrictEqual(errorData);
  });

  test("Return error with custom error data", async () => {
    const errorData = { error: "Oops something when wrong !", code: 400 };

    const response = await unreadyFetch(
      {
        error: errorData,
        status: 400,
      },
      10
    )("mock-url", { method: "GET" });

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
    expect(await response.json()).toStrictEqual(errorData);
  });
});

describe("unready-fetch with AbortController", () => {
  test("Throw an AbortError when controller is aborted", async () => {
    try {
      const controller = new AbortController();

      setTimeout(() => {
        controller.abort();
      }, 50);

      await unreadyFetch(undefined, 100)("mock-url", {
        method: "GET",
        signal: controller.signal,
      });

      throw new Error("Controller not aborted");
    } catch (error) {
      if (error instanceof DOMException) {
        expect(error.name).toBe("AbortError");
        return;
      }

      throw new Error("Controller not throw AbortError");
    }
  });

  test("Throw an AbortError with reason when controller is aborted with reason", async () => {
    try {
      const controller = new AbortController();

      setTimeout(() => {
        controller.abort("mock-reason");
      }, 50);

      await unreadyFetch(undefined, 100)("mock-url", {
        method: "GET",
        signal: controller.signal,
      });

      throw new Error("Controller not aborted");
    } catch (error) {
      expect(error).toBe("mock-reason");
    }
  });

  test("Throw an TimeoutError when signal timout is set", async () => {
    try {
      await unreadyFetch(undefined, 100)("mock-url", {
        method: "GET",
        signal: AbortSignal.timeout(50),
      });

      throw new Error("Controller not aborted");
    } catch (error) {
      if (error! instanceof DOMException) {
        expect(error.name).toBe("TimeoutError");
        return;
      }

      throw new Error("Controller not throw TimeoutError");
    }
  });
});
