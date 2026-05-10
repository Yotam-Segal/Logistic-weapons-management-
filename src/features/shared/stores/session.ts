import { atom } from 'jotai';
import type { TRole } from '../models/role';

export const roleAtom = atom<TRole | null>(null);

// * Selected location id; null when no location is chosen (Req 2.1, 2.3).
export const locationAtom = atom<string | null>(null);
