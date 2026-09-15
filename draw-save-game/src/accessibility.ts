export const ACCESSIBILITY_STORAGE_KEY = 'draw-save-game.accessibility.v1';

export type AccessibilitySettings = { reducedMotion: boolean; highContrast: boolean; largeText: boolean };
type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = { reducedMotion: false, highContrast: false, largeText: false };

export function loadAccessibilitySettings(storage: StorageLike | undefined = typeof localStorage === 'undefined' ? undefined : localStorage): AccessibilitySettings {
  if (!storage) return { ...DEFAULT_ACCESSIBILITY_SETTINGS };
  try {
    const parsed = JSON.parse(storage.getItem(ACCESSIBILITY_STORAGE_KEY) ?? '{}') as Partial<AccessibilitySettings>;
    return {
      reducedMotion: typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : false,
      highContrast: typeof parsed.highContrast === 'boolean' ? parsed.highContrast : false,
      largeText: typeof parsed.largeText === 'boolean' ? parsed.largeText : false
    };
  } catch { return { ...DEFAULT_ACCESSIBILITY_SETTINGS }; }
}

export function saveAccessibilitySettings(settings: AccessibilitySettings, storage: StorageLike | undefined = typeof localStorage === 'undefined' ? undefined : localStorage): void {
  if (!storage) return;
  try { storage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settings)); } catch { /* optional preference persistence */ }
}

export function applyAccessibilitySettings(settings: AccessibilitySettings): void {
  const root = document.documentElement;
  root.dataset.reducedMotion = String(settings.reducedMotion);
  root.dataset.highContrast = String(settings.highContrast);
  root.dataset.largeText = String(settings.largeText);
}

function ensureAccessibilityStyles(): void {
  if (document.getElementById('accessibility-runtime-styles')) return;
  const style = document.createElement('style');
  style.id = 'accessibility-runtime-styles';
  style.textContent = `
    :focus-visible { outline: 3px solid #f8fafc !important; outline-offset: 3px; }
    html[data-reduced-motion="true"] *, html[data-reduced-motion="true"] *::before, html[data-reduced-motion="true"] *::after { scroll-behavior: auto !important; animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
    html[data-high-contrast="true"] .level-select, html[data-high-contrast="true"] .feedback-settings, html[data-high-contrast="true"] .accessibility-settings, html[data-high-contrast="true"] .result-panel__card { border: 3px solid #fff !important; background: #000 !important; }
    html[data-high-contrast="true"] .level-select__level { border: 2px solid #fff !important; background: #000 !important; }
    html[data-high-contrast="true"] .level-select__level:disabled { opacity: 1 !important; border-style: dashed !important; color: #ddd !important; }
    html[data-high-contrast="true"] .level-select__stars { color: #fff !important; text-decoration: underline; }
    html[data-large-text="true"] .level-select, html[data-large-text="true"] .feedback-settings, html[data-large-text="true"] .accessibility-settings, html[data-large-text="true"] .result-panel { font-size: 1.2rem; }
    html[data-large-text="true"] .level-select__name, html[data-large-text="true"] .level-select__stars, html[data-large-text="true"] .level-select__tutorial p, html[data-large-text="true"] .level-select__active-hint p, html[data-large-text="true"] .feedback-settings label, html[data-large-text="true"] .accessibility-settings label { font-size: .9rem !important; }
    html[data-large-text="true"] button, html[data-large-text="true"] summary { min-height: 44px; }
    .accessibility-settings { position: fixed; z-index: 19; right: max(10px, env(safe-area-inset-right)); bottom: max(10px, env(safe-area-inset-bottom)); width: min(230px, calc(100vw - 20px)); border: 1px solid #475569; border-radius: 12px; padding: 8px 10px; background: rgba(15,23,42,.94); color: #e2e8f0; touch-action: auto; }
    .accessibility-settings summary { cursor: pointer; font-size: 12px; font-weight: 800; }
    .accessibility-settings label { display: block; margin-top: 8px; font-size: 12px; }
    .accessibility-settings p { margin: 8px 0 0; color: #cbd5e1; font-size: 10px; line-height: 1.35; }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; } }
    @media (max-width: 820px) { .accessibility-settings { right: 8px; bottom: max(8px, env(safe-area-inset-bottom)); max-width: 205px; } }
  `;
  document.head.append(style);
}

export function mountAccessibilitySettings(): void {
  ensureAccessibilityStyles();
  applyAccessibilitySettings(loadAccessibilitySettings());
  if (document.getElementById('accessibility-settings')) return;
  const details = document.createElement('details');
  details.id = 'accessibility-settings';
  details.className = 'accessibility-settings';
  details.innerHTML = '<summary>無障礙顯示</summary><label><input type="checkbox" data-accessibility="reducedMotion"> 減少動態效果</label><label><input type="checkbox" data-accessibility="highContrast"> 高對比／強化邊界</label><label><input type="checkbox" data-accessibility="largeText"> 放大文字與操作區</label><p>高對比模式會強化鎖定、焦點與結果邊界，不只依賴顏色辨識。</p>';
  const current = loadAccessibilitySettings();
  const reducedMotion = details.querySelector<HTMLInputElement>('[data-accessibility="reducedMotion"]')!;
  const highContrast = details.querySelector<HTMLInputElement>('[data-accessibility="highContrast"]')!;
  const largeText = details.querySelector<HTMLInputElement>('[data-accessibility="largeText"]')!;
  reducedMotion.checked = current.reducedMotion;
  highContrast.checked = current.highContrast;
  largeText.checked = current.largeText;
  const persist = () => {
    const settings = { reducedMotion: reducedMotion.checked, highContrast: highContrast.checked, largeText: largeText.checked };
    saveAccessibilitySettings(settings);
    applyAccessibilitySettings(settings);
  };
  reducedMotion.addEventListener('change', persist);
  highContrast.addEventListener('change', persist);
  largeText.addEventListener('change', persist);
  document.body.append(details);
}
