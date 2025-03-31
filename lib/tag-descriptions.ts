// Map of tag names to their descriptions
export const tagDescriptions: Record<string, string> = {
  "executive-order":
    "Official presidential directives that have the force of law without requiring congressional approval.",
  misc: "Presidential orders that resist categorization",
  // Add more tag descriptions as needed
}

// Function to get a description for a tag, with fallback for unknown tags
export function getTagDescription(tag: string): string {
  return tagDescriptions[tag] || `Presidential orders related to ${tag}.`
}

