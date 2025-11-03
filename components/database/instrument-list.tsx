import { Instrument } from "@/types";
import { Edit, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface InstrumentListProps {
  instruments: Instrument[];
  onEdit: (instrument: Instrument) => void;
  onDelete: (id: string) => void;
}

export function InstrumentList({
  instruments,
  onEdit,
  onDelete,
}: InstrumentListProps) {
  const [expandedInstruments, setExpandedInstruments] = useState<Set<string>>(
    new Set()
  );

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedInstruments);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedInstruments(newExpanded);
  };

  if (instruments.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-500">
          Belum ada instrumen. Klik &quot;Tambah Instrumen&quot; untuk memulai.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {instruments.map((instrument) => {
        const isExpanded = expandedInstruments.has(instrument.id);
        return (
          <div
            key={instrument.id}
            className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
          >
            <div className="bg-white dark:bg-gray-950 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <button
                    onClick={() => toggleExpanded(instrument.id)}
                    className="flex items-center gap-2 text-left hover:text-blue-600 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="text-xl font-bold">{instrument.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {instrument.brand} - {instrument.type} (S/N:{" "}
                        {instrument.serialNumber})
                      </p>
                    </div>
                  </button>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEdit(instrument)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    aria-label="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(instrument.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-4">
                  {instrument.measurementQuantities.map((quantity) => (
                    <div
                      key={quantity.id}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <h4 className="font-semibold mb-2">{quantity.name}</h4>
                      <div className="space-y-2">
                        {quantity.ranges.map((range) => (
                          <div
                            key={range.id}
                            className="text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded"
                          >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">
                                  Rentang:
                                </span>{" "}
                                <span className="font-medium">
                                  {range.range}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">
                                  CMC:
                                </span>{" "}
                                <span className="font-medium">{range.cmc}</span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">
                                  Drift:
                                </span>{" "}
                                <span className="font-medium">
                                  {range.drift}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-400">
                                  Cal. Uncertainty:
                                </span>{" "}
                                <span className="font-medium">
                                  {range.calibrationUncertainty}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
