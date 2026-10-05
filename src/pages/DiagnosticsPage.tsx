import React, { useState } from 'react';
import { useAnalyzeCrop } from '../api/hooks';
import { ImageDropzone } from '../components/diagnostics/ImageDropzone';
import { DiagnosisResultView } from '../components/diagnostics/DiagnosisResultView';
import { TreatmentTabs } from '../components/diagnostics/TreatmentTabs';
import { PreventiveChecklist } from '../components/diagnostics/PreventiveChecklist';
import { Scan, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { DiseaseDiagnostic } from '@shared/types';

interface DiagnosticsPageProps {
  activeFarmId: string;
}

export const DiagnosticsPage: React.FC<DiagnosticsPageProps> = ({ activeFarmId }) => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<DiseaseDiagnostic | null>(null);

  const analyzeMutation = useAnalyzeCrop();

  const handleRunAnalysis = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('farm_id', activeFarmId);
    formData.append('crop_name', selectedCrop);

    analyzeMutation.mutate(formData, {
      onSuccess: (data) => {
        setDiagnosticResult(data);
      },
    });
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Scan className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Multimodal Crop Pathology Scanner</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Upload leaf, fruit, or stem photos for instant Gemini Vision AI diagnosis, confidence triage, and Pre-Harvest Interval (PHI) treatment protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload Column */}
        <div className="lg:col-span-5 space-y-4">
          <ImageDropzone
            selectedCrop={selectedCrop}
            onCropChange={setSelectedCrop}
            onImageSelected={setSelectedFile}
            isAnalyzing={analyzeMutation.isPending}
          />

          <button
            onClick={handleRunAnalysis}
            disabled={!selectedFile || analyzeMutation.isPending}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-xl shadow-emerald-900/50 transition-all flex items-center justify-center gap-2"
          >
            {analyzeMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running Gemini Vision Triage...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-emerald-200" />
                <span>Analyze Specimen with Vision AI</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-6">
          {diagnosticResult ? (
            <>
              <DiagnosisResultView diagnostic={diagnosticResult} />
              <TreatmentTabs
                organicTreatments={diagnosticResult.organic_treatments}
                chemicalTreatments={diagnosticResult.chemical_treatments}
              />
              <PreventiveChecklist measures={diagnosticResult.preventive_measures} />
            </>
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center border border-dashed border-emerald-900/60 h-full flex flex-col items-center justify-center">
              <Scan className="w-14 h-14 text-emerald-500/30 mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Awaiting Specimen Upload</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Select your crop type and upload a clear plant specimen photo. Dr. Agro Vision AI will analyze foliar chlorosis, lesions, and pathogen severity.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
