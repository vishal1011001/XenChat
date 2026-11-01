import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export function PfpPreview({ imageSrc, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((_, croppedArea) => {
    setCroppedAreaPixels(croppedArea);
  }, []);

  const getCroppedImg = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    const { width, height } = croppedAreaPixels;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      width,
      height,
      0,
      0,
      width,
      height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], "profile-picture.png", {
          type: "image/png",
        });
        resolve(file);
      }, "image/png");
    });
  };

  const handleSave = async () => {
    const file = await getCroppedImg();
    if (file) onCropComplete(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-[90vw] max-w-xl rounded-2xl bg-slate-900 p-4">
        <div className="relative h-105 w-full overflow-hidden rounded-xl">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-red-500"
          />

          <button
            onClick={handleSave}
            className="rounded-xl bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-500"
          >
            Set profile picture
          </button>
        </div>
      </div>
    </div>
  );
}