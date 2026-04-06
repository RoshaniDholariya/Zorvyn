const CATEGORY_KEY_PREFIX = "zorvyn_categories_v2";

const defaults = {
  INCOME: ["Salary", "Freelance", "Bonus", "Investments"],
  EXPENSE: ["Rent", "Groceries", "Transport", "Utilities", "Dining"],
};

const normalizeCategoryStore = (store) => {
  const safe = { INCOME: [], EXPENSE: [] };
  ["INCOME", "EXPENSE"].forEach((type) => {
    const list = Array.isArray(store?.[type]) ? store[type] : [];
    safe[type] = Array.from(new Set(list.map((item) => String(item).trim()).filter(Boolean))).slice(0, 100);
  });
  return safe;
};

const getCategoryKey = (scopeKey) => `${CATEGORY_KEY_PREFIX}_${scopeKey || "guest"}`;

export const loadCategories = (scopeKey) => {
  try {
    const raw = localStorage.getItem(getCategoryKey(scopeKey));
    if (!raw) return defaults;
    return { ...defaults, ...normalizeCategoryStore(JSON.parse(raw)) };
  } catch {
    return defaults;
  }
};

export const saveCategories = (categories, scopeKey) => {
  const normalized = normalizeCategoryStore(categories);
  localStorage.setItem(getCategoryKey(scopeKey), JSON.stringify(normalized));
  return normalized;
};

export const addCategory = (categories, type, categoryName) => {
  const name = String(categoryName || "").trim();
  if (!name) return categories;
  const normalized = normalizeCategoryStore(categories);
  if (!normalized[type]) return normalized;
  if (!normalized[type].includes(name)) {
    normalized[type] = [name, ...normalized[type]].slice(0, 100);
  }
  return normalized;
};

export const removeCategory = (categories, type, categoryName) => {
  const normalized = normalizeCategoryStore(categories);
  if (!normalized[type]) return normalized;
  normalized[type] = normalized[type].filter((item) => item !== categoryName);
  return normalized;
};
