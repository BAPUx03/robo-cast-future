const CAREER_TEXT_FIELDS = [
  { key: "title", label: "Vacancy name", maxLength: 160 },
  { key: "qualification", label: "Educational qualification", maxLength: 300 },
  { key: "experience", label: "Required experience", maxLength: 160 },
] as const;

export function validateCareerDraft(
  draft: Record<string, unknown>,
): { value: Record<string, unknown>; error: null } | { value: null; error: string } {
  const value = { ...draft };

  for (const field of CAREER_TEXT_FIELDS) {
    const text = String(value[field.key] ?? "").trim();
    if (!text) return { value: null, error: `${field.label} is required.` };
    if (text.length > field.maxLength) {
      return {
        value: null,
        error: `${field.label} must be ${field.maxLength} characters or fewer.`,
      };
    }
    value[field.key] = text;
  }

  const openings = Number(value["openings"]);
  if (!Number.isSafeInteger(openings) || openings < 1) {
    return { value: null, error: "No. of vacancies must be a whole number greater than zero." };
  }
  value["openings"] = openings;

  return { value, error: null };
}
