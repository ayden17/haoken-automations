"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { readImageFile } from "@/lib/read-image";

export function ImagePicker({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [error, setError] = useState("");

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-3">
        {value ? (
          <img alt="" className="size-16 rounded-lg object-cover" src={value} />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground text-xs">
            Foto
          </div>
        )}
        <input
          accept="image/*"
          className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-2.5 file:py-1.5 file:text-sm"
          id={id}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            try {
              onChange(await readImageFile(file));
              setError("");
            } catch {
              setError("That image could not be used.");
            }
          }}
          type="file"
        />
      </div>
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
    </div>
  );
}
