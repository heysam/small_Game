import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('shield item dock markup', () => {
  it('exposes a dedicated shield control without replacing ink refill', () => {
    const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
    expect(html).toContain('id="item-ink-refill"');
    expect(html).toContain('id="item-shield"');
    expect(html).toContain('護盾 ×0');
  });
});
