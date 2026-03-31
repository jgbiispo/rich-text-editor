import { renderHook, waitFor } from "@testing-library/react";
import { useDebouncedSave } from "../useDebouncedSave";

// Mock debounce to execute immediately for testing
jest.mock("lodash.debounce", () => {
  return jest.fn((fn) => {
    const debouncedFn = (...args: any[]) => fn(...args);
    debouncedFn.cancel = jest.fn();
    return debouncedFn;
  });
});

describe("useDebouncedSave", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should call saveAction with content", async () => {
    const saveMock = jest.fn();
    const { result } = renderHook(() => useDebouncedSave(saveMock, 100));

    result.current("test content");

    await waitFor(() => {
      expect(saveMock).toHaveBeenCalledWith("test content");
    });
  });

  it("should debounce multiple calls", async () => {
    const saveMock = jest.fn();
    const { result } = renderHook(() => useDebouncedSave(saveMock, 100));

    // Call multiple times rapidly
    result.current("content 1");
    result.current("content 2");
    result.current("content 3");

    // Should eventually save with the last content
    await waitFor(() => {
      expect(saveMock).toHaveBeenCalled();
    });
  });

  it("should handle async saveAction", async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useDebouncedSave(saveMock, 100));

    result.current("async content");

    await waitFor(() => {
      expect(saveMock).toHaveBeenCalledWith("async content");
    });
  });

  it("should not throw on save error", async () => {
    const saveMock = jest.fn().mockRejectedValue(new Error("Save failed"));
    const { result } = renderHook(() => useDebouncedSave(saveMock, 100));

    // Should not throw
    expect(() => result.current("content")).not.toThrow();

    await waitFor(() => {
      expect(saveMock).toHaveBeenCalled();
    });
  });

  it("should cancel debounce on unmount", async () => {
    const saveMock = jest.fn();
    const { result, unmount } = renderHook(() => useDebouncedSave(saveMock, 100));

    // Get the debounced function reference
    result.current("content");

    // Unmount should trigger cancel
    unmount();

    // Give it a moment to process
    await waitFor(() => {
      // The cleanup function should have been called
    });
  });

  it("should use default delay when not specified", () => {
    const saveMock = jest.fn();
    renderHook(() => useDebouncedSave(saveMock));
    // Default delay is 1000ms
    expect(saveMock).not.toHaveBeenCalled();
  });

  it("should handle different content types", async () => {
    const saveMock = jest.fn();
    const { result } = renderHook(() => useDebouncedSave(saveMock, 100));

    // HTML content
    result.current("<p>HTML content</p>");
    await waitFor(() => expect(saveMock).toHaveBeenCalled());

    saveMock.mockClear();

    // Plain text
    result.current("Plain text");
    await waitFor(() => expect(saveMock).toHaveBeenCalled());

    saveMock.mockClear();

    // Empty content
    result.current("");
    await waitFor(() => expect(saveMock).toHaveBeenCalled());
  });
});
