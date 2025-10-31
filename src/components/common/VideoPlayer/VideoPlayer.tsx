import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  className?: string;
}

export function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  title = 'Demo Video',
  className = '',
}: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div
      className={`w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,191,166,0.15)] hover:shadow-[0_25px_60px_rgba(0,191,166,0.2)] transition-shadow duration-300 bg-white/80 backdrop-blur-sm ${className}`}
    >
      <div className="aspect-video w-full bg-black relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        )}
        {hasError ? (
          <div className="h-full flex items-center justify-center bg-black/5 text-muted-foreground p-8 text-center">
            <p>
              Unable to load the video. Please check your connection or try
              again later.
            </p>
          </div>
        ) : (
          <video
            className="w-full h-full object-contain"
            title={title}
            controls
            poster={thumbnailUrl}
            onLoadedData={handleLoadedData}
            onError={handleError}
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
            <track kind="captions" srcLang="en" label="English" src="" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      {title && !hasError && (
        <div className="p-4 bg-background">
          <h3 className="font-medium text-foreground">{title}</h3>
        </div>
      )}
    </div>
  );
}
