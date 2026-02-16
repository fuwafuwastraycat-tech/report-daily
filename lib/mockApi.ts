'use client';

import { v4 as uuidv4 } from 'uuid';
import { getDb, saveDb } from './storage';
import { KnowledgeItem, Report, Staff } from './types';

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export const STAFF_PREF_KEY = 'selected-staff-id';
export const SV_SESSION_KEY = 'sv-session';

export const reportCauseTags = ['在庫', 'ヒアリング不足', '競合優位', '価格不一致', '時間不足', '訴求不足', 'その他'];
export const reviewTags = ['トーク構成', '提案力', 'クロージング', '課題把握', '再現性高い', '要添削'];

export const getActiveStaffs = async () => {
  await delay();
  return getDb().staffs.filter((s) => s.active);
};

export const getAllStaffs = async () => {
  await delay();
  return getDb().staffs;
};

export const saveStaffSelection = (staffId: string) => localStorage.setItem(STAFF_PREF_KEY, staffId);
export const getSavedStaffSelection = () => localStorage.getItem(STAFF_PREF_KEY);

export const verifySvPin = async (pin: string) => {
  await delay();
  const ok = pin === '1234';
  if (ok) {
    localStorage.setItem(SV_SESSION_KEY, 'ok');
  }
  return ok;
};

export const hasSvSession = () => localStorage.getItem(SV_SESSION_KEY) === 'ok';

export const getReportById = async (id: string) => {
  await delay();
  return getDb().reports.find((r) => r.id === id);
};

export const getReports = async () => {
  await delay();
  return getDb().reports;
};

export const getMyReports = async (staffId: string) => {
  await delay();
  return getDb().reports.filter((r) => r.staffId === staffId).sort((a, b) => b.workDate.localeCompare(a.workDate));
};

export const findOrCreateTodayReport = async (payload: {
  workDate: string;
  staffId: string;
  eventCompany: string;
  storeOrVenue: string;
  photos: string[];
}) => {
  await delay();
  const db = getDb();
  const existing = db.reports.find((r) => r.staffId === payload.staffId && r.workDate === payload.workDate);
  if (existing) return existing;

  const report: Report = {
    id: uuidv4(),
    workDate: payload.workDate,
    staffId: payload.staffId,
    eventCompany: payload.eventCompany,
    storeOrVenue: payload.storeOrVenue,
    photos: payload.photos,
    status: 'draft',
    locked: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.reports.push(report);
  saveDb(db);
  return report;
};

export const updateReport = async (reportId: string, patch: Partial<Report>) => {
  await delay();
  const db = getDb();
  const idx = db.reports.findIndex((r) => r.id === reportId);
  if (idx < 0) throw new Error('report not found');
  db.reports[idx] = { ...db.reports[idx], ...patch, updatedAt: new Date().toISOString() };
  saveDb(db);
  return db.reports[idx];
};

export const submitReport = async (reportId: string) => updateReport(reportId, { status: 'submitted' });

export const getKnowledge = async () => {
  await delay();
  return getDb().knowledge.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const createKnowledge = async (item: Omit<KnowledgeItem, 'id' | 'createdAt'>) => {
  await delay();
  const db = getDb();
  const entry: KnowledgeItem = { ...item, id: uuidv4(), createdAt: new Date().toISOString() };
  db.knowledge.push(entry);
  saveDb(db);
  return entry;
};

export const saveSvReview = async (
  reportId: string,
  review: {
    rating: 'S' | 'A' | 'B' | 'C';
    tags: string[];
    comment: string;
    correctionEnabled: boolean;
    correctedSuccess?: string;
    correctedFailure?: string;
  }
) => {
  const report = await updateReport(reportId, { svReview: review });
  if (review.rating === 'S') {
    await createKnowledge({
      reportId,
      title: report.success?.title || 'S評価ナレッジ',
      body: review.correctedSuccess || report.success?.keyTalk || report.success?.reason || '詳細はSVコメント参照',
      tags: review.tags
    });
  }
  return report;
};

export const requestUnlock = async (reportId: string, reason: string, memo?: string) => {
  const report = await updateReport(reportId, {
    unlockRequest: {
      requestedAt: new Date().toISOString(),
      reason,
      memo,
      status: 'pending'
    }
  });
  return report;
};

export const decideUnlock = async (reportId: string, approve: boolean) => {
  const current = await getReportById(reportId);
  if (!current || !current.unlockRequest) return current;
  return updateReport(reportId, {
    locked: approve ? false : current.locked,
    unlockRequest: {
      ...current.unlockRequest,
      status: approve ? 'approved' : 'denied'
    }
  });
};

export const addStaff = async (staff: Omit<Staff, 'id'>) => {
  await delay();
  const db = getDb();
  const newStaff: Staff = { ...staff, id: uuidv4() };
  db.staffs.push(newStaff);
  saveDb(db);
  return newStaff;
};

export const toggleStaffActive = async (staffId: string) => {
  await delay();
  const db = getDb();
  const idx = db.staffs.findIndex((s) => s.id === staffId);
  if (idx < 0) return;
  db.staffs[idx].active = !db.staffs[idx].active;
  saveDb(db);
};
