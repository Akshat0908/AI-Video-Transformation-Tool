import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TransformationParameters } from '../types';

interface SourceVideo {
  file: File;
  name: string;
  size: number;
  type: string;
  preview: string;
}

interface VideoContextType {
  sourceVideo: SourceVideo | null;
  setSourceVideo: (video: SourceVideo | null) => void;
  transformedVideo: string | null;
  setTransformedVideo: (url: string | null) => void;
  transformationParams: TransformationParameters;
  setTransformationParams: (params: TransformationParameters) => void;
  processingStatus: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  setProcessingStatus: (status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error') => void;
  resetAll: () => void;
}

const VideoContext = createContext<VideoContextType | null>(null);

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
};

export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sourceVideo, setSourceVideo] = useState<SourceVideo | null>(null);
  const [transformedVideo, setTransformedVideo] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'error'>('idle');
  
  const [transformationParams, setTransformationParams] = useState<TransformationParameters>({
    style: 'realistic',
    intensity: 70,
    enhanceQuality: true,
    resolution: 'original',
    frameRate: 30,
    colorGrading: 'none',
    additionalPrompt: '',
  });

  const resetAll = () => {
    if (sourceVideo?.preview) {
      URL.revokeObjectURL(sourceVideo.preview);
    }
    setSourceVideo(null);
    setTransformedVideo(null);
    setProcessingStatus('idle');
    setTransformationParams({
      style: 'realistic',
      intensity: 70,
      enhanceQuality: true,
      resolution: 'original',
      frameRate: 30,
      colorGrading: 'none',
      additionalPrompt: '',
    });
  };

  return (
    <VideoContext.Provider
      value={{
        sourceVideo,
        setSourceVideo,
        transformedVideo,
        setTransformedVideo,
        transformationParams,
        setTransformationParams,
        processingStatus,
        setProcessingStatus,
        resetAll,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};