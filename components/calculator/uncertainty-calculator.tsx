"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Save, Edit, Plus, Trash2 } from "lucide-react";
import {
  UncertaintyComponent,
  UncertaintyTemplate,
  Distribution,
} from "@/types";
import { generateId, templateStorage } from "@/lib/storage";
import {
  calculateComponent,
  calculateResults,
  updateComponentCalculations,
} from "@/lib/calculations";
import { CalculationTable } from "./calculation-table";
import { TemplateManager } from "./template-manager";

interface UncertaintyCalculatorProps {
  measurementQuantity: string;
  measurementRange: string;
  onBack: () => void;
}

// Default components that are always included
const createDefaultComponents = (): UncertaintyComponent[] => {
  return [
    {
      id: generateId(),
      name: "Sertifikat Kalibrasi Standar",
      unit: "mV",
      ...calculateComponent(0, "Normal"),
      order: 1,
    },
    {
      id: generateId(),
      name: "Drift",
      unit: "mV",
      ...calculateComponent(0, "Rectangular"),
      order: 2,
    },
    {
      id: generateId(),
      name: "Resolusi / Readability",
      unit: "mV",
      ...calculateComponent(0, "Rectangular"),
      order: 3,
    },
    {
      id: generateId(),
      name: "Repeatability",
      unit: "mV",
      ...calculateComponent(0, "Type A"),
      order: 4,
    },
  ];
};

export function UncertaintyCalculator({
  measurementQuantity,
  measurementRange,
  onBack,
}: UncertaintyCalculatorProps) {
  const instrumentType = measurementQuantity; // As per requirements
  const standard = measurementQuantity; // As per requirements
  const measurementModel = "Y = X"; // Fixed text as per requirements

  const [components, setComponents] = useState<UncertaintyComponent[]>(
    createDefaultComponents()
  );
  const [isEditMode, setIsEditMode] = useState(true);
  const [loadedTemplate, setLoadedTemplate] = useState<
    UncertaintyTemplate | undefined
  >();
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  // Calculate results whenever components change
  const results = useMemo(() => {
    return calculateResults(components);
  }, [components]);

  // Load templates for this quantity and range
  const availableTemplates = useMemo(() => {
    return templateStorage.getByQuantityAndRange(
      measurementQuantity,
      measurementRange
    );
  }, [measurementQuantity, measurementRange]);

  const handleUpdateComponent = (
    id: string,
    updates: Partial<UncertaintyComponent>
  ) => {
    setComponents((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          return updateComponentCalculations(updated);
        }
        return c;
      })
    );
  };

  const handleAddComponent = () => {
    const newComponent: UncertaintyComponent = {
      id: generateId(),
      name: "Komponen Baru",
      unit: "mV",
      ...calculateComponent(0, "Rectangular"),
      order: components.length + 1,
    };
    setComponents([...components, newComponent]);
  };

  const handleRemoveComponent = (id: string) => {
    // Can't remove default components (first 4)
    const component = components.find((c) => c.id === id);
    if (component && component.order > 4) {
      setComponents(components.filter((c) => c.id !== id));
    }
  };

  const handleSaveTemplate = (name: string) => {
    const template: UncertaintyTemplate = {
      id: loadedTemplate?.id || generateId(),
      name,
      measurementQuantity,
      instrumentType,
      standard,
      measurementRange,
      measurementModel,
      components: components.map((c) => ({ ...c })),
      createdAt: loadedTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (loadedTemplate) {
      templateStorage.update(template.id, template);
    } else {
      templateStorage.add(template);
    }

    setLoadedTemplate(template);
    alert("Template berhasil disimpan!");
  };

  const handleLoadTemplate = (template: UncertaintyTemplate) => {
    setComponents(template.components.map((c) => ({ ...c })));
    setLoadedTemplate(template);
    setIsEditMode(false);
    setShowTemplateManager(false);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus template ini?")) {
      templateStorage.delete(id);
      if (loadedTemplate?.id === id) {
        setLoadedTemplate(undefined);
      }
    }
  };

  const handleNewCalculation = () => {
    setComponents(createDefaultComponents());
    setLoadedTemplate(undefined);
    setIsEditMode(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        <div className="flex gap-2">
          {!isEditMode && (
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Edit className="w-5 h-5" />
              Mode Edit
            </button>
          )}
          <button
            onClick={handleNewCalculation}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
              <Plus className="w-5 h-5" />
            Perhitungan Baru
          </button>
          <button
            onClick={() => setShowTemplateManager(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            Kelola Template
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          PERHITUNGAN BUDGET KETIDAKPASTIAN
        </h2>

        <div className="space-y-2 text-black dark:text-white">
          <div className="grid grid-cols-[200px_1fr]">
            <span className="font-medium">Besaran yang diukur:</span>
            <span>{measurementQuantity}</span>
          </div>
          <div className="grid grid-cols-[200px_1fr]">
            <span className="font-medium">Jenis alat yang dikalibrasi:</span>
            <span>{instrumentType}</span>
          </div>
          <div className="grid grid-cols-[200px_1fr]">
            <span className="font-medium">Standar yang digunakan:</span>
            <span>{standard}</span>
          </div>
          <div className="grid grid-cols-[200px_1fr]">
            <span className="font-medium">Model matematis pengukuran:</span>
            <span>{measurementModel}</span>
          </div>
          <div className="grid grid-cols-[200px_1fr]">
            <span className="font-medium">Rentang ukur:</span>
            <span>{measurementRange}</span>
          </div>
        </div>

        {loadedTemplate && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Template yang dimuat:{" "}
              <span className="font-semibold">{loadedTemplate.name}</span>
            </p>
          </div>
        )}
      </div>

      {/* Calculation Table */}
      <CalculationTable
        components={components}
        results={results}
        isEditMode={isEditMode}
        onUpdateComponent={handleUpdateComponent}
        onAddComponent={handleAddComponent}
        onRemoveComponent={handleRemoveComponent}
      />

      {/* Template Manager Modal */}
      {showTemplateManager && (
        <TemplateManager
          templates={availableTemplates}
          currentTemplate={loadedTemplate}
          onSave={handleSaveTemplate}
          onLoad={handleLoadTemplate}
          onDelete={handleDeleteTemplate}
          onClose={() => setShowTemplateManager(false)}
        />
      )}
    </div>
  );
}
