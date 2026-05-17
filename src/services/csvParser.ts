import Papa from "papaparse";
import type { Transaction, VatBreakdown } from "../domain/transaction";

/** Parses a French-formatted number string ("1 234,56" or "-1,18") to a float. */
const parseEuropeanNumber = (value: string | undefined): number => {
  if (!value || value.trim() === "") return 0;
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  return parseFloat(normalized) || 0;
};

/** Parses a DD-MM-YYYY HH:mm:ss date string to a Date object. */
const parseQontoDate = (value: string): Date => {
  if (!value) return new Date(0);
  const [datePart, timePart] = value.split(" ");
  const [day, month, year] = datePart.split("-");
  return new Date(`${year}-${month}-${day}T${timePart ?? "00:00:00"}Z`);
};

/**
 * Finds a column value by partial, case-insensitive key matching.
 * This handles minor variations in Qonto CSV column names across exports.
 */
const findColumn = (row: Record<string, string>, ...fragments: string[]): string => {
  const key = Object.keys(row).find((k) =>
    fragments.every((f) => k.toLowerCase().includes(f.toLowerCase()))
  );
  return key ? (row[key] ?? "") : "";
};

const buildVatBreakdown = (row: Record<string, string>): VatBreakdown => ({
  rate0: {
    vat: parseEuropeanNumber(findColumn(row, "TVA", "0.0")),
    amountExcl: parseEuropeanNumber(findColumn(row, "HT", "0.0")),
  },
  rate5_5: {
    vat: parseEuropeanNumber(findColumn(row, "TVA", "5.5")),
    amountExcl: parseEuropeanNumber(findColumn(row, "HT", "5.5")),
  },
  rate10: {
    vat: parseEuropeanNumber(findColumn(row, "TVA", "10.0")),
    amountExcl: parseEuropeanNumber(findColumn(row, "HT", "10.0")),
  },
  rate20: {
    vat: parseEuropeanNumber(findColumn(row, "TVA", "20.0")),
    amountExcl: parseEuropeanNumber(findColumn(row, "HT", "20.0")),
  },
});


const mapRowToTransaction = (row: Record<string, string>): Transaction => ({
  status: row["Statut"] as Transaction["status"],
  valueDateUtc: parseQontoDate(row["Date de la valeur (UTC)"]),
  operationDateUtc: parseQontoDate(row["Date de l'opération (UTC)"]),
  amountTtc: parseEuropeanNumber(row["Montant total (TTC)"]),
  debit: row["Débit"] ? parseEuropeanNumber(row["Débit"]) : null,
  credit: row["Crédit"] ? parseEuropeanNumber(row["Crédit"]) : null,
  balance: parseEuropeanNumber(row["Solde"]),
  currency: row["Devise"] ?? "EUR",
  totalVat: parseEuropeanNumber(row["Montant total de la TVA"]),
  totalAmountExcl: parseEuropeanNumber(row["Montant total (HT)"]),
  vat: buildVatBreakdown(row),
  accountName: row["Nom du compte"] ?? "",
  counterpartName: row["Nom de la contrepartie"] ?? "",
  counterpartIban: row["IBAN de la contrepartie"] ?? "",
  paymentMethod: row["Méthode de paiement"] ?? "",
  cardName: row["Nom de la carte"] ?? "",
  receiptFilename: row["Justificatif"] ?? "",
  receiptRequired: row["Justificatif requis"] === "TRUE",
  receiptLost: row["Justificatif perdu"] === "TRUE",
  note: row["Note"] ?? "",
  bank: row["Banque"] ?? "",
  cashFlowCategory: row["Catégorie de trésorerie"] ?? "",
  cashFlowSubcategory: row["Sous-catégorie de trésorerie"] ?? "",
});

export interface ParseResult {
  transactions: Transaction[];
  errors: string[];
}

export const parseQontoCsv = (file: File): Promise<ParseResult> =>
  new Promise((resolve) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors = results.errors.map((e) => e.message);
        const transactions = results.data.map(mapRowToTransaction);
        resolve({ transactions, errors });
      },
      error: (error) => {
        resolve({ transactions: [], errors: [error.message] });
      },
    });
  });
