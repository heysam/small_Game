import { describe, expect, it } from 'vitest';
import indexHtml from '../index.html?raw';
import { createUseItemDetail } from './game/itemEvent';

describe('shield item dock markup', () => {
  it('exposes a dedicated shield control without replacing ink refill', () => {
    expect(indexHtml).toContain('id="item-ink-refill"');
    expect(indexHtml).toContain('id="item-shield"');
    expect(indexHtml).toContain('護盾 ×0');
  });
});

describe('shared item activation event contract', () => {
  it('creates the shield use-item detail without requiring a browser DOM', () => {
    expect(createUseItemDetail('shield')).toEqual({ itemId: 'shield' });
  });

  it('keeps the existing ink-refill detail on the same contract', () => {
    expect(createUseItemDetail('ink-refill')).toEqual({ itemId: 'ink-refill' });
  });
});
