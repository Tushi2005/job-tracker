export interface Application{
    id: number;
    userId: number;
    companyName: string;
    position: string;
    status: ApplicationStatus;
    appliedAt: Date;
    interviewAt?: Date;
    jobUrl?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export enum ApplicationStatus {
  Sent = 'Sent',
  InterviewScheduled = 'InterviewScheduled',
  SecondRound = 'SecondRound',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  NoResponse = 'NoResponse'
}