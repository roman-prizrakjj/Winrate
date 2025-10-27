export interface CaptainInfo {
  nickname: string | null;
  telegram: string | null;
}

export interface CaptainsResponse {
  captains: Record<string, CaptainInfo>;
  totalParticipants: number;
  totalCaptains: number;
}
