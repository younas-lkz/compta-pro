import React, { useRef, useState } from "react";

interface UploadZoneProps {
  onFile: (file: File) => void;
  isLoading: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFile,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full max-w-xl mx-auto border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-colors
        ${isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !isLoading && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleChange}
        disabled={isLoading}
      />
      <div className="text-5xl mb-4">📊</div>
      {isLoading ? (
        <p className="text-indigo-600 font-medium animate-pulse">
          Analyse en cours…
        </p>
      ) : (
        <>
          <p className="text-lg font-semibold text-gray-700 mb-1">
            Glissez votre export CSV Qonto ici
          </p>
          <p className="text-sm text-gray-400">
            ou cliquez pour sélectionner un fichier
          </p>
        </>
      )}
    </div>
  );
};
