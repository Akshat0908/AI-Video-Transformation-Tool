import { TransformationParameters, TransformationHistoryItem } from '../types';

// Mock function to simulate video transformation
export const transformVideo = async (
  videoFile: File,
  params: TransformationParameters
): Promise<string> => {
  // In a real implementation, this would:
  // 1. Upload the video to Cloudinary
  // 2. Call the Fal API with the Cloudinary URL and transformation parameters
  // 3. Receive a webhook with the transformed video URL
  
  console.log('Transforming video with parameters:', params);
  
  // Simulate the API call with a delayed response
  return new Promise((resolve) => {
    // First simulate uploading (40% of the time)
    setTimeout(() => {
      // Then simulate processing (60% of the time)
      setTimeout(() => {
        // Return a mocked video URL
        // In a real implementation, this would be the URL from Cloudinary
        resolve('https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4');
      }, 3000); // Simulate processing time
    }, 2000); // Simulate upload time
  });
};

// Mock function to fetch transformation history
export const fetchTransformationHistory = async (): Promise<TransformationHistoryItem[]> => {
  // In a real implementation, this would fetch from a database like MongoDB
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return [
    {
      id: '1',
      sourceVideoName: 'beach_sunset.mp4',
      sourceVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4',
      transformedVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
      parameters: {
        style: 'realistic',
        intensity: 80,
        enhanceQuality: true,
        resolution: '1080p',
        frameRate: 30,
        colorGrading: 'warm',
        additionalPrompt: 'Enhance sunset colors',
      },
      createdAt: '2023-06-15T14:30:00Z',
    },
    {
      id: '2',
      sourceVideoName: 'city_timelapse.mp4',
      sourceVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-9241-large.mp4',
      transformedVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4',
      parameters: {
        style: 'anime',
        intensity: 60,
        enhanceQuality: true,
        resolution: '720p',
        frameRate: 24,
        colorGrading: 'cinematic',
        additionalPrompt: '',
      },
      createdAt: '2023-06-10T09:15:00Z',
    },
    {
      id: '3',
      sourceVideoName: 'forest_walk.mp4',
      sourceVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
      transformedVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-the-water-of-a-lake-or-large-river-17111-large.mp4',
      parameters: {
        style: 'watercolor',
        intensity: 90,
        enhanceQuality: false,
        resolution: 'original',
        frameRate: 30,
        colorGrading: 'vibrant',
        additionalPrompt: 'Add birds flying',
      },
      createdAt: '2023-06-05T17:45:00Z',
    }
  ];
};