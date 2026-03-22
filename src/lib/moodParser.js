const VALID_MOODS = ["happy", "sad", "angry", "shy", "flustered", "loving", "worried"];

/**
 * Parses the AI response to extract the mood tag and clean text.
 * Expected format: [mood: x] (action) *thought* "dialog"
 *
 * @param {string} raw - Raw response string from OpenAI
 * @param {string} defaultMood - Fallback mood if none found
 * @returns {{ mood: string, text: string }}
 */
export function parseMood(raw, defaultMood = "happy") {
  if (!raw || typeof raw !== "string") {
    return { mood: defaultMood, text: "" };
  }

  const trimmed = raw.trim();

  // Match [mood: x] at the start of the string (case-insensitive)
  const moodMatch = trimmed.match(/^\[mood:\s*([a-z]+)\]/i);

  if (moodMatch) {
    const extracted = moodMatch[1].toLowerCase();
    const mood = VALID_MOODS.includes(extracted) ? extracted : defaultMood;
    // Remove the mood tag from the displayed text
    const text = trimmed.slice(moodMatch[0].length).trim();
    return { mood, text };
  }

  // No mood tag found — return full text with default mood
  return { mood: defaultMood, text: trimmed };
}
