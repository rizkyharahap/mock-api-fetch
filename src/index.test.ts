import { unreadyFetch } from ".";

describe("Not Ready Fetch", () => {
  test("Return success value", async () => {
    const response = await unreadyFetch("mock-url", { method: "GET" });

    expect(response.url).toBe("mock-url");
    expect(response.ok).toBeTruthy();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: "success",
      code: 200,
      data: {
        id: 123,
        name: "Sample Data",
      },
      errors: null,
    });
  });

  test("Return success value with custom success data", async () => {
    const successData = { data: { id: 1, name: "Test" } };

    const response = await unreadyFetch(
      "mock-url",
      { method: "GET" },
      {
        success: successData,
      }
    );

    expect(await response.json()).toEqual(successData);
  });

  test("Return success value with custom status", async () => {
    const successData = { data: { id: 1, name: "Test" } };

    const response = await unreadyFetch(
      "mock-url",
      { method: "GET" },
      {
        success: successData,
        status: 201,
      }
    );

    expect(response.status).toBe(201);
  });

  test("Return error if set http status larger or equeal 400", async () => {
    const response = await unreadyFetch(
      "mock-url",
      { method: "GET" },
      {
        status: 400,
      }
    );

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
    expect(await response.json()).toEqual({
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
  });

  test("Return error if only asigned error", async () => {
    const errorData = { error: "Oops something when wrong !", code: 400 };

    const response = await unreadyFetch(
      "mock-url",
      { method: "GET" },
      {
        error: errorData,
      }
    );

    expect(await response.json()).toEqual(errorData);
  });

  test("Return error with custom error data", async () => {
    const errorData = { error: "Oops something when wrong !", code: 400 };

    const response = await unreadyFetch(
      "mock-url",
      { method: "GET" },
      {
        error: errorData,
        status: 400,
      }
    );

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
    expect(await response.json()).toEqual(errorData);
  });
});
