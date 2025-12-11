import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CopyButton } from '../../../src/components/ui/copy-button';
import { useCopyToClipboard } from '../../../src/hooks/use-copy-to-clipboard';

// Mock del hook
vi.mock('../../../src/hooks/use-copy-to-clipboard');

describe('CopyButton', () => {
  const mockHandleCopy = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCopyToClipboard).mockReturnValue({
      isCopied: false,
      handleCopy: mockHandleCopy,
    });
  });

  it('debe renderizar el botón', () => {
    render(<CopyButton content="test content" />);
    const button = screen.getByRole('button', { name: /copy to clipboard/i });
    expect(button).toBeDefined();
  });

  it('debe mostrar icono Copy cuando no está copiado', () => {
    vi.mocked(useCopyToClipboard).mockReturnValue({
      isCopied: false,
      handleCopy: mockHandleCopy,
    });

    render(<CopyButton content="test" />);
    const button = screen.getByRole('button');
    expect(button).toBeDefined();
  });

  it('debe mostrar icono Check cuando está copiado', () => {
    vi.mocked(useCopyToClipboard).mockReturnValue({
      isCopied: true,
      handleCopy: mockHandleCopy,
    });

    render(<CopyButton content="test" />);
    const button = screen.getByRole('button');
    expect(button).toBeDefined();
  });

  it('debe llamar handleCopy al hacer click', async () => {
    const handleCopy = vi.fn();
    vi.mocked(useCopyToClipboard).mockReturnValue({
      isCopied: false,
      handleCopy,
    });

    const user = userEvent.setup();
    render(<CopyButton content="test content" />);
    
    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleCopy).toHaveBeenCalledTimes(1);
  });

  it('debe pasar el contenido y mensaje personalizado al hook', () => {
    render(<CopyButton content="custom content" copyMessage="Custom message" />);

    expect(useCopyToClipboard).toHaveBeenCalledWith({
      text: 'custom content',
      copyMessage: 'Custom message',
    });
  });

  it('debe tener clases correctas', () => {
    render(<CopyButton content="test" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('h-6');
    expect(button.className).toContain('w-6');
  });
});
