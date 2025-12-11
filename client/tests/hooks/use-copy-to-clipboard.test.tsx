import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCopyToClipboard } from '../../src/hooks/use-copy-to-clipboard';

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(),
      },
      writable: true,
      configurable: true,
    });
    vi.clearAllMocks();
  });

  it('debe copiar texto al portapapeles exitosamente', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() =>
      useCopyToClipboard({ text: 'test text' })
    );

    expect(result.current.isCopied).toBe(false);

    await act(async () => {
      result.current.handleCopy();
    });

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('test text');
      expect(result.current.isCopied).toBe(true);
    });
  });

  it('debe mostrar mensaje personalizado al copiar', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    const { toast } = await import('sonner');

    const { result } = renderHook(() =>
      useCopyToClipboard({ text: 'test', copyMessage: 'Custom message' })
    );

    await act(async () => {
      result.current.handleCopy();
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Custom message');
    });
  });

  it('debe manejar error al copiar', async () => {
    const mockWriteText = vi.fn().mockRejectedValue(new Error('Failed'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    const { toast } = await import('sonner');

    const { result } = renderHook(() =>
      useCopyToClipboard({ text: 'test' })
    );

    await act(async () => {
      result.current.handleCopy();
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to copy to clipboard.');
      expect(result.current.isCopied).toBe(false);
    });
  });
});
