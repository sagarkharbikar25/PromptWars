import { createClient } from '@supabase/supabase-js';
import { GATES_DATA, ZONES_DATA, TRANSPORT_DATA, FAQS_DATA } from './stadiumData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// In-memory fallback database for the live demo
let localGates = [...GATES_DATA];
let localZones = [...ZONES_DATA];
let localTransport = [...TRANSPORT_DATA];
let localFaqs = [...FAQS_DATA];

export async function getGates() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('gates').select('*');
    if (!error && data && data.length > 0) return data;
  }
  return localGates;
}

export async function updateGateOccupancy(id: string, rate: number) {
  const parsedRate = Math.max(0, Math.min(100, rate));
  let status: 'Open' | 'Warning' | 'Critical' = 'Open';
  if (parsedRate >= 90) status = 'Critical';
  else if (parsedRate >= 75) status = 'Warning';

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('gates')
      .update({ occupancyRate: parsedRate, status })
      .eq('id', id)
      .select();
    if (!error && data) return data[0];
  }

  const index = localGates.findIndex(g => g.id === id);
  if (index !== -1) {
    localGates[index] = {
      ...localGates[index],
      occupancyRate: parsedRate,
      status
    };
    return localGates[index];
  }
  return null;
}

export async function getZones() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('zones').select('*');
    if (!error && data && data.length > 0) return data;
  }
  return localZones;
}

export async function updateZoneStatus(id: string, crowdLevel: 'Low' | 'Medium' | 'High' | 'Overcrowded', securityStatus: 'Normal' | 'Alert' | 'Lockdown') {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('zones')
      .update({ crowdLevel, securityStatus })
      .eq('id', id)
      .select();
    if (!error && data) return data[0];
  }

  const index = localZones.findIndex(z => z.id === id);
  if (index !== -1) {
    localZones[index] = {
      ...localZones[index],
      crowdLevel,
      securityStatus
    };
    return localZones[index];
  }
  return null;
}

export async function getTransport() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('transport_options').select('*');
    if (!error && data && data.length > 0) return data;
  }
  return localTransport;
}

export async function getFAQs() {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from('faqs').select('*');
    if (!error && data && data.length > 0) return data;
  }
  return localFaqs;
}
