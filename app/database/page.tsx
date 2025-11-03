"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Instrument } from "@/types";
import { instrumentStorage } from "@/lib/storage";
import { initializeSampleData } from "@/lib/sample-data";
import { InstrumentList } from "@/components/database/instrument-list";
import { InstrumentForm } from "@/components/database/instrument-form";

export default function DatabasePage() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInstrument, setEditingInstrument] = useState<
    Instrument | undefined
  >();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = instrumentStorage.getAll();
    const initialized = initializeSampleData(stored);
    if (initialized.length !== stored.length) {
      instrumentStorage.save(initialized);
    }
    setInstruments(initialized);
  }, []);

  const handleAdd = () => {
    setEditingInstrument(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (instrument: Instrument) => {
    setEditingInstrument(instrument);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus instrumen ini?")) {
      instrumentStorage.delete(id);
      setInstruments(instrumentStorage.getAll());
    }
  };

  const handleSave = (instrument: Instrument) => {
    if (editingInstrument) {
      instrumentStorage.update(instrument.id, instrument);
    } else {
      instrumentStorage.add(instrument);
    }
    setInstruments(instrumentStorage.getAll());
    setIsFormOpen(false);
    setEditingInstrument(undefined);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingInstrument(undefined);
  };

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Database Instrumen</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola instrumen kalibrasi Anda
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Instrumen
        </button>
      </div>

      {isFormOpen ? (
        <InstrumentForm
          instrument={editingInstrument}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <InstrumentList
          instruments={instruments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
