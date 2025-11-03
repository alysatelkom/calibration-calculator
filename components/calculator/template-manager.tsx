"use client";

import { useState } from "react";
import { UncertaintyTemplate } from "@/types";
import { X, Save, Download, Trash2 } from "lucide-react";

interface TemplateManagerProps {
  templates: UncertaintyTemplate[];
  currentTemplate?: UncertaintyTemplate;
  onSave: (name: string) => void;
  onLoad: (template: UncertaintyTemplate) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function TemplateManager({
  templates,
  currentTemplate,
  onSave,
  onLoad,
  onDelete,
  onClose,
}: TemplateManagerProps) {
  const [templateName, setTemplateName] = useState(
    currentTemplate?.name || ""
  );
  const [activeTab, setActiveTab] = useState<"save" | "load">("save");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (templateName.trim()) {
      onSave(templateName.trim());
      onClose();
    }
  };

  const handleLoad = (template: UncertaintyTemplate) => {
    onLoad(template);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus template "${name}"?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold">Kelola Template</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab("save")}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === "save"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              Simpan Template
            </div>
          </button>
          <button
            onClick={() => setActiveTab("load")}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === "load"
                ? "border-b-2 border-green-600 text-green-600"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Muat Template ({templates.length})
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "save" ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Template
                </label>
                <input
                  type="text"
                  required
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Masukkan nama template..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
                />
              </div>

              {currentTemplate && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Template ini akan memperbarui template yang sudah ada:{" "}
                    <span className="font-semibold">
                      {currentTemplate.name}
                    </span>
                  </p>
                </div>
              )}

              <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg">
                <h4 className="font-semibold mb-2">Informasi Template:</h4>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <li>
                    • Template akan menyimpan semua komponen dan konfigurasi
                    saat ini
                  </li>
                  <li>
                    • Saat memuat template, nilai U dan CMC dapat diedit
                    langsung
                  </li>
                  <li>
                    • Untuk mengubah komponen, unit, atau distribusi, aktifkan
                    Mode Edit
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Save className="w-5 h-5" />
                {currentTemplate ? "Perbarui Template" : "Simpan Template Baru"}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              {templates.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>Belum ada template tersimpan.</p>
                  <p className="text-sm mt-2">
                    Buat template baru di tab &quot;Simpan Template&quot;.
                  </p>
                </div>
              ) : (
                templates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {template.name}
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p>
                            <span className="font-medium">Komponen:</span>{" "}
                            {template.components.length}
                          </p>
                          <p>
                            <span className="font-medium">Dibuat:</span>{" "}
                            {new Date(template.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                          <p>
                            <span className="font-medium">Diperbarui:</span>{" "}
                            {new Date(template.updatedAt).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleLoad(template)}
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(template.id, template.name)
                          }
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {currentTemplate?.id === template.id && (
                      <div className="mt-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded inline-block">
                        Template saat ini
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
