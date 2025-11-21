/**
 * API utility for making HTTP requests to the backend
 */

// Get API base URL from environment variable or use default
function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (envUrl) {
    if (envUrl.startsWith('http://') || envUrl.startsWith('https://') || envUrl.startsWith('/')) {
      return envUrl;
    }
    return `http://${envUrl}`;
  }
  
  // In production (Vercel), use relative `/api` which is proxied to the backend
  if (import.meta.env.PROD) {
    return '/api';
  }
  
  // Default for local development
  return 'http://localhost:8000';
}

const API_BASE_URL = getApiBaseUrl();

type QueryParams = Record<string, string | number | boolean | null | undefined>;

function buildApiUrl(path: string, query?: QueryParams): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  let queryString = '';

  if (query) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    queryString = params.toString();
  }

  if (API_BASE_URL.startsWith('http://') || API_BASE_URL.startsWith('https://')) {
    // For absolute URLs, ensure /api prefix is included
    // Base URL might be: http://nordicmedtek3.vps.itpays.cloud:5001
    // Path might be: /v2/patients
    // Result should be: http://nordicmedtek3.vps.itpays.cloud:5001/api/v2/patients
    let base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    
    // Add /api if base URL doesn't already end with /api and path doesn't start with /api
    if (!base.endsWith('/api') && !normalizedPath.startsWith('/api')) {
      base = `${base}/api`;
    }
    
    const url = new URL(normalizedPath.replace(/^\//, ''), `${base}/`);
    if (queryString) {
      url.search = queryString;
    }
    return url.toString();
  }

  // For relative URLs (like /api for Vercel), just concatenate
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const url = `${base}${normalizedPath}`;
  return queryString ? `${url}?${queryString}` : url;
}

// Log the API base URL in development for debugging
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL);
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  roleId: string;
  orgId: string;
  stats: {
    // Vitals data stored in stats JSONB field - supports multiple field name variations
    heartRate?: number | null;
    respiratoryRate?: number | null;
    hr?: number | null;
    rr?: number | null;
    temperature?: number | null;
    temp?: number | null;
    bloodPressureSystolic?: number | null;
    bloodPressureDiastolic?: number | null;
    bp_systolic?: number | null;
    bp_diastolic?: number | null;
    blood_oxygen?: number | null;
    bloodOxygen?: number | null;
    spo2?: number | null;
    weight?: number | null;
    recordedAt?: string;
    recorded_at?: string;
    [key: string]: any;
  };
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface UserListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

// VitalsData interface using exact database field names from readings_vital table
// Database columns: hr, rr, fft, sv, hrv, bed_status, b2b, b2b1, b2b2, sig_strength, ts
// These are the actual values from the latest reading, not averages
export interface VitalsData {
  // Using exact database field names (from readings_vital table)
  hr: number | null;                  // Heart Rate (BPM) - actual value
  rr: number | null;                  // Respiratory Rate (breaths/min) - actual value
  fft: number | null;                 // Temperature (°F) - actual value
  sv: number | null;                  // Stroke Volume - actual value
  hrv: number | null;                 // Heart Rate Variability - actual value
  bed_status: number | null;          // Bed Status - actual value
  b2b: number | null;                // B2B metric - actual value
  b2b1: number | null;                // B2B1 metric - actual value
  b2b2: number | null;                // B2B2 metric - actual value
  sig_strength: number | null;        // Signal Strength - actual value
  ts: string | null;                  // Timestamp of the reading
  sensor_id?: string | null;          // Sensor ID that provided this reading
}

export interface ApiResponse<T> {
  message: string;
  result: T;
}

/**
 * Fetch user data for a specific patient/user
 * @param userId - UUID of the user/patient
 * @returns Promise with user data including stats
 */
export async function fetchUser(userId: string): Promise<UserData | null> {
  // Ensure UUID is properly formatted (trim whitespace)
  const cleanUserId = userId.trim();
  const url = buildApiUrl(`/v1/user/${cleanUserId}`);
  
  if (import.meta.env.DEV) {
    console.log('Fetching user from:', url);
    console.log('User ID:', cleanUserId);
  }
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      
      // Read the response body once - try JSON first, then text
      let errorData: any = null;
      let errorText: string = '';
      
      try {
        // Try to get the response as text first (so we can try JSON parsing)
        const responseText = await response.text();
        errorText = responseText;
        
        // Try to parse as JSON
        try {
          errorData = JSON.parse(responseText);
        } catch {
          // Not JSON, use text
        }
      } catch (e) {
        console.error('Failed to read error response:', e);
      }
      
      let errorMessage = `Failed to fetch user: ${response.status} ${response.statusText}`;
      
      if (errorData) {
        console.error('Backend error response:', errorData);
        if (errorData.message && errorData.message !== 'Internal server error') {
          errorMessage = `Backend error: ${errorData.message}`;
        } else if (errorData.error) {
          errorMessage = `Backend error: ${errorData.error}`;
        } else if (errorText) {
          errorMessage = `Backend error: ${errorText}`;
        }
      } else if (errorText) {
        console.error('Backend error text:', errorText);
        errorMessage = `Backend server error (500): ${errorText}`;
      }
      
      if (response.status === 500) {
        if (!errorData && !errorText) {
          errorMessage = `Backend server error (500). This could mean: ` +
            `1) The user with UUID "${cleanUserId}" doesn't exist in the database, ` +
            `2) Database connection issue, or ` +
            `3) The user exists but has no vitals data in the stats field. ` +
            `Check the backend server console logs for the exact error.`;
        }
      }
      
      throw new Error(errorMessage);
    }

    // Parse response - handle both { message, result } format and direct user object
    let responseData: any;
    try {
      responseData = await response.json();
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      throw new Error('Invalid JSON response from backend');
    }
    
    // Log successful fetch for debugging
    if (import.meta.env.DEV) {
      console.log('Raw backend response:', responseData);
    }
    
    // Handle different response formats
    let userResult: any;
    if (responseData.result) {
      // Standard format: { message: 'Ok', result: user }
      userResult = responseData.result;
    } else if (responseData.id) {
      // Direct user object format
      userResult = responseData;
    } else {
      throw new Error('Invalid response format from backend: expected { message, result } or user object');
    }
    
    if (import.meta.env.DEV) {
      console.log('Parsed user result:', userResult);
      console.log('User stats:', userResult?.stats);
    }
    
    // Ensure stats is an object (handle null/undefined)
    if (!userResult.stats || typeof userResult.stats !== 'object') {
      userResult.stats = {};
    }
    
    // Normalize field names - handle both camelCase and snake_case from backend
    const userData: UserData = {
      id: userResult.id || '',
      email: userResult.email || '',
      firstName: userResult.firstName || userResult.first_name || '',
      lastName: userResult.lastName || userResult.last_name || '',
      phone: userResult.phone || '',
      username: userResult.username || '',
      roleId: userResult.roleId || userResult.role_id || '',
      orgId: userResult.orgId || userResult.org_id || '',
      stats: userResult.stats || {},
      settings: userResult.settings || {},
      createdAt: userResult.createdAt || userResult.created_at || (userResult.createdAt instanceof Date ? userResult.createdAt.toISOString() : ''),
      updatedAt: userResult.updatedAt || userResult.updated_at || (userResult.updatedAt instanceof Date ? userResult.updatedAt.toISOString() : ''),
    };
    
    if (import.meta.env.DEV) {
      console.log('Normalized user data:', userData);
    }
    
    return userData;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error(`Error fetching user from ${url}:`, error);
      throw new Error(
        `Cannot connect to backend server at ${API_BASE_URL}. ` +
        `Please ensure the backend server is running. ` +
        `You can start it with: cd zenzohealth && npm run dev` +
        ` (use 'dev' not 'start' to load .env file)`
      );
    }
    console.error('Error fetching user:', error);
    throw error;
  }
}

/**
 * Extract vitals data from user stats
 * Handles different possible field names (heartRate/hr, respiratoryRate/rr)
 * @param stats - Stats object from user data
 * @returns VitalsData object
 */
export function extractVitalsFromStats(stats: Record<string, any> | null | undefined): VitalsData {
  if (!stats) {
    return {
      heartRate: null,
      respiratoryRate: null,
      temperature: null,
      bloodPressureSystolic: null,
      bloodPressureDiastolic: null,
      bloodOxygen: null,
      weight: null,
      recordedAt: null,
    };
  }

  // Handle different possible field names
  const heartRate = stats.heartRate ?? stats.hr ?? stats.heart_rate ?? null;
  const respiratoryRate = stats.respiratoryRate ?? stats.rr ?? stats.respiratory_rate ?? null;
  const temperature = stats.temperature ?? stats.temp ?? null;
  const bloodPressureSystolic = stats.bloodPressureSystolic ?? stats.bp_systolic ?? stats.blood_pressure_systolic ?? null;
  const bloodPressureDiastolic = stats.bloodPressureDiastolic ?? stats.bp_diastolic ?? stats.blood_pressure_diastolic ?? null;
  const bloodOxygen = stats.bloodOxygen ?? stats.spo2 ?? stats.blood_oxygen ?? null;
  const weight = stats.weight ?? null;
  const recordedAt = stats.recordedAt ?? stats.recorded_at ?? stats.updatedAt ?? stats.updated_at ?? null;

  return {
    heartRate: typeof heartRate === 'number' ? heartRate : null,
    respiratoryRate: typeof respiratoryRate === 'number' ? respiratoryRate : null,
    temperature: typeof temperature === 'number' ? temperature : null,
    bloodPressureSystolic: typeof bloodPressureSystolic === 'number' ? bloodPressureSystolic : null,
    bloodPressureDiastolic: typeof bloodPressureDiastolic === 'number' ? bloodPressureDiastolic : null,
    bloodOxygen: typeof bloodOxygen === 'number' ? bloodOxygen : null,
    weight: typeof weight === 'number' ? weight : null,
    recordedAt: recordedAt ? String(recordedAt) : null,
  };
}

/**
 * Fetch the latest actual vital reading for a specific patient
 * Gets patient's sensors first, then fetches the latest reading from the first sensor
 * Uses actual database field names: hr, rr, fft, sv, hrv, bed_status, b2b, b2b1, b2b2, sig_strength, ts
 * @param patientId - UUID of the patient
 * @returns Promise with the latest actual vitals data from readings_vital table
 */
export async function fetchVitals(patientId: string): Promise<VitalsData | null> {
  try {
    // Step 1: Get patient's sensors
    // Endpoint: GET /api/v2/patients/:id/sensors
    const sensorsUrl = buildApiUrl(`/v2/patients/${patientId}/sensors`);
    
    if (import.meta.env.DEV) {
      console.log('Fetching patient sensors from:', sensorsUrl);
    }
    
    const sensorsResponse = await fetch(sensorsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!sensorsResponse.ok) {
      if (sensorsResponse.status === 404) {
        if (import.meta.env.DEV) {
          console.log('No sensors found for patient:', patientId);
        }
        return {
          hr: null,
          rr: null,
          fft: null,
          sv: null,
          hrv: null,
          bed_status: null,
          b2b: null,
          b2b1: null,
          b2b2: null,
          sig_strength: null,
          ts: null,
        };
      }
      console.error(`Failed to fetch sensors: ${sensorsResponse.status} ${sensorsResponse.statusText}`);
      throw new Error(`Failed to fetch sensors: ${sensorsResponse.status} ${sensorsResponse.statusText}`);
    }

    const sensors = await sensorsResponse.json();
    
    // Handle array or single object response
    const sensorsArray = Array.isArray(sensors) ? sensors : (sensors.result ? sensors.result : [sensors]);
    
    if (sensorsArray.length === 0) {
      if (import.meta.env.DEV) {
        console.log('No sensors found for patient:', patientId);
      }
      return {
        hr: null,
        rr: null,
        fft: null,
        sv: null,
        hrv: null,
        bed_status: null,
        b2b: null,
        b2b1: null,
        b2b2: null,
        sig_strength: null,
        ts: null,
      };
    }

    // Step 2: Get the latest vital reading from the first sensor
    // Endpoint: GET /api/v2/sensor-readings/:sensorId/vital?limit=1
    const sensorId = sensorsArray[0].id || sensorsArray[0].sensor_id;
    const readingsUrl = buildApiUrl(`/v2/sensor-readings/${sensorId}/vital`, { limit: 1 });
    
    if (import.meta.env.DEV) {
      console.log('Fetching latest vital reading from:', readingsUrl);
      console.log('Sensor ID:', sensorId);
    }
    
    const readingsResponse = await fetch(readingsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!readingsResponse.ok) {
      if (readingsResponse.status === 404) {
        if (import.meta.env.DEV) {
          console.log('No vital readings found for sensor:', sensorId);
        }
        return {
          hr: null,
          rr: null,
          fft: null,
          sv: null,
          hrv: null,
          bed_status: null,
          b2b: null,
          b2b1: null,
          b2b2: null,
          sig_strength: null,
          ts: null,
          sensor_id: sensorId,
        };
      }
      console.error(`Failed to fetch readings: ${readingsResponse.status} ${readingsResponse.statusText}`);
      throw new Error(`Failed to fetch readings: ${readingsResponse.status} ${readingsResponse.statusText}`);
    }

    const readings = await readingsResponse.json();
    
    // Handle array or single object response
    const readingsArray = Array.isArray(readings) ? readings : (readings.result ? readings.result : [readings]);
    
    if (readingsArray.length === 0) {
      if (import.meta.env.DEV) {
        console.log('No vital readings found for sensor:', sensorId);
      }
      return {
        hr: null,
        rr: null,
        fft: null,
        sv: null,
        hrv: null,
        bed_status: null,
        b2b: null,
        b2b1: null,
        b2b2: null,
        sig_strength: null,
        ts: null,
        sensor_id: sensorId,
      };
    }

    // Get the latest reading (first in the array, as it's ordered by ts DESC)
    const latestReading = readingsArray[0];
    
    // Log the raw backend response for debugging
    if (import.meta.env.DEV) {
      console.log('Raw vital reading from backend:', latestReading);
      console.log('Reading field names:', Object.keys(latestReading));
    }
    
    // Return data using exact database field names (hr, rr, fft, etc.)
    // These are the actual values from the readings_vital table
    return {
      hr: typeof latestReading.hr === 'number' && !isNaN(latestReading.hr) ? latestReading.hr : null,
      rr: typeof latestReading.rr === 'number' && !isNaN(latestReading.rr) ? latestReading.rr : null,
      fft: typeof latestReading.fft === 'number' && !isNaN(latestReading.fft) ? latestReading.fft : null,
      sv: typeof latestReading.sv === 'number' && !isNaN(latestReading.sv) ? latestReading.sv : null,
      hrv: typeof latestReading.hrv === 'number' && !isNaN(latestReading.hrv) ? latestReading.hrv : null,
      bed_status: typeof latestReading.bed_status === 'number' && !isNaN(latestReading.bed_status) ? latestReading.bed_status : null,
      b2b: typeof latestReading.b2b === 'number' && !isNaN(latestReading.b2b) ? latestReading.b2b : null,
      b2b1: typeof latestReading.b2b1 === 'number' && !isNaN(latestReading.b2b1) ? latestReading.b2b1 : null,
      b2b2: typeof latestReading.b2b2 === 'number' && !isNaN(latestReading.b2b2) ? latestReading.b2b2 : null,
      sig_strength: typeof latestReading.sig_strength === 'number' && !isNaN(latestReading.sig_strength) ? latestReading.sig_strength : null,
      ts: latestReading.ts ? String(latestReading.ts) : null,
      sensor_id: sensorId,
    };
  } catch (error) {
    console.error('Error fetching vitals:', error);
    // Return empty vitals instead of throwing, so the page can still display
    return {
      hr: null,
      rr: null,
      fft: null,
      sv: null,
      hrv: null,
      bed_status: null,
      b2b: null,
      b2b1: null,
      b2b2: null,
      sig_strength: null,
      ts: null,
    };
  }
}

/**
 * Helper function to test a UUID and see if it exists in the database
 * Usage: testUserUuid('uuid-here').then(console.log)
 */
export async function testUserUuid(uuid: string): Promise<{ success: boolean; user?: UserData; error?: string }> {
  try {
    const userData = await fetchUser(uuid);
    if (userData) {
      return {
        success: true,
        user: userData,
      };
    } else {
      return {
        success: false,
        error: 'User not found',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export interface PatientData {
  id: string;
  sid?: number;
  initials?: string;
  active: boolean;
  firstName: string;
  lastName: string;
  gender?: string;
  dob?: string;
  email?: string;
  phone?: string;
  notes?: string;
  description?: string;
  orgId?: string;
  orgName?: string;
  locationId?: string;
  locationName?: string;
  addressId?: string;
  // Address fields from patients_detailed_view
  block?: string;
  street?: string;
  landmark?: string;
  city?: string;
  state?: string;
  zip?: string;
  countryCode?: string;
  createdAt?: string;
  updatedAt?: string;
  stats?: {
    heartRate?: number | null;
    respiratoryRate?: number | null;
    hr?: number | null;
    rr?: number | null;
    temperature?: number | null;
    temp?: number | null;
    bloodPressureSystolic?: number | null;
    bloodPressureDiastolic?: number | null;
    bp_systolic?: number | null;
    bp_diastolic?: number | null;
    blood_oxygen?: number | null;
    bloodOxygen?: number | null;
    spo2?: number | null;
    weight?: number | null;
    recordedAt?: string;
    recorded_at?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Fetch all patients from the backend
 * Uses /api/v2/patients endpoint like the web project
 * @param type - Optional filter: 'all', 'active', or 'inactive'
 */
export async function fetchAllPatients(type: 'all' | 'active' | 'inactive' = 'active'): Promise<PatientData[]> {
  const url = buildApiUrl('/v2/patients', type && type !== 'all' ? { type } : undefined);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // The API returns a direct array of patients
    if (Array.isArray(data)) {
      return data;
    } else if (data.result && Array.isArray(data.result)) {
      return data.result;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}

/**
 * Fetch a single patient by ID
 * Uses /api/v2/patients/:id endpoint like the web project
 */
export async function fetchPatientById(patientId: string): Promise<PatientData | null> {
  const url = buildApiUrl(`/v2/patients/${patientId}`);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error(`Failed to fetch patient: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch patient: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // The API returns the patient object directly
    if (data && data.id) {
      return data;
    } else if (data.result && data.result.id) {
      return data.result;
    } else if (data.data && data.data.id) {
      return data.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
}

// Expose to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).testUserUuid = testUserUuid;
  (window as any).fetchAllPatients = fetchAllPatients;
  (window as any).fetchPatientById = fetchPatientById;
}

