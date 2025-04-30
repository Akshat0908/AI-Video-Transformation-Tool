import React, { useState } from 'react';
import { Upload, Wand2, FileVideo, Download, Check, Info, Loader2 } from 'lucide-react';
import VideoUploader from '../components/VideoUploader';
import TransformationForm from '../components/TransformationForm';
import VideoPlayer from '../components/VideoPlayer';
import { useVideoContext } from '../context/VideoContext';

const HomePage: React.FC = () => {
  const { 
    sourceVideo, 
    transformedVideo, 
    transformationParams,
    processingStatus,
    resetAll
  } = useVideoContext();
  
  const [activeTab, setActiveTab] = useState('upload');

  const getStatusText = () => {
    switch (processingStatus) {
      case 'idle':
        return 'Upload a video and set parameters to begin transformation';
      case 'uploading':
        return 'Uploading video to our servers...';
      case 'processing':
        return 'Processing your video with AI...';
      case 'completed':
        return 'Transformation completed successfully!';
      case 'error':
        return 'An error occurred during processing. Please try again.';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (processingStatus) {
      case 'completed':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const renderContent = () => {
    // If we have a transformed video, show the results
    if (transformedVideo) {
      return (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Transformation Result</h2>
            <button 
              onClick={resetAll}
              className="btn btn-outline text-sm"
            >
              Create New Transformation
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-medium mb-2">Source Video</h3>
              <VideoPlayer src={sourceVideo?.preview || ''} />
              <div className="mt-3 text-sm text-[#94a3b8]">
                <p>Original video uploaded by you</p>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-medium mb-2">Transformed Video</h3>
              <VideoPlayer src={transformedVideo} />
              <div className="mt-3 flex justify-between items-center">
                <p className="text-sm text-[#94a3b8]">AI-enhanced video</p>
                <a 
                  href={transformedVideo}
                  download="transformed-video.mp4" 
                  className="btn btn-primary text-sm"
                >
                  <Download size={16} />
                  Download
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 card">
            <h3 className="text-lg font-medium mb-4">Transformation Parameters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(transformationParams).map(([key, value]) => (
                <div key={key} className="bg-[#0f172a] p-3 rounded-md">
                  <p className="text-[#94a3b8] text-xs mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="font-medium">{value.toString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Otherwise, show the upload & transformation interface
    return (
      <div className="mt-8">
        <div className="flex border-b border-[#334155] mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'upload' 
                ? 'border-b-2 border-[#3b82f6] text-white' 
                : 'text-[#94a3b8] hover:text-white'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            1. Upload Video
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'parameters' 
                ? 'border-b-2 border-[#3b82f6] text-white' 
                : 'text-[#94a3b8] hover:text-white'
            }`}
            onClick={() => setActiveTab('parameters')}
            disabled={!sourceVideo}
          >
            2. Set Parameters
          </button>
        </div>

        {activeTab === 'upload' ? (
          <VideoUploader onComplete={() => setActiveTab('parameters')} />
        ) : (
          <TransformationForm />
        )}

        {processingStatus !== 'idle' && (
          <div className={`mt-8 card ${getStatusColor()}`}>
            <div className="flex items-center gap-3">
              {processingStatus === 'uploading' || processingStatus === 'processing' ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : processingStatus === 'completed' ? (
                <Check className="h-5 w-5" />
              ) : (
                <Info className="h-5 w-5" />
              )}
              
              <p className="font-medium">{getStatusText()}</p>
            </div>
            
            {(processingStatus === 'uploading' || processingStatus === 'processing') && (
              <div className="loading-bar mt-4"></div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            AI Video Transformation
          </h1>
          <p className="max-w-2xl mx-auto text-[#94a3b8]">
            Transform your videos using state-of-the-art AI technology. Upload a video, set your parameters, and watch the magic happen.
          </p>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default HomePage;