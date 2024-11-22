"use client";

import { useState, useEffect, useRef } from "react";

interface VideoPreviewProps {
  file: File;
  onClose: () => void;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ file, onClose }) => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    // Creates memory-efficient URL
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    // Cleanup
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!url) return null;

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm">
      <video
        className="w-full max-h-[400px] object-contain"
        controls
        preload="metadata"
        playsInline
      >
        <source src={url} type={file.type} />
        Your browser does not support the video tag.
      </video>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-2 bg-gray-900/50 rounded-full hover:bg-gray-900/75 transition-colors"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

const VideoUpload = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    console.log({ file });
    if (file) {
      await validateAndSetVideo(file);
    }
  };

  const validateAndSetVideo = async (file: File) => {
    setIsLoading(true);
    try {
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        throw new Error("File size exceeds 100MB limit");
      }

      const duration = await getVideoDuration(file);
      if (duration > 300) {
        // 5 minutes
        throw new Error("Video duration exceeds 5 minutes limit");
      }

      setVideoFile(file);
    } catch (error) {
      console.error("Video validation failed:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => reject("Invalid video file");
      video.src = URL.createObjectURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) return;

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {videoFile ? (
        <div className="space-y-6">
          <VideoPreview file={videoFile} onClose={() => setVideoFile(null)} />
          <div className="text-center text-gray-300">
            <p className="text-xl font-medium mb-2">{videoFile.name}</p>
            <p className="text-sm text-gray-400">
              {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-12
            transition-all duration-200 cursor-pointer
            ${
              isDragging
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-600 hover:border-purple-500/50 hover:bg-gray-800/50"
            }
          `}
        >
          {isLoading ? (
            <div className="text-center text-gray-400">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto mb-4" />
              <p>Processing video...</p>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-xl font-medium mb-2">
                Drag and drop your video here
              </p>
              <p className="text-sm">or click to browse</p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!videoFile || isLoading}
        className={`
          w-full px-6 py-4 rounded-xl font-medium text-lg
          transition-all duration-200
          ${
            videoFile && !isLoading
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        {isLoading
          ? "Processing..."
          : videoFile
          ? "Transform Your Video"
          : "Upload a video to begin"}
      </button>
    </div>
  );
};

export default VideoUpload;
