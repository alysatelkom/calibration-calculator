"use client";

import { useState, useEffect } from "react";
import { instrumentStorage } from "@/lib/storage";
import { Instrument } from "@/types";
import { CalculatorWorkflow } from "@/components/calculator/calculator-workflow";
import { UncertaintyCalculator } from "@/components/calculator/uncertainty-calculator";

export default function CalculatorPage() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [selectedQuantity, setSelectedQuantity] = useState<string>("");
  const [selectedRange, setSelectedRange] = useState<string>("");
  const [showCalculator, setShowCalculator] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setInstruments(instrumentStorage.getAll());
  }, []);

  const handleShow = (quantity: string, range: string) => {
    setSelectedQuantity(quantity);
    setSelectedRange(range);
    setShowCalculator(true);
  };

  const handleBack = () => {
    setShowCalculator(false);
    setSelectedQuantity("");
    setSelectedRange("");
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Kalkulator Budget Ketidakpastian
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Hitung budget ketidakpastian untuk pengukuran kalibrasi
        </p>
      </div>

      {!showCalculator ? (
        <CalculatorWorkflow instruments={instruments} onShow={handleShow} />
      ) : (
        <UncertaintyCalculator
          measurementQuantity={selectedQuantity}
          measurementRange={selectedRange}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
