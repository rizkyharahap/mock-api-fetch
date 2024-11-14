import { mockFetch } from ".";

describe("Mock Fetch", () => {
  test("Return success value", async () => {
    const successData = { data: { id: 1, name: "Test" } };

    const response = await mockFetch(
      "mock-url",
      { method: "GET" },
      {
        success: successData,
      }
    );

    expect(response.url).toBe("mock-url");
    expect(response.ok).toBeTruthy();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(successData);
  });

  test("Return success value with custom status", async () => {
    const successData = { data: { id: 1, name: "Test" } };

    const response = await mockFetch(
      "mock-url",
      { method: "GET" },
      {
        success: successData,
        status: 201,
      }
    );

    expect(response.status).toBe(201);
  });

  test("Return error", async () => {
    const successData = { data: { id: 1, name: "Test" } };
    const errorData = { error: "Oops something when wrong !", code: 400 };

    const response = await mockFetch(
      "mock-url",
      { method: "GET" },
      {
        success: successData,
        error: errorData,
        status: 400,
      }
    );

    expect(response.status).toBe(400);
    expect(response.ok).toBeFalsy();
    expect(await response.json()).toEqual(errorData);
  });
});
