import api from "./api";

export type ChatRequest = {
  message: string;
  session_id?: string;
};

export type ChatResponse = {
  reply: string;
  session_id: string;
};

export const sendChatMessage = async (payload: ChatRequest): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>("/chat", payload);
  return response.data;
};
