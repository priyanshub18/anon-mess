import { Message } from "@/model/user";
export interface ApiResponse {
  success: boolean;
  message: string;
  isAccepting?: boolean;
  messages?: Message[];
}
