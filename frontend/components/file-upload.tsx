"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LinkIcon, X, FileImage, FileVideo, ImageIcon, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosInstance from "@/utils/axiosInstance"
import { toast } from "sonner"

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadMode, setUploadMode] = useState<"image" | "video">("image")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const router = useRouter()

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Clean up preview URL when file changes or component unmounts
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      return () => {
        URL.revokeObjectURL(objectUrl)
      }
    } else {
      setPreviewUrl(null)
    }
  }, [file])

  // If user enters a URL, show it as preview (for images/videos)
  useEffect(() => {
    if (!file && url.trim()) {
      setPreviewUrl(url.trim())
    } else if (!file) {
      setPreviewUrl(null)
    }
  }, [url, file])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) {
        const isValidType =
          uploadMode === "image"
            ? droppedFile.type.startsWith("image/")
            : droppedFile.type.startsWith("video/")

        if (isValidType) {
          setFile(droppedFile)
          setUrl("")
        }
      }
    },
    [uploadMode],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUrl("")
    }
  }

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "" // reset so re-selecting same file works
      fileInputRef.current.click()
    }
  }

  const handleModeToggle = (mode: "image" | "video") => {
    setUploadMode(mode)
    setFile(null)
    setUrl("")
  }

  const handleSubmit = async () => {
    if (!file && !url) return

    setIsLoading(true)

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);

      }
      const res = await axiosInstance.post('/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Result",res)
      localStorage.setItem("deepcheck-result", JSON.stringify(res.data.result))
      localStorage.setItem("deepcheck-heatmap", JSON.stringify(res.data.heatmap))
      toast.success("Image Analysis Completed")
      router.push("/results")
    } catch (error) {
      console.log(error)
      // Show error message from axiosInstance if available, otherwise generic error
      const errorMessage =
        (error as any)?.response?.data?.error ||
        (error as any)?.message ||
        "An error occurred during analysis";
      toast.error(errorMessage);
    }
    // await new Promise((resolve) => setTimeout(resolve, 2000))

    // const mockResult = {
    //   type: file ? "file" : "url",
    //   name: file?.name || url,
    //   prediction: Math.random() > 0.5 ? "real" : "fake",
    //   confidence: Math.floor(Math.random() * 30) + 70,
    //   fileUrl: file ? URL.createObjectURL(file) : url,
    // }
  }

  const removeFile = () => {
    setFile(null)
    setPreviewUrl(null)
  }

  const isValid = file || url.trim()

  // Helper to determine if a string is an image or video url
  function isImageUrl(str: string) {
    return /\.(jpe?g|png|gif|bmp|webp)$/i.test(str)
  }
  function isVideoUrl(str: string) {
    return /\.(mp4|mov|avi|mkv|webm)$/i.test(str)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="flex bg-background/20 rounded-lg p-1 border border-border">
          <Button
            variant={uploadMode === "image" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleModeToggle("image")}
            className={`flex items-center gap-2 px-4 ${
              uploadMode === "image"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            Images
          </Button>
          <Button
            variant={uploadMode === "video" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleModeToggle("video")}
            className={`flex items-center gap-2 px-4 ${
              uploadMode === "video"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Video className="h-4 w-4" />
            Videos
          </Button>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5 drag-over"
            : "border-border hover:border-primary/50 hover:bg-accent/20"
        }`}
        onClick={handleFileClick} // ✅ Clicking anywhere opens explorer
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file || (previewUrl && url.trim()) ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              {file ? (
                file.type.startsWith("image/") ? (
                  <FileImage className="h-8 w-8 text-primary" />
                ) : (
                  <FileVideo className="h-8 w-8 text-primary" />
                )
              ) : (
                uploadMode === "image" ? (
                  <FileImage className="h-8 w-8 text-primary" />
                ) : (
                  <FileVideo className="h-8 w-8 text-primary" />
                )
              )}
              <span className="font-medium">
                {file ? file.name : url}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation() // ✅ prevent explorer when removing
                  removeFile()
                  setUrl("")
                }}
                className="h-6 w-6 p-0 hover:bg-destructive/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {file
                ? `File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`
                : null}
            </p>
            {/* Preview */}
            {previewUrl && (
              <div className="flex justify-center">
                {uploadMode === "image" && isImageUrl(previewUrl) ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 max-w-full rounded-lg border border-border shadow"
                    style={{ objectFit: "contain" }}
                  />
                ) : uploadMode === "video" && isVideoUrl(previewUrl) ? (
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-64 max-w-full rounded-lg border border-border shadow"
                    style={{ objectFit: "contain" }}
                  />
                ) : uploadMode === "image" && file && file.type.startsWith("image/") ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 max-w-full rounded-lg border border-border shadow"
                    style={{ objectFit: "contain" }}
                  />
                ) : uploadMode === "video" && file && file.type.startsWith("video/") ? (
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-64 max-w-full rounded-lg border border-border shadow"
                    style={{ objectFit: "contain" }}
                  />
                ) : null}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                {uploadMode === "image" ? (
                  <ImageIcon className="h-8 w-8 text-primary" />
                ) : (
                  <Video className="h-8 w-8 text-primary" />
                )}
              </div>
            </div>
            <div>
              <p className="text-lg font-medium mb-2">Drop your {uploadMode} here</p>
              <p className="text-muted-foreground mb-6">
                or click to select {uploadMode === "image" ? "an image" : "a video"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden input (outside of drop area) */}
      <input
        ref={fileInputRef}
        type="file"
        accept={uploadMode === "image" ? "image/*" : "video/*"}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="url-input" className="flex items-center space-x-2">
          <LinkIcon className="h-4 w-4" />
          <span>Or paste a {uploadMode} URL</span>
        </Label>
        <Input
          id="url-input"
          type="url"
          placeholder={
            uploadMode === "image"
              ? "https://example.com/image.jpg"
              : "https://example.com/video.mp4"
          }
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            if (e.target.value.trim()) {
              setFile(null)
            }
          }}
          className="bg-background/50"
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!isValid || isLoading}
        className="w-full h-12 text-lg font-medium"
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Analyzing...</span>
          </div>
        ) : (
          "Analyze for Deepfakes"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        {uploadMode === "image"
          ? "Supported formats: JPG, PNG, GIF (max 50MB)"
          : "Supported formats: MP4, MOV, AVI (max 50MB)"}
      </p>
    </div>
  )
}
