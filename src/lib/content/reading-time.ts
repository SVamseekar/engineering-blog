const WPM = 220;

export function computeReadingTime(text: string): {
  minutes: number;
  words: number;
} {
  const words = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`\[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / WPM));
  return { minutes, words };
}
