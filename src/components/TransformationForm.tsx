import React, { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { useVideoContext } from '../context/VideoContext';
import { transformVideo } from '../services/api';

const TransformationForm: React.FC = () => {
  const { 
    sourceVideo, 
    transformationParams, 
    setTransformationParams,
    setTransformedVideo,
    setProcessingStatus
  } = useVideoContext();

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleParamChange = (name: string, value: any) => {
    setTransformationParams({
      ...transformationParams,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sourceVideo) {
      setValidationError('No source video selected. Please upload a video first.');
      return;
    }

    try {
      setValidationError(null);
      setProcessingStatus('uploading');
      
      // First, upload the video to the server
      const transformedVideoUrl = await transformVideo(sourceVideo.file, transformationParams);
      
      // Once processing is complete, set the transformed video URL
      setTransformedVideo(transformedVideoUrl);
      setProcessingStatus('completed');
    } catch (error) {
      console.error('Error processing video:', error);
      setProcessingStatus('error');
      setValidationError('Failed to process the video. Please try again.');
    }
  };

  if (!sourceVideo) {
    return (
      <div className="bg-red-950/50 border border-red-800 rounded-md p-4 text-red-400">
        No source video selected. Please upload a video first.
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Transformation Parameters</h2>
      
      {validationError && (
        <div className="bg-red-950/50 border border-red-800 rounded-md p-3 mb-4 text-red-400 text-sm">
          {validationError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="style">Style</label>
            <select
              id="style"
              value={transformationParams.style}
              onChange={(e) => handleParamChange('style', e.target.value)}
              className="bg-[#0f172a] border border-[#334155] rounded-md"
            >
              <option value="anime">Anime</option>
              <option value="cartoon">Cartoon</option>
              <option value="pixar">Pixar</option>
              <option value="realistic">Realistic</option>
              <option value="watercolor">Watercolor</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="intensity">Style Intensity</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                id="intensity"
                min="0"
                max="100"
                step="5"
                value={transformationParams.intensity}
                onChange={(e) => handleParamChange('intensity', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm w-9 text-right">{transformationParams.intensity}%</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="enhanceQuality">Enhance Quality</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="enhanceQuality"
                  checked={transformationParams.enhanceQuality === true}
                  onChange={() => handleParamChange('enhanceQuality', true)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="enhanceQuality"
                  checked={transformationParams.enhanceQuality === false}
                  onChange={() => handleParamChange('enhanceQuality', false)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="resolution">Output Resolution</label>
            <select
              id="resolution"
              value={transformationParams.resolution}
              onChange={(e) => handleParamChange('resolution', e.target.value)}
              className="bg-[#0f172a] border border-[#334155] rounded-md"
            >
              <option value="original">Original</option>
              <option value="720p">720p HD</option>
              <option value="1080p">1080p Full HD</option>
              <option value="4k">4K Ultra HD</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="frameRate">Frame Rate</label>
            <select
              id="frameRate"
              value={transformationParams.frameRate}
              onChange={(e) => handleParamChange('frameRate', parseInt(e.target.value))}
              className="bg-[#0f172a] border border-[#334155] rounded-md"
            >
              <option value="24">24 fps</option>
              <option value="30">30 fps</option>
              <option value="60">60 fps</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="colorGrading">Color Grading</label>
            <select
              id="colorGrading"
              value={transformationParams.colorGrading}
              onChange={(e) => handleParamChange('colorGrading', e.target.value)}
              className="bg-[#0f172a] border border-[#334155] rounded-md"
            >
              <option value="none">None</option>
              <option value="cinematic">Cinematic</option>
              <option value="vibrant">Vibrant</option>
              <option value="warm">Warm</option>
              <option value="cool">Cool</option>
              <option value="vintage">Vintage</option>
            </select>
          </div>
        </div>
        
        <div className="form-group mt-4">
          <label htmlFor="additionalPrompt">Additional Instructions (Optional)</label>
          <textarea
            id="additionalPrompt"
            rows={3}
            placeholder="Add any specific instructions for the AI (e.g., 'maintain facial details', 'emphasize movement')"
            value={transformationParams.additionalPrompt}
            onChange={(e) => handleParamChange('additionalPrompt', e.target.value)}
            className="bg-[#0f172a] border border-[#334155] rounded-md"
          />
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="btn btn-accent"
            disabled={!sourceVideo || ['uploading', 'processing'].includes(useVideoContext().processingStatus)}
          >
            {['uploading', 'processing'].includes(useVideoContext().processingStatus) ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Transform Video
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransformationForm;