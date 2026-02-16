import { DB } from './types';

const today = new Date().toISOString().slice(0, 10);
const yesterdayDate = new Date();
yesterdayDate.setDate(yesterdayDate.getDate() - 1);
const yesterday = yesterdayDate.toISOString().slice(0, 10);

export const seedDb: DB = {
  svSession: false,
  staffs: [
    { id: 'stf-001', displayName: '田中 太郎', eventCompany: 'A販社', active: true },
    { id: 'stf-002', displayName: '佐藤 花子', eventCompany: 'B販社', active: true },
    { id: 'stf-003', displayName: '鈴木 次郎', eventCompany: 'C販社', active: false }
  ],
  reports: [
    {
      id: 'rpt-001',
      workDate: yesterday,
      staffId: 'stf-001',
      eventCompany: 'A販社',
      storeOrVenue: 'イオンモール幕張',
      photos: [],
      status: 'submitted',
      locked: true,
      visitors: 45,
      catchCount: 14,
      seated: 7,
      prospects: 3,
      success: {
        title: '料金見直しから家族3回線獲得',
        keyTalk: '家計全体の最適化視点で提案',
        customerTypes: ['ファミリー'],
        visitPurpose: '料金見直し'
      },
      failure: {
        title: '端末在庫不足で見送り',
        causeTag: '在庫',
        nextAction: '来週入荷後に連絡'
      },
      svReview: {
        rating: null,
        tags: [],
        comment: '',
        correctionEnabled: false
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'rpt-002',
      workDate: today,
      staffId: 'stf-002',
      eventCompany: 'B販社',
      storeOrVenue: 'ららぽーと豊洲',
      photos: [],
      status: 'draft',
      locked: false,
      success: {
        title: 'シニア層へ安心訴求でMNP成約',
        keyTalk: 'サポート体制を具体例で説明'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  knowledge: [
    {
      id: 'k-001',
      reportId: 'rpt-001',
      title: '家族訴求で3回線獲得する導線',
      body: '来店目的が料金見直しの場合、家族全員の請求比較を先に提示すると反応が良い。',
      tags: ['ファミリー', '料金見直し'],
      createdAt: new Date().toISOString()
    },
    {
      id: 'k-002',
      title: 'シニア向け説明は3ステップが有効',
      body: '専門用語を避け、現状→変更後→サポート窓口の順に案内。',
      tags: ['シニア'],
      createdAt: yesterdayDate.toISOString()
    }
  ]
};
