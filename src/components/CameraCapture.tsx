"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, RotateCcw, Check } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function CameraCapture({
  onCapture,
  onClose,
  isOpen,
}: CameraCaptureProps) {
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<
    "pending" | "granted" | "denied"
  >("pending");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );

  const videoRef = useRef<HTMLVideoElement>(null);

  // Request camera permission and start stream when isOpen is true
  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      setCameraPermission("pending");

      if (!cameraStream) {
        // Check if browser supports camera access
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("Camera not supported in this browser");
          setErrorMessage(
            "Camera is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari."
          );
          setCameraPermission("denied");
          return;
        }

        // Check if running in secure context (HTTPS or localhost)
        if (!window.isSecureContext) {
          console.error("Camera requires secure context (HTTPS)");
          setErrorMessage(
            "Camera access requires a secure connection (HTTPS). Please access the site via HTTPS or localhost."
          );
          setCameraPermission("denied");
          return;
        }

        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: facingMode } })
          .then((stream) => {
            setCameraPermission("granted");
            setCameraStream(stream);
            setErrorMessage("");
          })
          .catch((error) => {
            console.error("Camera access error:", error);
            let message =
              "Camera access denied. Please allow camera permissions in your browser.";

            if (error.name === "NotFoundError") {
              message = "No camera found on this device.";
            } else if (error.name === "NotAllowedError") {
              message =
                "Camera access denied. Please allow camera permissions and refresh the page.";
            } else if (error.name === "NotReadableError") {
              message = "Camera is already in use by another application.";
            }

            setErrorMessage(message);
            setCameraPermission("denied");
          });
      }
    }

    // Stop camera when closing
    return () => {
      if (!isOpen && cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
    };
    // eslint-disable-next-line
  }, [isOpen, facingMode]);

  // Ensure videoRef always gets the stream when available
  useEffect(() => {
    if (
      isOpen &&
      cameraPermission === "granted" &&
      cameraStream &&
      videoRef.current
    ) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play();
    }
  }, [cameraStream, isOpen, cameraPermission]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL("image/png"));
    }
  }, []);

  const confirmCapture = useCallback(() => {
    if (!capturedImage) return;

    // Create canvas from captured image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
              type: "image/jpeg",
            });
            onCapture(file);
            handleClose();
          }
        },
        "image/jpeg",
        0.8
      );
    };

    img.src = capturedImage;
  }, [capturedImage, onCapture]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const handleToggleCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, [cameraStream]);

  const handleClose = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setCapturedImage(null);
    setCameraPermission("pending");
    setErrorMessage("");
    onClose();
  }, [cameraStream, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-full h-full max-w-4xl max-h-screen bg-black rounded-lg overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4 flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold">Camera</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Camera View */}
        <div className="relative w-full h-full flex items-center justify-center">
          {cameraPermission === "pending" && (
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Requesting camera permission...</p>
            </div>
          )}

          {cameraPermission === "denied" && (
            <div className="text-center text-white p-8">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-4">Camera Unavailable</p>
              <p className="text-sm text-gray-300 max-w-md">
                {errorMessage ||
                  "Please allow camera access in your browser settings."}
              </p>
            </div>
          )}

          {cameraPermission === "granted" && !capturedImage && (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
          )}

          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Controls */}
        {cameraPermission === "granted" && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-6">
            {capturedImage ? (
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={retakePhoto}
                  variant="outline"
                  size="lg"
                  className="text-white border-white hover:bg-white hover:text-black"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Retake
                </Button>
                <Button
                  onClick={confirmCapture}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Use Photo
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <Button
                  onClick={handleToggleCamera}
                  variant="outline"
                  size="sm"
                  className="text-white border-white hover:bg-white hover:text-black"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Flip
                </Button>
                <Button
                  onClick={capturePhoto}
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 rounded-full w-16 h-16 p-0"
                >
                  <div className="w-12 h-12 bg-white rounded-full border-4 border-gray-300"></div>
                </Button>
                <div className="w-16"></div> {/* Spacer for centering */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
