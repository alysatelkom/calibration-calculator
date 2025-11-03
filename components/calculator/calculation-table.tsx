"use client";

import { UncertaintyComponent, CalculationResults, Distribution } from "@/types";
import { Plus, Trash2 } from "lucide-react";

interface CalculationTableProps {
  components: UncertaintyComponent[];
  results: CalculationResults;
  cmc: number;
  isEditMode: boolean;
  instrumentData: {
    cmc: number;
    drift: number;
    calibrationUncertainty: number;
  };
  onUpdateComponent: (id: string, updates: Partial<UncertaintyComponent>) => void;
  onAddComponent: () => void;
  onRemoveComponent: (id: string) => void;
}

const DISTRIBUTIONS: Distribution[] = ["Normal", "Rectangular", "Type A"];

export function CalculationTable({
  components,
  results,
  cmc,
  isEditMode,
  instrumentData,
  onUpdateComponent,
  onAddComponent,
  onRemoveComponent,
}: CalculationTableProps) {
  const formatNumber = (num: number, decimals: number = 6): string => {
    return num.toFixed(decimals);
  };

  // Final uncertainty is the max of expanded uncertainty and CMC
  const finalUncertainty = Math.max(results.expandedUncertainty, cmc);

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-900">
            <tr>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left">
                Komponen
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                Satuan
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                U
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                Distribusi
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                Divisor
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                Ui
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                Ci
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                UiCi
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                (UiCi)²
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                ni
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                (UiCi)⁴/ni
              </th>
              {isEditMode && (
                <th className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {components
              .sort((a, b) => a.order - b.order)
              .map((component) => {
                const isDefaultComponent = component.order <= 4;
                const isCertificate =
                  component.name === "Sertifikat Kalibrasi Standar";
                const isDrift = component.name === "Drift";
                const canEditU = isEditMode || (!isDrift && !isCertificate);

                // Certificate and Drift values come from database and are not editable
                const isDbValue = isCertificate || isDrift;

                return (
                  <tr
                    key={component.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                      {isEditMode && !isDefaultComponent ? (
                        <input
                          type="text"
                          value={component.name}
                          onChange={(e) =>
                            onUpdateComponent(component.id, {
                              name: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                        />
                      ) : (
                        <span className="font-medium">{component.name}</span>
                      )}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-center">
                      {isEditMode ? (
                        <input
                          type="text"
                          value={component.unit}
                          onChange={(e) =>
                            onUpdateComponent(component.id, {
                              unit: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-center"
                        />
                      ) : (
                        component.unit
                      )}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                      {canEditU && !isDbValue ? (
                        <input
                          type="number"
                          step="any"
                          value={component.uncertainty}
                          onChange={(e) =>
                            onUpdateComponent(component.id, {
                              uncertainty: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-right"
                        />
                      ) : (
                        <span
                          className={`block text-right ${
                            isDbValue
                              ? "bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                              : ""
                          }`}
                          title={
                            isDbValue ? "Nilai dari database (read-only)" : ""
                          }
                        >
                          {formatNumber(component.uncertainty)}
                        </span>
                      )}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                      {isEditMode ? (
                        <select
                          value={component.distribution}
                          onChange={(e) =>
                            onUpdateComponent(component.id, {
                              distribution: e.target.value as Distribution,
                            })
                          }
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                        >
                          {DISTRIBUTIONS.map((dist) => (
                            <option key={dist} value={dist}>
                              {dist}
                            </option>
                          ))}
                        </select>
                      ) : (
                        component.distribution
                      )}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right bg-gray-50 dark:bg-gray-900">
                      {formatNumber(component.divisor, 3)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right bg-gray-50 dark:bg-gray-900">
                      {formatNumber(component.ui)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right bg-gray-50 dark:bg-gray-900">
                      {component.ci}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right bg-gray-50 dark:bg-gray-900">
                      {formatNumber(component.uiCi)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right bg-gray-50 dark:bg-gray-900">
                      {formatNumber(component.uiCiSquared)}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-center">
                      {isEditMode ? (
                        <input
                          type="number"
                          value={component.ni}
                          onChange={(e) =>
                            onUpdateComponent(component.id, {
                              ni: parseInt(e.target.value) || 50,
                            })
                          }
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-center"
                        />
                      ) : (
                        component.ni
                      )}
                    </td>
                    <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right bg-gray-50 dark:bg-gray-900">
                      {formatNumber(component.uiCiFourthDivNi, 10)}
                    </td>
                    {isEditMode && (
                      <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-center">
                        {!isDefaultComponent && (
                          <button
                            onClick={() => onRemoveComponent(component.id)}
                            className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                            aria-label="Hapus komponen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}

            {/* SUMS Row */}
            <tr className="bg-blue-50 dark:bg-blue-900/30 font-bold">
              <td
                colSpan={8}
                className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right"
              >
                JUMLAH (SUMS):
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right">
                {formatNumber(results.sumUiCiSquared)}
              </td>
              <td className="border border-gray-300 dark:border-gray-700 px-3 py-2"></td>
              <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right">
                {formatNumber(results.sumUiCiFourthDivNi, 10)}
              </td>
              {isEditMode && (
                <td className="border border-gray-300 dark:border-gray-700"></td>
              )}
            </tr>

            {/* Results Rows - Inline under SUMS */}
            <tr className="bg-green-50 dark:bg-green-900/20">
              <td
                colSpan={7}
                className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right font-semibold"
              >
                Combined Standard Uncertainty (uc):
              </td>
              <td
                colSpan={isEditMode ? 5 : 4}
                className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-bold text-blue-600 dark:text-blue-400"
              >
                {formatNumber(results.combinedStandardUncertainty)}
              </td>
            </tr>

            <tr className="bg-green-50 dark:bg-green-900/20">
              <td
                colSpan={7}
                className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right font-semibold"
              >
                Effective Degrees of Freedom (veff):
              </td>
              <td
                colSpan={isEditMode ? 5 : 4}
                className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-bold text-green-600 dark:text-green-400"
              >
                {formatNumber(results.effectiveDegreesOfFreedom, 2)}
              </td>
            </tr>

            <tr className="bg-green-50 dark:bg-green-900/20">
              <td
                colSpan={7}
                className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right font-semibold"
              >
                Coverage Factor (k):
              </td>
              <td
                colSpan={isEditMode ? 5 : 4}
                className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-bold text-purple-600 dark:text-purple-400"
              >
                {results.coverageFactor}
              </td>
            </tr>

            <tr className="bg-green-50 dark:bg-green-900/20">
              <td
                colSpan={7}
                className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right font-semibold"
              >
                Expanded Uncertainty (U):
              </td>
              <td
                colSpan={isEditMode ? 5 : 4}
                className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-bold text-red-600 dark:text-red-400"
              >
                {formatNumber(results.expandedUncertainty)}
              </td>
            </tr>

            <tr className="bg-yellow-50 dark:bg-yellow-900/20">
              <td
                colSpan={7}
                className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right font-semibold"
              >
                CMC (dari database):
              </td>
              <td
                colSpan={isEditMode ? 5 : 4}
                className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-bold text-orange-600 dark:text-orange-400"
              >
                {formatNumber(cmc)}
              </td>
            </tr>

            <tr className="bg-indigo-100 dark:bg-indigo-900/30">
              <td
                colSpan={7}
                className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-right font-bold text-lg"
              >
                Ketidakpastian Akhir:
              </td>
              <td
                colSpan={isEditMode ? 5 : 4}
                className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-bold text-lg text-indigo-700 dark:text-indigo-300"
                title="max(Expanded Uncertainty, CMC)"
              >
                {formatNumber(finalUncertainty)}
                <span className="text-xs ml-2 text-gray-600 dark:text-gray-400">
                  (max U atau CMC)
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Add Component Button - Only in Edit Mode */}
      {isEditMode && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onAddComponent}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Komponen
          </button>
        </div>
      )}
    </div>
  );
}
