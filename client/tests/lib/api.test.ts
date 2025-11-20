import { describe, it, expect, beforeEach, vi } from "vitest";
import { AxiosError } from "axios";
import { apiErrorMessage } from "@/lib/api";

vi.mock("axios", () => {
  const mockIsAxiosError = vi.fn();
  return {
    default: {
      create: vi.fn(() => ({
        post: vi.fn(),
        defaults: {
          headers: {
            common: {},
          },
        },
      })),
      isAxiosError: mockIsAxiosError,
    },
    isAxiosError: mockIsAxiosError,
  };
});

describe("api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("apiErrorMessage", () => {
    it("returns offline message when there is no response", async () => {
      const axiosError = {
        isAxiosError: true,
        message: "Network Error",
        response: undefined,
      } as AxiosError;

      const axios = await import("axios");
      vi.mocked(axios.isAxiosError).mockReturnValue(true);

      expect(apiErrorMessage(axiosError)).toBe("Sin conexión con el servidor.");
    });

    it("prefers `error` field from server payload", async () => {
      const error = {
        isAxiosError: true,
        message: "Request failed",
        response: {
          status: 400,
          data: { error: "Bad request" },
        },
      } as AxiosError;

      const axios = await import("axios");
      vi.mocked(axios.isAxiosError).mockReturnValue(true);

      expect(apiErrorMessage(error)).toBe("Bad request");
    });

    it("falls back to `message` field when `error` is absent", async () => {
      const error = {
        isAxiosError: true,
        message: "Request failed",
        response: {
          status: 404,
          data: { message: "Not found" },
        },
      } as AxiosError;
      const axios = await import("axios");
      vi.mocked(axios.isAxiosError).mockReturnValue(true);

      expect(apiErrorMessage(error)).toBe("Not found");
    });

    it("returns string payloads directly", async () => {
      const error = {
        isAxiosError: true,
        message: "Request failed",
        response: {
          status: 500,
          data: "Server exploded",
        },
      } as AxiosError;
      const axios = await import("axios");
      vi.mocked(axios.isAxiosError).mockReturnValue(true);

      expect(apiErrorMessage(error)).toBe("Server exploded");
    });

    it("handles non-Axios errors", async () => {
      const axios = await import("axios");
      vi.mocked(axios.isAxiosError).mockReturnValue(false);

      expect(apiErrorMessage(new Error("Boom"))).toBe("Boom");
      expect(apiErrorMessage("string error")).toBe("Error desconocido");
    });
  });
});
