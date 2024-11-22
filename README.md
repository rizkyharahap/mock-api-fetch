---
# **unready-fetch**

**A lightweight library for mocking API calls in JavaScript and TypeScript. Good for simulating asynchronous fetch requests before the real API is available.**

---

## 📖 Overview

`unready-fetch` is a utility designed to simulate API calls using the `fetch` API interface during development. It allows you to:

- Mock API responses.
- Control HTTP status codes.
- Simulate network delays.

The library is ideal for prototyping and testing while backend services are under development. Once the real API is available, you can seamlessly switch to `fetch`.

---

## 🌟 Features

- **Mock API Responses**: Simulate both success and error responses.
- **Customizable Delays**: Set a timeout to mimic network latency.
- **Flexible Mocking**: Define custom status codes, error messages, and data payloads.
- **Abort Support**: Automatically reject the request if the `AbortSignal` is triggered.
- **TypeScript Support**: Built with TypeScript for type safety and better autocompletion.

---

## 📦 Installation

Install the package via npm, yarn, or pnpm:

```bash
npm install unready-fetch
yarn add unready-fetch
pnpm i unready-fetch
```

---

## 🚀 Usage

### **Basic Example**

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
  const response = await unreadyFetch(mockData)(
    "https://api.example.com/data",
    {
      method: "GET",
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log("Success:", data);
  } else {
    const error = await response.json();
    console.error("Error:", error);
  }
}

fetchData();
```

---

### API Contract

#### `unreadyFetch(mock?, timeout?)`

- **`mock`** (`MockData`): Optional mock data for simulating the API response. Defaults to a pre-defined mock success or error response.
- **`timeout`** (`number`): Time in milliseconds to delay the response. Default is `1000ms`.

Returns: A function that simulates a `fetch` request, accepting `input` and `init` as arguments.

#### MockFetch Function

- **`input`** (`RequestInfo | URL`): The URL or `Request` object to fetch.
- **`init`** (`RequestInit`): Optional configuration object for the request (e.g., method, headers, body).

Returns: A `Promise` resolving to a `MockResponse` object.

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
  url: string; // Requested URL
  ok: boolean; // Whether the response is successful
  status: number; // HTTP status code
  json(): Promise<any>; // Returns the response body as JSON
  text(): Promise<string>; // Returns the response body as a string
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
  try {
    const response = await unreadyFetch(errorMock, 800)(
      "https://api.example.com/error",
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("API Error:", error);
    }
  } catch (err) {
    console.error("Request Aborted:", err);
  }
}

fetchWithError();
```

---

## ⚙️ How It Works

The `unreadyFetch` function simulates a `fetch` request by returning a function that behaves like `fetch`. It:

- Uses the provided `mock` data to determine whether the response is a success or error.
- Delays the response by the specified `timeout` to simulate network latency.
- Supports `AbortController` to allow early termination of the request.

---

## 📝 Notes

- Use this library during development and testing only.
- When the API is ready, replace `unreadyFetch` with the native `fetch` API.

---

Let me know if you need further refinements!
