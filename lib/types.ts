export type ReportStatus = 'draft' | 'submitted';
export type Rating = 'S' | 'A' | 'B' | 'C' | null;

export type Staff = {
  id: string;
  displayName: string;
  eventCompany?: string;
  active: boolean;
};

export type UnlockRequest = {
  requestedAt: string;
  reason: string;
  memo?: string;
  status: 'pending' | 'approved' | 'denied';
};

export type Report = {
  id: string;
  workDate: string;
  staffId: string;
  eventCompany: string;
  storeOrVenue: string;
  photos: string[];
  status: ReportStatus;
  locked: boolean;
  unlockRequest?: UnlockRequest;
  visitors?: number;
  catchCount?: number;
  seated?: number;
  prospects?: number;
  seatedBreakdown?: Record<string, number>;
  acquisitions?: Record<string, number>;
  ltv?: Record<string, number>;
  success?: {
    title?: string;
    customerTypes?: string[];
    visitPurpose?: string;
    keyTalk?: string;
    reason?: string;
    other?: string;
  };
  failure?: {
    title?: string;
    causeTag?: string;
    nextAction?: string;
    impression?: string;
    notes?: string;
  };
  svReview?: {
    rating: Rating;
    tags: string[];
    comment: string;
    correctionEnabled: boolean;
    correctedSuccess?: string;
    correctedFailure?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeItem = {
  id: string;
  reportId?: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
};

export type DB = {
  staffs: Staff[];
  reports: Report[];
  knowledge: KnowledgeItem[];
  svSession: boolean;
};
