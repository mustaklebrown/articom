"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  UploadCloud,
  X,
  Loader2,
  CheckCircle2,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspectRatio?: "square" | "banner";
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "products",
  label = "Image",
  aspectRatio = "square",
  className = "",
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [customUrl, setCustomUrl] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image valide.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse (maximum 10 Mo).");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload/cloudinary", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'upload de l'image");
      }

      onChange(data.url);
      setCustomUrl(data.url);
      toast.success(
        data.provider === "cloudinary"
          ? "Image téléversée avec succès sur Cloudinary !"
          : "Image téléversée avec succès sur Neon Object Storage !"
      );
    } catch (err: any) {
      toast.error(err.message || "Impossible de téléverser l'image");
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }

  function handleUrlSubmit() {
    if (!customUrl.trim()) {
      toast.error("Veuillez saisir une URL valide.");
      return;
    }
    onChange(customUrl.trim());
    toast.success("URL de l'image appliquée !");
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#0F2C4C] flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5 text-[#D96B27]" />
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsUrlMode(!isUrlMode)}
          className="text-[11px] font-bold text-[#D96B27] hover:underline flex items-center gap-1"
        >
          <LinkIcon className="h-3 w-3" />
          {isUrlMode ? "Mode Fichier / Glisser-déposer" : "Saisir une URL directe"}
        </button>
      </div>

      {isUrlMode ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/... ou /images/..."
            className="flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-[#0F2C4C] focus:border-[#D96B27] focus:outline-hidden"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-3.5 py-2 rounded-xl bg-[#0F2C4C] text-white text-xs font-bold hover:bg-[#183e68]"
          >
            Appliquer
          </button>
        </div>
      ) : value ? (
        /* Preview de l'image chargée */
        <div className="relative rounded-2xl border border-stone-200 bg-stone-50 overflow-hidden group">
          <div
            className={`relative w-full ${
              aspectRatio === "banner" ? "h-36 sm:h-44" : "h-48 sm:h-56"
            }`}
          >
            <Image
              src={value}
              alt="Aperçu"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white text-[#0F2C4C] text-xs font-bold shadow-md hover:bg-[#F8F8F6]"
            >
              Remplacer
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setCustomUrl("");
              }}
              className="p-1.5 rounded-xl bg-rose-600 text-white shadow-md hover:bg-rose-700"
              title="Supprimer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Zone de Glisser-Déposer */
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-stone-300 hover:border-[#D96B27] hover:bg-[#D96B27]/5 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            aspectRatio === "banner" ? "h-32" : "h-44"
          }`}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-stone-500">
              <Loader2 className="h-8 w-8 text-[#D96B27] animate-spin" />
              <span className="text-xs font-medium">Téléversement en cours...</span>
            </div>
          ) : (
            <>
              <div className="h-10 w-10 rounded-xl bg-[#0F2C4C]/5 text-[#D96B27] flex items-center justify-center">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-[#0F2C4C]">
                  Cliquez ou glissez-déposez une image ici
                </p>
                <p className="text-[11px] text-stone-400">
                  PNG, JPG, WEBP jusqu&apos;à 10 Mo (Cloudinary ou Neon)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
        className="hidden"
      />
    </div>
  );
}
