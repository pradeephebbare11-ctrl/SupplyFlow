import React, { useState, useRef, useEffect } from 'react';
import { SAMPLE_PHOTOS } from '../data';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoDataUrl: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not available in this browser');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(err.message || 'Unable to access camera. You can upload an image instead.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      setTimeout(() => {
        setIsCapturing(false);
        stopCamera();
        onCapture(dataUrl);
      }, 150);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          stopCamera();
          onCapture(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url: string) => {
    stopCamera();
    onCapture(url);
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  if (!isOpen) return null;

  return (
    <div
      id="camera-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-[#191b23] text-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2563eb] text-2xl">
              photo_camera
            </span>
            <h3 className="text-base font-bold text-white">Capture Product Photo</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Viewfinder / Video Canvas */}
        <div className="relative flex-1 bg-black aspect-square max-h-[380px] sm:max-h-[420px] flex items-center justify-center overflow-hidden">
          {isCapturing && (
            <div className="absolute inset-0 bg-white z-30 animate-ping opacity-75" />
          )}

          {cameraError ? (
            /* Camera Unavailable Fallback View */
            <div className="p-6 text-center flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white/60">
                <span className="material-symbols-outlined text-3xl">videocam_off</span>
              </div>
              <p className="text-sm font-semibold text-white/90">Camera Access Notice</p>
              <p className="text-xs text-white/60 max-w-xs leading-relaxed">
                {cameraError}. You can upload a photo from your file system or choose a warehouse preset below.
              </p>
              <div className="flex gap-2 mt-2">
                <label className="bg-[#004ac6] hover:bg-[#003ea8] text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">upload</span>
                  Upload Photo File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          ) : (
            <>
              {/* Live WebCam Video */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Framing Grid */}
              <div className="absolute inset-8 pointer-events-none border border-white/30 rounded-xl flex flex-col justify-between p-4">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-blue-400 rounded-tl-sm" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-blue-400 rounded-tr-sm" />
                </div>
                <div className="text-center">
                  <span className="text-[11px] bg-black/60 px-3 py-1 rounded-full text-white/80 backdrop-blur-xs font-mono">
                    Point camera at parts or product barcode
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-2 border-l-2 border-blue-400 rounded-bl-sm" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-blue-400 rounded-br-sm" />
                </div>
              </div>

              {/* Flip camera button */}
              <button
                type="button"
                onClick={toggleFacingMode}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full backdrop-blur-sm z-20"
                title="Switch Camera"
              >
                <span className="material-symbols-outlined text-[20px]">cameraswitch</span>
              </button>
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Shutter Controls */}
        <div className="p-4 bg-[#191b23] border-t border-white/10 flex flex-col gap-3 shrink-0">
          {!cameraError && (
            <div className="flex items-center justify-center gap-6">
              {/* Upload photo button */}
              <label className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[22px]">upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Main Big Shutter Button */}
              <button
                onClick={takeSnapshot}
                className="w-16 h-16 rounded-full bg-white p-1.5 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg ring-4 ring-white/30"
              >
                <div className="w-full h-full rounded-full bg-[#004ac6] border-2 border-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                </div>
              </button>

              {/* Retake / Retry */}
              <button
                onClick={startCamera}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                title="Restart Camera"
              >
                <span className="material-symbols-outlined text-[22px]">refresh</span>
              </button>
            </div>
          )}

          {/* Quick preset selector */}
          <div className="pt-2 border-t border-white/10">
            <p className="text-[11px] text-white/60 mb-1.5 text-center">
              Or pick from sample inventory snapshots:
            </p>
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
              {SAMPLE_PHOTOS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(sample.url)}
                  className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 hover:border-blue-400 shrink-0 transition-all active:scale-95 relative group"
                  title={sample.name}
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
