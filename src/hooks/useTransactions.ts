import { useState, useCallback } from "react";
import type { Transaction } from "../domain/transaction";
import { parseQontoCsv } from "../services/csvParser";

export type LoadingState = "idle" | "parsing" | "ready" | "error";

export interface UseTransactionsResult {
  transactions: Transaction[];
  loadingState: LoadingState;
  errors: string[];
  fileName: string;
  handleFile: (file: File) => Promise<void>;
  reset: () => void;
}

export const useTransactions = (): UseTransactionsResult => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const handleFile = useCallback(async (file: File) => {
    setLoadingState("parsing");
    setFileName(file.name);
    setErrors([]);

    const result = await parseQontoCsv(file);

    if (result.transactions.length === 0) {
      setLoadingState("error");
      setErrors(
        result.errors.length > 0
          ? result.errors
          : ["Aucune transaction trouvée dans le fichier."],
      );
    } else {
      setTransactions(result.transactions);
      setErrors(result.errors);
      setLoadingState("ready");
    }
  }, []);

  const reset = useCallback(() => {
    setTransactions([]);
    setLoadingState("idle");
    setErrors([]);
    setFileName("");
  }, []);

  return { transactions, loadingState, errors, fileName, handleFile, reset };
};
