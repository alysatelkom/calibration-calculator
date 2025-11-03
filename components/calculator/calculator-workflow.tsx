"use client";

import { useState, useMemo } from "react";
import { Instrument, MeasurementQuantity, MeasurementRange } from "@/types";
import { ChevronRight } from "lucide-react";

interface CalculatorWorkflowProps {
  instruments: Instrument[];
  onShow: (quantity: string, range: string) => void;
}

export function CalculatorWorkflow({
  instruments,
  onShow,
}: CalculatorWorkflowProps) {
  const [selectedQuantity, setSelectedQuantity] = useState<string>("");
  const [selectedRange, setSelectedRange] = useState<string>("");

  // Extract all unique measurement quantities from all instruments
  const availableQuantities = useMemo(() => {
    const quantities = new Set<string>();
    instruments.forEach((instrument) => {
      instrument.measurementQuantities.forEach((q) => {
        quantities.add(q.name);
      });
    });
    return Array.from(quantities).sort();
  }, [instruments]);

  // Get ranges for the selected quantity
  const availableRanges = useMemo(() => {
    if (!selectedQuantity) return [];
    const ranges = new Set<string>();
    instruments.forEach((instrument) => {
      instrument.measurementQuantities.forEach((q) => {
        if (q.name === selectedQuantity) {
          q.ranges.forEach((r) => {
            ranges.add(r.range);
          });
        }
      });
    });
    return Array.from(ranges).sort();
  }, [instruments, selectedQuantity]);

  const handleShow = () => {
    if (selectedQuantity && selectedRange) {
      onShow(selectedQuantity, selectedRange);
    }
  };

  if (instruments.length === 0) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <p className="text-yellow-800 dark:text-yellow-200">
          Belum ada instrumen dalam database. Silakan tambahkan instrumen
          terlebih dahulu di halaman{" "}
          <a href="/database" className="font-semibold underline">
            Database Instrumen
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">
          Pilih Besaran Ukur dan Rentang Ukur
        </h2>

        <div className="space-y-6">
          {/* Step 1: Select Measurement Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">
              1. Besaran yang Diukur
            </label>
            <select
              value={selectedQuantity}
              onChange={(e) => {
                setSelectedQuantity(e.target.value);
                setSelectedRange(""); // Reset range when quantity changes
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            >
              <option value="">-- Pilih Besaran Ukur --</option>
              {availableQuantities.map((quantity) => (
                <option key={quantity} value={quantity}>
                  {quantity}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Show Instrument Type (auto-generated) */}
          {selectedQuantity && (
            <div>
              <label className="block text-sm font-medium mb-2">
                2. Jenis Alat yang Dikalibrasi
              </label>
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="font-medium">{selectedQuantity}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  (Otomatis dari besaran ukur)
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Select Measurement Range */}
          {selectedQuantity && (
            <div>
              <label className="block text-sm font-medium mb-2">
                3. Rentang Ukur
              </label>
              <select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
              >
                <option value="">-- Pilih Rentang Ukur --</option>
                {availableRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Show Button */}
          {selectedQuantity && selectedRange && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={handleShow}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Tampilkan Kalkulator
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Informasi:</h3>
        <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
          <li>• Pilih besaran ukur dari instrumen yang tersedia</li>
          <li>
            • Jenis alat akan terisi otomatis berdasarkan besaran ukur yang
            dipilih
          </li>
          <li>
            • Pilih rentang ukur yang sesuai untuk memulai perhitungan budget
            ketidakpastian
          </li>
        </ul>
      </div>
    </div>
  );
}
