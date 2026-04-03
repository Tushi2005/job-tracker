export interface Application{
    id: number;
    userId: number;
    companyName: string;
    position: string;
    status: string;
    appliedAt: Date;
    interviewAt?: Date;
    jobUrl?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

enum applicationStatus{
  Sent = 0,
  InterviewScheduled = 1,
  SecondRound = 2,
  Accepted = 3,
  Rejected = 4,
  NoResponse = 5
}