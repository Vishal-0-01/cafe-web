"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { addBusinessImage, deleteBusinessImage } from "@/lib/actions/admin";
import type { BusinessImage } from "@/types/database";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";

export default function ImageUploader({
  businessId,
  images,
}: {
  businessId: string;
  images: BusinessImage[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const path = `${businessId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;

      const { error: uploadError } = await supabase.storage
        .from("business-images")
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from("business-images").getPublicUrl(path);

      const formData = new FormData();
      formData.set("business_id", businessId);
      formData.set("url", publicUrl.publicUrl);
      formData.set("alt_text", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
      if (images.length === 0) formData.set("is_primary", "on");

      startTransition(() => {
        addBusinessImage(formData);
      });
    } catch (err: any) {
      setError(err.message ?? "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-line/20">
            <Image src={img.url} alt={img.alt_text} fill className="object-cover" sizes="120px" />
            {img.is_primary && (
              <span className="absolute left-1 top-1 rounded-full bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold">
                Primary
              </span>
            )}
            <form action={deleteBusinessImage} className="absolute right-1 top-1">
              <input type="hidden" name="image_id" value={img.id} />
              <input type="hidden" name="business_id" value={businessId} />
              <button
                type="submit"
                aria-label="Delete image"
                className="grid h-6 w-6 place-items-center rounded-full bg-white/90 text-red-600 opacity-0 transition group-hover:opacity-100"
              >
                <Trash2 size={12} />
              </button>
            </form>
          </div>
        ))}

        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line text-ink/40 transition hover:border-brand-400 hover:text-brand-600">
          <Upload size={18} aria-hidden />
          <span className="text-xs">{uploading || isPending ? "Uploading…" : "Add photo"}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={handleFileChange}
            disabled={uploading || isPending}
          />
        </label>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
