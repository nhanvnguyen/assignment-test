export default interface Ticket {
    id: number;
    description: string;
    assigneeId: number | null;
    completed: boolean;
  }