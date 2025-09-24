"use client"

import { useState, useCallback, useRef } from "react"
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
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      fileInputRef.current.value = ""
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
      const formData = new FormData()
      if (file) formData.append("file", file)
      const res = await axiosInstance.post("/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const resultData = {
        ...res.data.result,
        fileUrl: file ? URL.createObjectURL(file) : url,
      }

      localStorage.setItem("deepcheck-result", JSON.stringify(resultData))
      toast.success("Analysis Completed")
      router.push("/results")
    } catch (error) {
      console.error(error)
      const errorMessage =
        (error as any)?.response?.data?.error || (error as any)?.message || "Analysis failed"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFile = () => setFile(null)
  const isValid = file || url.trim()

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
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

      {/* File Drop Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent/20"
        }`}
        onClick={handleFileClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file || url ? (
          <div className="space-y-4">
            {uploadMode === "image" ? (
              <img
                src={file ? URL.createObjectURL(file) : url}
                alt="preview"
                className="mx-auto max-h-64 rounded-lg object-contain"
              />
            ) : (
              <video
                src={file ? URL.createObjectURL(file) : url}
                controls
                className="mx-auto max-h-64 rounded-lg"
              />
            )}
            <div className="flex items-center justify-center space-x-2">
              <span className="font-medium">{file?.name || url}</span>
              {file && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile()
                  }}
                  className="h-6 w-6 p-0 hover:bg-destructive/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                {uploadMode === "image" ? <ImageIcon className="h-8 w-8 text-primary" /> : <Video className="h-8 w-8 text-primary" />}
              </div>
            </div>
            <p className="text-lg font-medium mb-2">Drop your {uploadMode} here</p>
            <p className="text-muted-foreground mb-6">
              or click to select {uploadMode === "image" ? "an image" : "a video"}
            </p>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
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
          placeholder={uploadMode === "image" ? "https://example.com/image.jpg" : "https://example.com/video.mp4"}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            if (e.target.value.trim()) setFile(null)
          }}
          className="bg-background/50"
        />
      </div>

      {/* Submit Button */}
      <Button onClick={handleSubmit} disabled={!isValid || isLoading} className="w-full h-12 text-lg font-medium" size="lg">
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
