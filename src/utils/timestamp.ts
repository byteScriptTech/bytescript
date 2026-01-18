/**
 * Safely converts various timestamp formats to ISO string
 * @param value - The timestamp value (Firestore timestamp, Date, string, or null/undefined)
 * @returns ISO string representation of the timestamp
 */
export const toISOString = (value: any): string => {
  if (!value) return new Date().toISOString();

  // If it's a Firestore timestamp with toDate method
  if (typeof value?.toDate === 'function') {
    return value.toDate().toISOString();
  }

  // If it's already a Date object
  if (value instanceof Date) {
    return value.toISOString();
  }

  // If it's already a string, return as is
  if (typeof value === 'string') {
    return value;
  }

  // Fallback to current date
  return new Date().toISOString();
};
