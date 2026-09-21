import { describe, expect, it } from 'vitest';
import indexHtml from '../index.html?raw';

describe('shield item dock markup', () => {
  it('exposes a dedicated shield control without replacing ink refill', () => {
    expect(indexHtml).toContain('id="item-ink-refill"');
    expect(indexHtml).toContain('id="item-shield"');
    expect(indexHtml).toContain('護盾 ×0');
  });
});
