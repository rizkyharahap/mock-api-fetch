# unready-fetch

**A lightweight library for mocking API calls in JavaScript and TypeScript. Good for simulating asynchronous fetch requests before the real API is available.**

---

## 📖 Overview

`unready-fetch` is a utility designed to help developers simulate API calls using the native `fetch` API interface. This is especially useful during the early stages of development when the actual API endpoints are not yet ready. The library allows you to define mock responses, control HTTP status codes, and simulate network delays, making it ideal for prototyping and testing.

With `unready-fetch`, you can seamlessly switch to the real `fetch` implementation once your backend services are up and running, by simply replacing the function call. It ensures that your frontend development progresses smoothly without being blocked by unimplemented APIs.

---

## 🌟 Features

- **Mock API Responses**: Easily simulate both success and error responses.
- **Customizable Delays**: Set a timeout to mimic network latency.
- **Flexible Mocking**: Define custom status codes, error messages, and data payloads.
- **Promise-based**: Works just like the native `fetch` API, supporting `async/await`.
- **TypeScript Support**: Built with TypeScript for type safety and better autocompletion.

---

## 📦 Installation

To use `unready-fetch`, you can install it via npm:

```bash
npm install unready-fetch
```

Or with yarn:

```bash
yarn add unready-fetch
```

Or with pnpm:

```bash
pnpm i unready-fetch
```

---

## 🚀 Usage

### Basic Example

Here's how to use `unready-fetch` to simulate an API call:

```typescript
import { unreadyFetch } from "unready-fetch";

const mockData = {
  success: {
    message: "Data fetched successfully!",
    items: [{ id: 1, name: "Sample Item" }],
  },
  status: 200,
};

async function fetchData() {
  const response = await unreadyFetch(
    "https://api.example.com/data",
    { method: "GET" },
    mockData,
    500
  );

  if (response.ok) {
    const data = await response.json();
    console.log("Success:", data);
  } else {
    console.error("Error:", await response.json());
  }
}

fetchData();
```

### API Contract

#### `unreadyFetch(input, init?, mock?, timeout?)`

- **`input`** (`RequestInfo | URL`): The resource you wish to fetch. This can be a URL string or a `Request` object.
- **`init`** (`RequestInit`): Optional configuration object for the fetch request (e.g., `method`, `headers`, `body`).
- **`mock`** (`MockData`): Optional mock data to simulate an API response.
- **`timeout`** (`number`): Time in milliseconds to delay the response. Default is `1000ms`.

Returns: A `Promise` that resolves to a `MockResponse` object.

---

## 🔍 Interfaces

### `MockData`

```typescript
export interface MockData {
  success?: any; // Mocked successful response data
  error?: any; // Mocked error response data
  status?: number; // HTTP status code (e.g., 200, 404, 500)
}
```

### `MockResponse`

```typescript
export interface MockResponse {
  url: string;
  ok: boolean;
  status: number;
  json(): Promise<any>;
  text(): Promise<string>;
}
```

---

## 📄 Full Example with Error Handling

```typescript
import { unreadyFetch } from "unready-fetch";

const errorMock = {
  error: {
    message: "Something went wrong!",
  },
  status: 404,
};

async function fetchWithError() {
  const response = await unreadyFetch(
    "https://api.example.com/error",
    {},
    errorMock,
    800
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("API Error:", error);
  }
}

fetchWithError();
```

---

## ⚙️ How It Works

The `unreadyFetch` function simulates a fetch request by returning a promise that resolves after a specified timeout. Depending on the provided mock data, it can return either a successful response or an error response, based on the HTTP status code.

1. **Customizable Mock Data**: Use the `mock` parameter to define success or error responses.
2. **Network Delay Simulation**: Control the timeout to simulate network latency, helping you test loading states and error handling.

---

## 📚 Documentation

### Function Signature

```typescript
/**
 * Simulates an API call using fetch-like behavior with mock data.
 *
 * @param {RequestInfo | URL} input - The URL or Request object to fetch.
 * @param {RequestInit} [init] - Optional fetch configurations like method, headers, etc.
 * @param {MockData} [mock] - Mock data for simulating the response.
 * @param {number} [timeout=1000] - Delay in milliseconds before resolving the response.
 * @returns {Promise<MockResponse>} - A promise resolving to a MockResponse object.
 */
export function unreadyFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  mock?: MockData,
  timeout: number = 1000
): Promise<MockResponse> { ... }
```

---

## 📝 Notes

- Use this utility during development and testing phases.
- Once the real API is available, replace `unreadyFetch` with the standard `fetch` function.
- TypeScript support ensures that you have type safety while using this library.

---

## 📌 License

MIT License.

Feel free to contribute or raise issues on the [GitHub repository](https://github.com/rizkyharahap/unready-fetch).

---

This documentation provides a comprehensive guide on how to use the `unready-fetch` library. Let me know if you need additional details or examples!
