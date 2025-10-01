"use client";
import { useState } from "react";

export default function DogPhotoUploader() {
  const [file, setFile] = useState<File | null>(null);

  async function handleUpload() {
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    ).then(r => r.json());

    alert("Uploaded! URL: " + res.secure_url);
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
