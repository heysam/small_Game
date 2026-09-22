import { beforeEach, describe, expect, it, vi } from 'vitest';
import indexHtml from '../index.html?raw';

describe('shield item dock markup', () => {
  it('exposes a dedicated shield control without replacing ink refill', () => {
    expect(indexHtml).toContain('id="item-ink-refill"');
    expect(indexHtml).toContain('id="item-shield"');
    expect(indexHtml).toContain('護盾 ×0');
  });
});

describe('shield item dock activation event', () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    document.body.innerHTML = '<button id="item-ink-refill"></button><button id="item-shield"></button><p id="item-status"></p>';
  });

  it('dispatches the shared use-item event with the shield id', async () => {
    await import('./itemDock');
    const received = vi.fn();
    document.addEventListener('draw-save-game:use-item', received, { once: true });
    document.querySelector<HTMLButtonElement>('#item-shield')!.disabled = false;
    document.querySelector<HTMLButtonElement>('#item-shield')!.click();
    expect(received).toHaveBeenCalledOnce();
    expect((received.mock.calls[0][0] as CustomEvent).detail).toEqual({ itemId: 'shield' });
  });
});
