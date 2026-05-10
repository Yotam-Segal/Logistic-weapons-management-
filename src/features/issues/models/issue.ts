// * Issue domain models (Req 5.3, 6.1, 7.1, 9.1).
// * Re-exports TIssueStatus from shared so issues code can import it from its own feature models.
import type { TIssueStatus } from '../../shared/models/issueStatus';

export type { TIssueStatus };

export type TIssueType =
  | 'מעצור חולץ'
  | 'שבר בפין פציל'
  | 'קנה שחוק'
  | 'בעיית דריכה'
  | 'ידית דריכה תקועה'
  | 'בעיית הזנה'
  | 'חלק חסר'
  | 'אחר';

export interface IIssue {
  id: string;
  itemId: string;
  locationId: string;
  issueType: TIssueType;
  status: TIssueStatus;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReportIssueInput {
  itemId: string;
  locationId: string;
  issueType: TIssueType;
  comment?: string;
}
