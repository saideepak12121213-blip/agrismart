import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, AlertCircle, X } from 'lucide-react';

interface ImageDropzoneProps {
  selectedCrop: string;
  onCropChange: (crop: string) => void;
  onImageSelected: (file: File) => void;
  isAnalyzing: boolean;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  selectedCrop,
  onCropChange,
  onImageSelected,
  isAnalyzing,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cropOptions = [
    'Tomato',
    'Wheat',
    'Rice (Paddy)',
    'Maize (Corn)',
    'Potato',
    'Onion',
    'Chili / Pepper',
    'Cotton',
    'Sugarcane',
    'Groundnut (Peanut)',
    'Mustard',
    'Chickpea',
    'Banana',
    'Mango',
    'Citrus',
    'Grapes',
  ];

  const handleFile = (file: File) => {
    setErrorMsg(null);
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('Invalid file format. Please upload JPEG, PNG, or WebP images.');
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setErrorMsg('File size exceeds maximum 6 MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    onImageSelected(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearSelectedImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
          Step 1: Select Cultivated Crop
        </label>
        <select
          value={selectedCrop}
          onChange={(e) => onCropChange(e.target.value)}
          className="w-full bg-[#081d14] border border-emerald-800/60 rounded-xl px-4 py-2.5 text-sm text-emerald-200 focus:outline-none focus:border-emerald-500 transition-colors"
        >
          {cropOptions.map((crop) => (
            <option key={crop} value={crop} className="bg-[#0b1d15] text-emerald-200">
              {crop}
            </option>
          ))}
        </select>
      </div>

      <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
        Step 2: Upload Afflicted Leaf or Fruit Photo
      </label>

      {previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/50 bg-black/40">
          <img src={previewUrl} alt="Plant specimen preview" className="w-full h-64 object-cover" />
          <button
            onClick={clearSelectedImage}
            disabled={isAnalyzing}
            className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-3 bg-emerald-950/90 text-emerald-300 text-xs px-3 py-1.5 rounded-lg border border-emerald-600/40 font-medium">
            Specimen Loaded: Ready for Gemini Vision Analysis
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-emerald-400 bg-emerald-950/60 scale-[0.99]'
              : 'border-emerald-800/60 hover:border-emerald-500 bg-[#071911]/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h4 className="text-base font-bold text-white mb-1">Drag & Drop Plant Specimen</h4>
          <p className="text-xs text-slate-400 mb-4">
            Supports JPEG, PNG, WebP photos of leaves, stems, or fruits (Max 6MB).
          </p>

          <div className="flex items-center justify-center gap-3">
            <span className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-900/40 transition-colors inline-flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Browse Files
            </span>
            <span className="px-4 py-2 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-semibold hover:border-emerald-500 transition-colors inline-flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" /> Use Camera
            </span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mt-4 p-3 bg-rose-950/80 border border-rose-500/40 text-rose-300 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
