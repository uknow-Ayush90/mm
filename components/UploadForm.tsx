"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, ImageIcon, Video } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { TAGS } from "@/lib/tags";
import { cn } from "@/lib/utils";

export default function UploadForm() {
  const router = useRouter();
  const { user, setShowOnboarding } = useUser();
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) {
    const isImage = f.type.startsWith("image/");
    const isVideo = f.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Sirf images aur videos allowed hain!");
      return;
    }
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (f.size > maxSize) {
      toast.error(isVideo ? "Video 50MB se badi nahi honi chahiye" : "Image 10MB se badi nahi honi chahiye");
      return;
    }
    setFile(f);
    setFileType(isImage ? "image" : "video");
    setPreview(URL.createObjectURL(f));
  }

  function clearFile(e: React.MouseEvent) {
    e.stopPropagation();
    setPreview(null);
    setFile(null);
    setFileType(null);
  }

  function toggleTag(slug: string) {
    setSelectedTags((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { setShowOnboarding(true); return; }
    if (!file || !title.trim()) {
      toast.error("Title aur file dono zaroori hain!");
      return;
    }

    setUploading(true);
    try {
      const sigRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-user-id": user.id },
      });
      const { cloudName, uploadPreset } = await sigRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      // Image ya video — Cloudinary endpoint alag hai
      const resourceType = fileType === "video" ? "video" : "image";
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        { method: "POST", body: formData }
      );
      const uploadData = await uploadRes.json();

      if (!uploadData.secure_url) throw new Error("Upload failed");

      const memeRes = await fetch("/api/memes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          title: title.trim(),
          imageUrl: uploadData.secure_url,
          publicId: uploadData.public_id,
          tagSlugs: selectedTags,
        }),
      });

      if (!memeRes.ok) throw new Error("Meme create failed");
      const meme = await memeRes.json();

      toast.success("Upload ho gaya! 🔥");
      router.push(`/meme/${meme.id}`);
    } catch {
      toast.error("Upload fail ho gaya, try again!");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Drop Zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        className={cn(
          "relative border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center overflow-hidden",
          isDragging ? "border-[#7c3aed] bg-[#7c3aed]/5" : "border-[#222222] hover:border-[#333333]",
          preview ? "min-h-[300px]" : "min-h-[200px]"
        )}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {preview ? (
          <>
            {fileType === "video" ? (
              <video
                src={preview}
                controls
                className="max-h-[400px] rounded-lg w-full"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Preview" className="max-h-[400px] object-contain rounded-lg" />
            )}
            <button
              type="button"
              onClick={clearFile}
              className="absolute top-3 right-3 bg-[#0a0a0a]/90 hover:bg-red-500 text-white rounded-full p-1.5 transition-colors"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#111111] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="flex gap-2">
                <ImageIcon size={20} className="text-[#7c3aed]" />
                <Video size={20} className="text-[#7c3aed]" />
              </div>
            </div>
            <p className="text-white font-medium">Meme yahan drop karo</p>
            <p className="text-[#9ca3af] text-sm mt-1">ya click karo to browse</p>
            <p className="text-[#6b7280] text-xs mt-2">Images (PNG, JPG, GIF) up to 10MB · Videos (MP4) up to 50MB</p>
          </div>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-[#d1d5db] mb-2">
          Caption / Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Yeh meme dekh ke toh..."
          maxLength={120}
          className="w-full bg-[#111111] border border-[#222222] rounded-lg px-4 py-3 text-white placeholder-[#6b7280] focus:outline-none focus:border-[#7c3aed] transition-colors"
          required
        />
        <p className="text-xs text-[#6b7280] mt-1 text-right">{title.length}/120</p>
      </div>

      {/* Tags */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-[#d1d5db] mb-2">
          Tags (optional, max 3)
        </label>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => {
            const selected = selectedTags.includes(tag.slug);
            const maxReached = selectedTags.length >= 3 && !selected;
            return (
              <button
                key={tag.slug}
                type="button"
                disabled={maxReached}
                onClick={() => toggleTag(tag.slug)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  selected
                    ? "bg-[#7c3aed] text-white"
                    : maxReached
                    ? "bg-[#111111] text-[#333333] cursor-not-allowed"
                    : "bg-[#111111] text-[#9ca3af] hover:bg-[#222222] hover:text-white"
                )}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={uploading || !file || !title.trim()}
        className="w-full flex items-center justify-center gap-3 bg-[#7c3aed] hover:bg-[#8b5cf6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-base"
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload size={18} />
            Upload Karo
          </>
        )}
      </button>
    </form>
  );
}
