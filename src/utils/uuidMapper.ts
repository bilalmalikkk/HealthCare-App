/**
 * UUID Mapping Service
 * Automatically learns and caches UUID mappings from backend responses
 */

const STORAGE_KEY = 'patient_uuid_mappings';

interface UuidMapping {
  [patientId: number]: string;
}

/**
 * Get all cached UUID mappings from localStorage
 */
function getCachedMappings(): UuidMapping {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.warn('Failed to read UUID mappings from cache:', error);
  }
  return {};
}

/**
 * Save UUID mappings to localStorage
 */
function saveMappings(mappings: UuidMapping): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
  } catch (error) {
    console.warn('Failed to save UUID mappings to cache:', error);
  }
}

/**
 * Get UUID for a patient ID
 * First checks cache, then returns null if not found
 */
export function getPatientUuid(patientId: number): string | null {
  const mappings = getCachedMappings();
  return mappings[patientId] || null;
}

/**
 * Store a UUID mapping for a patient ID
 * This is called automatically when we successfully fetch user data
 */
export function setPatientUuid(patientId: number, uuid: string): void {
  const mappings = getCachedMappings();
  mappings[patientId] = uuid;
  saveMappings(mappings);
}

/**
 * Clear all cached mappings (useful for debugging)
 */
export function clearMappings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear UUID mappings:', error);
  }
}

/**
 * Get all cached mappings (for debugging)
 */
export function getAllMappings(): UuidMapping {
  return getCachedMappings();
}

/**
 * Set multiple UUID mappings at once
 * Useful for initial setup: setPatientUuids({1: 'uuid1', 2: 'uuid2', ...})
 */
export function setPatientUuids(mappings: UuidMapping): void {
  const existing = getCachedMappings();
  const updated = { ...existing, ...mappings };
  saveMappings(updated);
}

// Expose to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).uuidMapper = {
    set: setPatientUuid,
    setMultiple: setPatientUuids,
    get: getPatientUuid,
    getAll: getAllMappings,
    clear: clearMappings,
  };
}

