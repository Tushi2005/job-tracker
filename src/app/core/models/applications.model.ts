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


export const STATUS_OPTIONS = [
  { value: ApplicationStatus.Sent, label: 'Elküldve' },
  { value: ApplicationStatus.InterviewScheduled, label: 'Interjú' },
  { value: ApplicationStatus.SecondRound, label: 'Második kör' },
  { value: ApplicationStatus.Accepted, label: 'Elfogadott' },
  { value: ApplicationStatus.Rejected, label: 'Elutasított' },
  { value: ApplicationStatus.NoResponse, label: 'Nincs válasz' }
];