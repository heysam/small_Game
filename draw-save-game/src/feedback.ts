export const FEEDBACK_STORAGE_KEY = 'draw-save-game.feedback.v1';

export type FeedbackSettings = { sound: boolean; vibration: boolean };
type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export const DEFAULT_FEEDBACK_SETTINGS: FeedbackSettings = { sound: true, vibration: true };

export function loadFeedbackSettings(storage: StorageLike | undefined = typeof localStorage === 'undefined' ? undefined : localStorage): FeedbackSettings {
  if (!storage) return { ...DEFAULT_FEEDBACK_SETTINGS };
  try {
    const parsed = JSON.parse(storage.getItem(FEEDBACK_STORAGE_KEY) ?? '{}') as Partial<FeedbackSettings>;
    return {
      sound: typeof parsed.sound === 'boolean' ? parsed.sound : DEFAULT_FEEDBACK_SETTINGS.sound,
      vibration: typeof parsed.vibration === 'boolean' ? parsed.vibration : DEFAULT_FEEDBACK_SETTINGS.vibration
    };
  } catch {
    return { ...DEFAULT_FEEDBACK_SETTINGS };
  }
}

export function saveFeedbackSettings(settings: FeedbackSettings, storage: StorageLike | undefined = typeof localStorage === 'undefined' ? undefined : localStorage): void {
  if (!storage) return;
  try { storage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(settings)); } catch { /* restricted storage: keep runtime usable */ }
}

function tone(frequency: number, durationMs: number): void {
  const AudioContextCtor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;
  try {
    const context = new AudioContextCtor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.045, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + durationMs / 1000);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + durationMs / 1000);
    oscillator.addEventListener('ended', () => void context.close(), { once: true });
  } catch { /* feedback is optional */ }
}

export function emitResultFeedback(won: boolean): void {
  const settings = loadFeedbackSettings();
  if (settings.sound) tone(won ? 660 : 180, won ? 180 : 260);
  if (settings.vibration && 'vibrate' in navigator) {
    try { navigator.vibrate(won ? [35, 35, 55] : [90, 45, 90]); } catch { /* unsupported/blocked */ }
  }
}

export function mountFeedbackSettings(): void {
  if (document.getElementById('feedback-settings')) return;
  const details = document.createElement('details');
  details.id = 'feedback-settings';
  details.className = 'feedback-settings';
  details.innerHTML = '<summary>聲音與震動</summary><label><input type="checkbox" data-feedback="sound"> 音效</label><label><input type="checkbox" data-feedback="vibration"> 震動回饋</label><p>裝置或瀏覽器不支援震動時會自動略過。</p>';
  const current = loadFeedbackSettings();
  const sound = details.querySelector<HTMLInputElement>('[data-feedback="sound"]')!;
  const vibration = details.querySelector<HTMLInputElement>('[data-feedback="vibration"]')!;
  sound.checked = current.sound;
  vibration.checked = current.vibration;
  const persist = () => saveFeedbackSettings({ sound: sound.checked, vibration: vibration.checked });
  sound.addEventListener('change', persist);
  vibration.addEventListener('change', persist);
  document.body.append(details);
}
