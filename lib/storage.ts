import { seedDb } from './mockData';
import { DB } from './types';

const DB_KEY = 'telecom-report-db-v1';

export const getDb = (): DB => {
  if (typeof window === 'undefined') return seedDb;
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    localStorage.setItem(DB_KEY, JSON.stringify(seedDb));
    return seedDb;
  }
  return JSON.parse(raw) as DB;
};

export const saveDb = (db: DB) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

export const resetDb = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DB_KEY, JSON.stringify(seedDb));
};
