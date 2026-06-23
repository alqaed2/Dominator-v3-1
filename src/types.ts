export interface Scene {
  time: string;
  voiceover: string;
  image_prompt: string;
  image_base64?: string;
}

export interface GenerationMetrics {
  viralityScore: number;
  predictedReach: number;
  sentiment: string;
  dominanceScore?: number;
}

export interface DominatorPack {
  status: "SUCCESS" | "ERROR";
  title: string;
  hashtags: string[];
  metrics: GenerationMetrics;
  is_reel: boolean;
  scenes?: Scene[];
  body?: string;
  framework?: string;
  image_prompt?: string;
  image_base64?: string;
}

export interface TerminalLog {
  id: string;
  text: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: string;
}
