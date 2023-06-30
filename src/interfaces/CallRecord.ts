export interface CallRecord {
    id: number;
    caller: string;
    recipient: string;
    startTime: string;
    endTime: string;
    duration: number;
    type: "video" | "voice";
  }
  
  