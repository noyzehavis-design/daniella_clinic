"use client";
import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";

async function getCroppedImg(imageSrc: string, pixelCrop: Area, rotation = 0): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const radians = (rotation * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  const rotatedW = Math.round(image.width * cos + image.height * sin);
  const rotatedH = Math.round(image.width * sin + image.height * cos);

  canvas.width = rotatedW;
  canvas.height = rotatedH;
  ctx.translate(rotatedW / 2, rotatedH / 2);
  ctx.rotate(radians);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;
  const croppedCtx = croppedCanvas.getContext("2d")!;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return croppedCanvas.toDataURL("image/png");
}

interface Props {
  src: string;
  onConfirm: (croppedBase64: string) => void;
  onCancel: () => void;
}

export default function ImageEditorModal({ src, onConfirm, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    const result = await getCroppedImg(src, croppedAreaPixels, rotation);
    onConfirm(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" dir="rtl">
      <div
        className="relative flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "#141E28", border: "1px solid rgba(74,191,191,0.3)", width: "min(560px, 95vw)" }}
      >
        <div className="px-5 py-4 border-b border-slate-700/60 flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm">עריכת תמונה</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white text-lg leading-none transition-colors">✕</button>
        </div>

        {/* Crop area */}
        <div className="relative w-full" style={{ height: 340, backgroundColor: "#0F1923" }}>
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-400 w-12 shrink-0">זום</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="flex-1 accent-teal-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-400 w-12 shrink-0">סיבוב</label>
            <button
              onClick={() => setRotation(r => r - 90)}
              className="px-3 py-1 text-xs rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            >↺ -90°</button>
            <button
              onClick={() => setRotation(r => r + 90)}
              className="px-3 py-1 text-xs rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            >↻ +90°</button>
            <span className="text-xs text-slate-500">{rotation}°</span>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            ביטול
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 text-sm rounded-lg bg-teal-500 hover:bg-teal-400 text-white font-semibold shadow-md shadow-teal-500/20 transition-colors"
          >
            אישור
          </button>
        </div>
      </div>
    </div>
  );
}
