import React, { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Check, AlertCircle, FileVideo } from 'lucide-react';
import { useVideoContext } from '../context/VideoContext';

interface VideoUploaderProps {
  onComplete: () => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onComplete }) => {
  const { setSourceVideo, sourceVideo } = useVideoContext();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/mpeg', 'video/x-msvideo'];
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      setError(`Invalid file type. Please upload a video in one of these formats: MP4, MOV, MPEG, AVI.`);
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is 100MB.`);
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    setError(null);
    
    if (!validateFile(file)) {
      return;
    }

    // Create object URL for preview
    const preview = URL.createObjectURL(file);
    
    setSourceVideo({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview
    });
  };

  const clearFile = () => {
    if (sourceVideo?.preview) {
      URL.revokeObjectURL(sourceVideo.preview);
    }
    setSourceVideo(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Upload Video</h2>

      {error && (
        <div className="bg-red-950/50 border border-red-800 rounded-md p-3 mb-4 text-red-400 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!sourceVideo ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-[#3b82f6] bg-[#3b82f6]/10' 
              : 'border-[#334155] bg-[#0f172a] hover:bg-[#1e293b]/50 hover:border-[#64748b]'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            accept="video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileInput}
          />
          <div className="max-w-xs mx-auto">
            <div className="bg-[#1e293b] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-[#3b82f6]" />
            </div>
            <h3 className="text-lg font-medium mb-2">Drag & drop your video</h3>
            <p className="text-[#94a3b8] text-sm mb-4">
              or click to browse from your computer
            </p>
            <p className="text-xs text-[#64748b]">
              Supported formats: MP4, MOV, MPEG, AVI (max 100MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#0f172a] rounded-lg overflow-hidden">
          <div className="aspect-video">
            <video
              src={sourceVideo.preview}
              controls
              className="w-full h-full object-contain"
            />
          </div>
          <div className="p-4 border-t border-[#334155]">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-[#1e293b] rounded-full p-2">
                  <FileVideo className="h-5 w-5 text-[#3b82f6]" />
                </div>
                <div>
                  <p className="font-medium text-sm">{sourceVideo.name}</p>
                  <p className="text-xs text-[#94a3b8]">{formatBytes(sourceVideo.size)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={clearFile}
                  className="p-2 text-[#94a3b8] hover:text-white rounded-full hover:bg-[#1e293b] transition-colors"
                  aria-label="Remove file"
                >
                  <X className="h-5 w-5" />
                </button>
                <button 
                  onClick={onComplete}
                  className="p-2 text-white rounded-full bg-[#3b82f6] hover:bg-[#2563eb] transition-colors"
                  aria-label="Continue"
                >
                  <Check className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-medium text-sm mb-3">Video Requirements</h3>
        <ul className="space-y-2 text-sm text-[#94a3b8]">
          <li className="flex items-center gap-2">
            <Check size={16} className="text-green-500" />
            Video must be less than 100MB in size
          </li>
          <li className="flex items-center gap-2">
            <Check size={16} className="text-green-500" />
            Supported formats: MP4, MOV, MPEG, AVI
          </li>
          <li className="flex items-center gap-2">
            <Check size={16} className="text-green-500" />
            Best results with videos between 5-30 seconds
          </li>
          <li className="flex items-center gap-2">
            <Check size={16} className="text-green-500" />
            Higher quality source videos yield better results
          </li>
        </ul>
      </div>

      {sourceVideo && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onComplete}
            className="btn btn-primary"
          >
            Continue to Parameters
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;