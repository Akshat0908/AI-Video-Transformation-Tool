export interface TransformationParameters {
  style: 'anime' | 'cartoon' | 'pixar' | 'realistic' | 'watercolor';
  intensity: number;
  enhanceQuality: boolean;
  resolution: 'original' | '720p' | '1080p' | '4k';
  frameRate: 24 | 30 | 60;
  colorGrading: 'none' | 'cinematic' | 'vibrant' | 'warm' | 'cool' | 'vintage';
  additionalPrompt: string;
}

export interface TransformationHistoryItem {
  id: string;
  sourceVideoName: string;
  sourceVideoUrl: string;
  transformedVideoUrl: string;
  parameters: TransformationParameters;
  createdAt: string;
}