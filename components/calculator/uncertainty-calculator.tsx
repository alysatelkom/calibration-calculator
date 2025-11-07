"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Save, Edit, Plus, Download } from "lucide-react";
import {
  UncertaintyComponent,
  UncertaintyTemplate,
  Instrument,
} from "@/types";
import { generateId, templateStorage, historyStorage } from "@/lib/storage";
import {
  calculateComponent,
  calculateResults,
  updateComponentCalculations,
} from "@/lib/calculations";
import { CalculationTable } from "./calculation-table";
import { TemplateManager } from "./template-manager";
import * as XLSX from "xlsx";

interface UncertaintyCalculatorProps {
  scope: string;
  measurementQuantity: string;
  measurementRange: string;
  instrument?: Instrument;
  onBack: () => void;
}

export function UncertaintyCalculator({
  scope,
  measurementQuantity,
  measurementRange,
  instrument,
  onBack,
}: UncertaintyCalculatorProps) {
  const instrumentType = instrument
    ? `${instrument.name} (${instrument.brand} - ${instrument.type})`
    : measurementQuantity;
  const standard = instrument?.name || measurementQuantity;
  const measurementModel = "Y = X";

  // Get CMC and Drift from instrument database
  const instrumentData = useMemo(() => {
    if (!instrument) return { cmc: 0, drift: 0, calibrationUncertainty: 0, besaranYangDiukur: "" };

    const quantity = instrument.measurementQuantities.find(
      (q) => q.jenisAlat === measurementQuantity
    );
    if (!quantity) return { cmc: 0, drift: 0, calibrationUncertainty: 0, besaranYangDiukur: "" };

    const range = quantity.ranges.find((r) => r.range === measurementRange);
    if (!range) return { cmc: 0, drift: 0, calibrationUncertainty: 0, besaranYangDiukur: quantity.besaranYangDiukur };

    return {
      cmc: range.cmc,
      drift: range.drift,
      calibrationUncertainty: range.calibrationUncertainty,
      besaranYangDiukur: quantity.besaranYangDiukur,
    };
  }, [instrument, measurementQuantity, measurementRange]);

  // Create default components with values from database
  const createDefaultComponents = (): UncertaintyComponent[] => {
    return [
      {
        id: generateId(),
        name: "Sertifikat Kalibrasi Standar",
        unit: "mV",
        ...calculateComponent(
          instrumentData.calibrationUncertainty,
          "Normal"
        ),
        order: 1,
      },
      {
        id: generateId(),
        name: "Drift",
        unit: "mV",
        ...calculateComponent(instrumentData.drift, "Rectangular"),
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

  const [components, setComponents] = useState<UncertaintyComponent[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadedTemplate, setLoadedTemplate] = useState<
    UncertaintyTemplate | undefined
  >();
  const [showTemplateManager, setShowTemplateManager] = useState(false);

  // Initialize components when instrument data changes
  useEffect(() => {
    setComponents(createDefaultComponents());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instrumentData.cmc, instrumentData.drift]);

  // Calculate results whenever components change
  const results = useMemo(() => {
    return calculateResults(components);
  }, [components]);

  // Auto-generated template name
  const autoTemplateName = `${measurementQuantity} - ${measurementRange}`;

  // Available templates for this quantity and range
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
    const component = components.find((c) => c.id === id);
    if (component && component.order > 4) {
      setComponents(components.filter((c) => c.id !== id));
    }
  };

  const handleSaveTemplate = (name?: string) => {
    const templateName = name || autoTemplateName;

    const template: UncertaintyTemplate = {
      id: loadedTemplate?.id || generateId(),
      name: templateName,
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

  const handleSaveToHistory = () => {
    if (!instrument) return;

    const finalUncertainty = Math.max(results.expandedUncertainty, instrumentData.cmc);

    const historyEntry = {
      id: generateId(),
      scope,
      besaranYangDiukur: instrumentData.besaranYangDiukur,
      jenisAlat: measurementQuantity,
      measurementRange,
      instrumentName: instrument.name,
      instrumentBrand: instrument.brand,
      instrumentType: instrument.type,
      instrumentSerial: instrument.serialNumber,
      components: components.map((c) => ({ ...c })),
      results,
      cmc: instrumentData.cmc,
      finalUncertainty,
      createdAt: new Date().toISOString(),
    };

    historyStorage.add(historyEntry);
  };

  const handleExportToExcel = () => {
    // Prepare data for Excel
    const tableData = [];

    // Header row
    tableData.push([
      "Komponen",
      "Satuan",
      "Distribusi",
      "U",
      "Pembagi",
      "ni",
      "Ui",
      "Ci",
      "UiCi",
      "(UiCi)²",
      "(UiCi)⁴/ni",
    ]);

    // Component rows
    components
      .sort((a, b) => a.order - b.order)
      .forEach((component) => {
        tableData.push([
          component.name,
          component.unit,
          component.distribution,
          component.uncertainty,
          component.divisor,
          component.ni,
          component.ui,
          component.ci,
          component.uiCi,
          component.uiCiSquared,
          component.uiCiFourthDivNi,
        ]);
      });

    // SUMS row
    tableData.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "JUMLAH (SUMS):",
      results.sumUiCiSquared,
      "",
      results.sumUiCiFourthDivNi,
    ]);

    // Results rows
    tableData.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "Combined Standard Uncertainty (uc):",
      results.combinedStandardUncertainty,
      "",
      "",
      "",
    ]);
    tableData.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "Effective Degrees of Freedom (veff):",
      results.effectiveDegreesOfFreedom,
      "",
      "",
      "",
    ]);
    tableData.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "Coverage Factor (k):",
      results.coverageFactor,
      "",
      "",
      "",
    ]);
    tableData.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "Expanded Uncertainty (U):",
      results.expandedUncertainty,
      "",
      "",
      "",
    ]);
    tableData.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "CMC:",
      instrumentData.cmc,
      "",
      "",
      "",
    ]);
    tableData.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "Final Uncertainty:",
      Math.max(results.expandedUncertainty, instrumentData.cmc),
      "",
      "",
      "",
    ]);

    // Add header information
    const headerData = [
      ["PERHITUNGAN BUDGET KETIDAKPASTIAN"],
      [],
      ["Scope:", scope],
      ["Besaran yang diukur:", measurementQuantity],
      ["Jenis alat yang dikalibrasi:", instrumentType],
      ["Standar yang digunakan:", standard],
      ["Model matematis pengukuran:", measurementModel],
      ["Rentang ukur:", measurementRange],
      [],
    ];

    const finalData = [...headerData, ...tableData];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(finalData);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Uncertainty Budget");

    // Save file
    const fileName = `${measurementQuantity}_${measurementRange}_${new Date()
      .toISOString()
      .split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Kembali
        </button>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleSaveToHistory}
            className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            <Save className="w-5 h-5" />
            Simpan Perhitungan
          </button>
          <button
            onClick={handleExportToExcel}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Excel
          </button>
          {!isEditMode && (
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Edit className="w-5 h-5" />
              Mode Edit
            </button>
          )}
          <button
            onClick={handleNewCalculation}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Perhitungan Baru
          </button>
          <button
            onClick={() => setShowTemplateManager(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
          <div className="grid grid-cols-[250px_1fr]">
            <span className="font-medium">Scope:</span>
            <span>{scope}</span>
          </div>
          <div className="grid grid-cols-[250px_1fr]">
            <span className="font-medium">Besaran yang diukur:</span>
            <span>{measurementQuantity}</span>
          </div>
          <div className="grid grid-cols-[250px_1fr]">
            <span className="font-medium">Jenis alat yang dikalibrasi:</span>
            <span>{instrumentType}</span>
          </div>
          <div className="grid grid-cols-[250px_1fr]">
            <span className="font-medium">Standar yang digunakan:</span>
            <span>{standard}</span>
          </div>
          <div className="grid grid-cols-[250px_1fr]">
            <span className="font-medium">Model matematis pengukuran:</span>
            <span>{measurementModel}</span>
          </div>
          <div className="grid grid-cols-[250px_1fr]">
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
        cmc={instrumentData.cmc}
        isEditMode={isEditMode}
        instrumentData={instrumentData}
        onUpdateComponent={handleUpdateComponent}
        onAddComponent={handleAddComponent}
        onRemoveComponent={handleRemoveComponent}
      />

      {/* Template Manager Modal */}
      {showTemplateManager && (
        <TemplateManager
          templates={availableTemplates}
          currentTemplate={loadedTemplate}
          defaultName={autoTemplateName}
          onSave={handleSaveTemplate}
          onLoad={handleLoadTemplate}
          onDelete={handleDeleteTemplate}
          onClose={() => setShowTemplateManager(false)}
        />
      )}
    </div>
  );
}
