"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, X } from "lucide-react";
import CameraCapture from "./CameraCapture";
import Image from "next/image";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  imagePreview?: string | null;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export default function ImageUpload({
  onImageSelect,
  onImageRemove,
  imagePreview,
  accept = "image/jpeg,image/jpg,image/png,image/webp",
  maxSize = 5 * 1024 * 1024, // 5MB
  className = "",
}: ImageUploadProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (files && files[0]) {
        const file = files[0];

        // Validate file size
        if (file.size > maxSize) {
          alert(
            `File size must be less than ${Math.round(
              maxSize / (1024 * 1024)
            )}MB`
          );
          return;
        }

        // Validate file type
        const acceptedTypes = accept.split(",").map((type) => type.trim());
        if (!acceptedTypes.includes(file.type)) {
          alert("Please select a valid image file (JPEG, PNG, or WebP)");
          return;
        }

        onImageSelect(file);
      }
    },
    [onImageSelect, accept, maxSize]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect]
  );

  const openCamera = useCallback(() => {
    setIsCameraOpen(true);
  }, []);

  const closeCamera = useCallback(() => {
    setIsCameraOpen(false);
  }, []);

  const handleCameraCapture = useCallback(
    (file: File) => {
      onImageSelect(file);
      setIsCameraOpen(false);
    },
    [onImageSelect]
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {imagePreview ? (
        <div className="relative">
          <Image
            width={400}
            height={600}
            src={imagePreview}
            alt="Preview"
            className="w-full max-w-sm h-48 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onImageRemove}
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className="w-12 h-12 text-gray-400" />
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-200">
                Upload an image
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop or choose from your device
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <div className="relative">
                <Input
                  type="file"
                  accept={accept}
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button type="button" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>

              <div className="text-sm text-gray-400">or</div>

              <Button
                type="button"
                variant="outline"
                onClick={openCamera}
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
            </div>

            <p className="text-xs text-gray-400">
              Max file size: {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        </div>
      )}

      <CameraCapture
        isOpen={isCameraOpen}
        onCapture={handleCameraCapture}
        onClose={closeCamera}
      />
    </div>
  );
}
