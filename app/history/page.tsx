"use client";

import { useState, useMemo } from "react";
import { CalculationHistory } from "@/types";
import { historyStorage } from "@/lib/storage";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";

type SortField = "createdAt" | "instrumentName" | "besaranYangDiukur";
type SortDirection = "asc" | "desc";

export default function HistoryPage() {
  const [history, setHistory] = useState<CalculationHistory[]>(
    historyStorage.getAll()
  );
  const [filterInstrument, setFilterInstrument] = useState("");
  const [filterBesaran, setFilterBesaran] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus perhitungan ini?")) {
      historyStorage.delete(id);
      setHistory(historyStorage.getAll());
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedHistory = useMemo(() => {
    let filtered = [...history];

    // Apply filters
    if (filterInstrument) {
      filtered = filtered.filter((entry) =>
        entry.instrumentName
          .toLowerCase()
          .includes(filterInstrument.toLowerCase())
      );
    }

    if (filterBesaran) {
      filtered = filtered.filter((entry) =>
        entry.besaranYangDiukur
          .toLowerCase()
          .includes(filterBesaran.toLowerCase())
      );
    }

    if (filterDateFrom) {
      const fromDate = new Date(filterDateFrom);
      filtered = filtered.filter(
        (entry) => new Date(entry.createdAt) >= fromDate
      );
    }

    if (filterDateTo) {
      const toDate = new Date(filterDateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(
        (entry) => new Date(entry.createdAt) <= toDate
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0;

      switch (sortField) {
        case "createdAt":
          compareValue =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "instrumentName":
          compareValue = a.instrumentName.localeCompare(b.instrumentName);
          break;
        case "besaranYangDiukur":
          compareValue = a.besaranYangDiukur.localeCompare(b.besaranYangDiukur);
          break;
      }

      return sortDirection === "asc" ? compareValue : -compareValue;
    });

    return filtered;
  }, [
    history,
    filterInstrument,
    filterBesaran,
    filterDateFrom,
    filterDateTo,
    sortField,
    sortDirection,
  ]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  const formatNumber = (num: number, decimals: number = 6): string => {
    return num.toFixed(decimals);
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Riwayat Perhitungan</h1>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nama Instrumen
            </label>
            <input
              type="text"
              value={filterInstrument}
              onChange={(e) => setFilterInstrument(e.target.value)}
              placeholder="Cari instrumen..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Besaran yang Diukur
            </label>
            <input
              type="text"
              value={filterBesaran}
              onChange={(e) => setFilterBesaran(e.target.value)}
              placeholder="Cari besaran..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Tanggal Dari
            </label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Tanggal Sampai
            </label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>
        </div>
        {(filterInstrument ||
          filterBesaran ||
          filterDateFrom ||
          filterDateTo) && (
          <button
            onClick={() => {
              setFilterInstrument("");
              setFilterBesaran("");
              setFilterDateFrom("");
              setFilterDateTo("");
            }}
            className="mt-4 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Menampilkan {filteredAndSortedHistory.length} dari {history.length}{" "}
        perhitungan
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr>
                <th
                  className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800"
                  onClick={() => handleSort("createdAt")}
                >
                  Tanggal
                  <SortIcon field="createdAt" />
                </th>
                <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left">
                  Scope
                </th>
                <th
                  className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800"
                  onClick={() => handleSort("besaranYangDiukur")}
                >
                  Besaran yang Diukur
                  <SortIcon field="besaranYangDiukur" />
                </th>
                <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left">
                  Jenis Alat
                </th>
                <th
                  className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800"
                  onClick={() => handleSort("instrumentName")}
                >
                  Instrumen
                  <SortIcon field="instrumentName" />
                </th>
                <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left">
                  Rentang Ukur
                </th>
                <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right">
                  CMC
                </th>
                <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right">
                  Expanded Uncertainty
                </th>
                <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right">
                  Ketidakpastian Akhir
                </th>
                <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedHistory.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="border border-gray-300 dark:border-gray-700 px-3 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Tidak ada riwayat perhitungan
                  </td>
                </tr>
              ) : (
                filteredAndSortedHistory.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                      {formatDate(entry.createdAt)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                      {entry.scope}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                      {entry.besaranYangDiukur}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                      {entry.jenisAlat}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                      <div className="font-medium">{entry.instrumentName}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {entry.instrumentBrand} - {entry.instrumentType}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        S/N: {entry.instrumentSerial}
                      </div>
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                      {entry.measurementRange}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right">
                      {formatNumber(entry.cmc)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right">
                      {formatNumber(entry.results.expandedUncertainty)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right font-semibold">
                      {formatNumber(entry.finalUncertainty)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-center">
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                        aria-label="Hapus perhitungan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
