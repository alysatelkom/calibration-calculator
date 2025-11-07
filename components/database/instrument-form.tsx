"use client";

import { useState } from "react";
import { Instrument, MeasurementQuantity, MeasurementRange } from "@/types";
import { generateId } from "@/lib/storage";
import { Plus, Trash2, Save, X } from "lucide-react";

interface InstrumentFormProps {
  instrument?: Instrument;
  onSave: (instrument: Instrument) => void;
  onCancel: () => void;
}

export function InstrumentForm({
  instrument,
  onSave,
  onCancel,
}: InstrumentFormProps) {
  const [formData, setFormData] = useState<Instrument>(
    instrument || {
      id: generateId(),
      name: "",
      brand: "",
      type: "",
      serialNumber: "",
      measurementQuantities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
  };

  const addQuantity = () => {
    setFormData({
      ...formData,
      measurementQuantities: [
        ...formData.measurementQuantities,
        {
          id: generateId(),
          besaranYangDiukur: "",
          jenisAlat: "",
          ranges: [],
        },
      ],
    });
  };

  const removeQuantity = (quantityId: string) => {
    setFormData({
      ...formData,
      measurementQuantities: formData.measurementQuantities.filter(
        (q) => q.id !== quantityId
      ),
    });
  };

  const updateQuantity = (
    quantityId: string,
    updates: Partial<MeasurementQuantity>
  ) => {
    setFormData({
      ...formData,
      measurementQuantities: formData.measurementQuantities.map((q) =>
        q.id === quantityId ? { ...q, ...updates } : q
      ),
    });
  };

  const addRange = (quantityId: string) => {
    setFormData({
      ...formData,
      measurementQuantities: formData.measurementQuantities.map((q) =>
        q.id === quantityId
          ? {
              ...q,
              ranges: [
                ...q.ranges,
                {
                  id: generateId(),
                  range: "",
                  cmc: 0,
                  drift: 0,
                  calibrationUncertainty: 0,
                },
              ],
            }
          : q
      ),
    });
  };

  const removeRange = (quantityId: string, rangeId: string) => {
    setFormData({
      ...formData,
      measurementQuantities: formData.measurementQuantities.map((q) =>
        q.id === quantityId
          ? {
              ...q,
              ranges: q.ranges.filter((r) => r.id !== rangeId),
            }
          : q
      ),
    });
  };

  const updateRange = (
    quantityId: string,
    rangeId: string,
    updates: Partial<MeasurementRange>
  ) => {
    setFormData({
      ...formData,
      measurementQuantities: formData.measurementQuantities.map((q) =>
        q.id === quantityId
          ? {
              ...q,
              ranges: q.ranges.map((r) =>
                r.id === rangeId ? { ...r, ...updates } : r
              ),
            }
          : q
      ),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          {instrument ? "Edit Instrumen" : "Tambah Instrumen Baru"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nama Instrumen
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tipe/Model
            </label>
            <input
              type="text"
              required
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Nomor Seri
            </label>
            <input
              type="text"
              required
              value={formData.serialNumber}
              onChange={(e) =>
                setFormData({ ...formData, serialNumber: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
            />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Besaran Ukur</h3>
            <button
              type="button"
              onClick={addQuantity}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Besaran Ukur
            </button>
          </div>

          <div className="space-y-4">
            {formData.measurementQuantities.map((quantity) => (
              <div
                key={quantity.id}
                className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 mr-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Besaran yang Diukur
                      </label>
                      <input
                        type="text"
                        required
                        value={quantity.besaranYangDiukur}
                        onChange={(e) =>
                          updateQuantity(quantity.id, {
                            besaranYangDiukur: e.target.value,
                          })
                        }
                        placeholder="e.g., DC Voltage"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Jenis Alat yang Dikalibrasi
                      </label>
                      <input
                        type="text"
                        required
                        value={quantity.jenisAlat}
                        onChange={(e) =>
                          updateQuantity(quantity.id, {
                            jenisAlat: e.target.value,
                          })
                        }
                      placeholder="e.g., DC Voltmeter"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                    />
                  </div>
                </div>
                  <button
                    type="button"
                    onClick={() => removeQuantity(quantity.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                    aria-label="Hapus besaran ukur"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="ml-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold">Rentang Ukur</h4>
                    <button
                      type="button"
                      onClick={() => addRange(quantity.id)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Tambah Rentang
                    </button>
                  </div>

                  <div className="space-y-3">
                    {quantity.ranges.map((range) => (
                      <div
                        key={range.id}
                        className="border border-gray-300 dark:border-gray-700 rounded p-3 bg-white dark:bg-gray-950"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                              <label className="block text-xs font-medium mb-1">
                                Rentang
                              </label>
                              <input
                                type="text"
                                required
                                value={range.range}
                                onChange={(e) =>
                                  updateRange(quantity.id, range.id, {
                                    range: e.target.value,
                                  })
                                }
                                placeholder="e.g., 0.01 mV ~ 202 mV"
                                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                CMC
                              </label>
                              <input
                                type="number"
                                step="any"
                                required
                                value={range.cmc}
                                onChange={(e) =>
                                  updateRange(quantity.id, range.id, {
                                    cmc: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Drift
                              </label>
                              <input
                                type="number"
                                step="any"
                                required
                                value={range.drift}
                                onChange={(e) =>
                                  updateRange(quantity.id, range.id, {
                                    drift: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-xs font-medium mb-1">
                                Calibration Uncertainty
                              </label>
                              <input
                                type="number"
                                step="any"
                                required
                                value={range.calibrationUncertainty}
                                onChange={(e) =>
                                  updateRange(quantity.id, range.id, {
                                    calibrationUncertainty:
                                      parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeRange(quantity.id, range.id)}
                            className="ml-2 p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                            aria-label="Hapus rentang"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
          Batal
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-5 h-5" />
          Simpan
        </button>
      </div>
    </form>
  );
}
