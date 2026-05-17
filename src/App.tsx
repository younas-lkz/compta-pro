import React from "react";
import { useTransactions } from "./hooks/useTransactions";
import { UploadZone } from "./components/UploadZone";
import { Dashboard } from "./components/Dashboard";

const App: React.FC = () => {
  const { transactions, loadingState, errors, fileName, handleFile, reset } =
    useTransactions();

  if (loadingState === "ready") {
    return (
      <Dashboard
        transactions={transactions}
        fileName={fileName}
        onReset={reset}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">💼 Compta Pro</h1>
        <p className="text-gray-500">
          Visualisez votre situation financière depuis votre export Qonto
        </p>
      </div>

      <UploadZone onFile={handleFile} isLoading={loadingState === "parsing"} />

      {errors.length > 0 && (
        <div className="mt-6 max-w-xl w-full bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-700 font-semibold mb-1">
            Erreur lors de l'analyse :
          </p>
          <ul className="text-sm text-red-600 space-y-1">
            {errors.map((err, i) => (
              <li key={i}>• {err}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
