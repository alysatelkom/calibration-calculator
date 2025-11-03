"use client";

import { useState, useMemo } from "react";
import { Instrument } from "@/types";
import { ChevronRight } from "lucide-react";
import { SCOPES, MEASUREMENT_RANGES, ScopeKey } from "@/lib/scopes";

interface CalculatorWorkflowProps {
  instruments: Instrument[];
  onShow: (
    scope: string,
    quantity: string,
    instrumentId: string,
    range: string
  ) => void;
}

export function CalculatorWorkflow({
  instruments,
  onShow,
}: CalculatorWorkflowProps) {
  const [selectedScope, setSelectedScope] = useState<string>("");
  const [selectedQuantity, setSelectedQuantity] = useState<string>("");
  const [selectedInstrument, setSelectedInstrument] = useState<string>("");
  const [selectedRange, setSelectedRange] = useState<string>("");

  // Get measurement quantities for selected scope
  const availableQuantities = useMemo(() => {
    if (!selectedScope) return [];
    return SCOPES[selectedScope as ScopeKey] || [];
  }, [selectedScope]);

  // Get instruments that have the selected measurement quantity
  const availableInstruments = useMemo(() => {
    if (!selectedQuantity) return [];
    return instruments.filter((instrument) =>
      instrument.measurementQuantities.some((q) => q.name === selectedQuantity)
    );
  }, [instruments, selectedQuantity]);

  // Get ranges for the selected quantity (from MEASUREMENT_RANGES)
  const availableRanges = useMemo(() => {
    if (!selectedQuantity) return [];
    return MEASUREMENT_RANGES[selectedQuantity] || [];
  }, [selectedQuantity]);

  const handleShow = () => {
    if (selectedScope && selectedQuantity && selectedInstrument && selectedRange) {
      onShow(selectedScope, selectedQuantity, selectedInstrument, selectedRange);
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
        <h2 className="text-xl font-bold mb-6">Pilih Parameter Kalibrasi</h2>

        <div className="space-y-6">
          {/* Step 1: Select Scope */}
          <div>
            <label className="block text-sm font-medium mb-2">
              1. Scope (Ruang Lingkup)
            </label>
            <select
              value={selectedScope}
              onChange={(e) => {
                setSelectedScope(e.target.value);
                setSelectedQuantity("");
                setSelectedInstrument("");
                setSelectedRange("");
              }}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            >
              <option value="">-- Pilih Scope --</option>
              {Object.keys(SCOPES).map((scope) => (
                <option key={scope} value={scope}>
                  {scope}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Measurement Quantity */}
          {selectedScope && (
            <div>
              <label className="block text-sm font-medium mb-2">
                2. Besaran yang Diukur
              </label>
              <select
                value={selectedQuantity}
                onChange={(e) => {
                  setSelectedQuantity(e.target.value);
                  setSelectedInstrument("");
                  setSelectedRange("");
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
          )}

          {/* Step 3: Select Instrument */}
          {selectedQuantity && (
            <div>
              <label className="block text-sm font-medium mb-2">
                3. Jenis Alat yang Dikalibrasi (Instrumen)
              </label>
              {availableInstruments.length > 0 ? (
                <select
                  value={selectedInstrument}
                  onChange={(e) => {
                    setSelectedInstrument(e.target.value);
                    setSelectedRange("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                >
                  <option value="">-- Pilih Instrumen --</option>
                  {availableInstruments.map((instrument) => (
                    <option key={instrument.id} value={instrument.id}>
                      {instrument.name} ({instrument.brand} - {instrument.type})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Tidak ada instrumen untuk besaran ukur ini. Silakan tambah
                    instrumen di{" "}
                    <a href="/database" className="font-semibold underline">
                      Database Instrumen
                    </a>
                    .
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Select Measurement Range */}
          {selectedQuantity && selectedInstrument && (
            <div>
              <label className="block text-sm font-medium mb-2">
                4. Rentang Ukur
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
          {selectedScope &&
            selectedQuantity &&
            selectedInstrument &&
            selectedRange && (
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
          <li>• Pilih scope (ruang lingkup) terlebih dahulu</li>
          <li>• Pilih besaran yang diukur sesuai scope</li>
          <li>• Pilih instrumen dari database yang tersedia</li>
          <li>• Pilih rentang ukur yang sesuai</li>
          <li>
            • Nilai CMC, Drift, dan Calibration Uncertainty akan diambil dari
            database
          </li>
        </ul>
      </div>
    </div>
  );
}
