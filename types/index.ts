// Distribution types for uncertainty calculations
export type Distribution = "Normal" | "Rectangular" | "Type A";

// Measurement quantity for an instrument
export interface MeasurementQuantity {
  id: string;
  besaranYangDiukur: string; // e.g., "DC Voltage", "AC Voltage"
  jenisAlat: string; // e.g., "DC Voltmeter", "AC Voltmeter"
  ranges: MeasurementRange[];
}

// Measurement range with its properties
export interface MeasurementRange {
  id: string;
  range: string; // e.g., "0.01 mV ~ 202 mV"
  cmc: number; // Calibration and Measurement Capability
  drift: number;
  calibrationUncertainty: number;
}

// Instrument in the database
export interface Instrument {
  id: string;
  name: string;
  brand: string;
  type: string;
  serialNumber: string;
  measurementQuantities: MeasurementQuantity[];
  createdAt: string;
  updatedAt: string;
}

// Component in the uncertainty budget
export interface UncertaintyComponent {
  id: string;
  name: string;
  unit: string;
  uncertainty: number; // U value
  distribution: Distribution;
  divisor: number; // Automatically calculated based on distribution
  ci: number; // Sensitivity coefficient (always 1 in requirements)
  ui: number; // Ui = U / Divisor
  uiCi: number; // UiCi = Ui × Ci
  uiCiSquared: number; // (UiCi)²
  ni: number; // Degrees of freedom (default 50)
  uiCiFourthDivNi: number; // (UiCi)⁴ / ni
  order: number; // Display order
}

// Template for a specific measurement quantity and range
export interface UncertaintyTemplate {
  id: string;
  name: string; // Template name
  measurementQuantity: string;
  instrumentType: string;
  standard: string;
  measurementRange: string;
  measurementModel: string; // Fixed text
  components: UncertaintyComponent[];
  createdAt: string;
  updatedAt: string;
}

// Calculation results
export interface CalculationResults {
  sumUiCiSquared: number; // Σ(UiCi)²
  sumUiCiFourthDivNi: number; // Σ((UiCi)⁴ / ni)
  combinedStandardUncertainty: number; // uc = √(Σ(UiCi)²)
  effectiveDegreesOfFreedom: number; // veff = uc⁴ / √(Σ((UiCi)⁴ / ni))
  coverageFactor: number; // k = 2
  expandedUncertainty: number; // U = k × uc
}

// Calculator state
export interface CalculatorState {
  measurementQuantity: string;
  instrumentType: string;
  standard: string;
  measurementRange: string;
  measurementModel: string;
  selectedTemplate?: UncertaintyTemplate;
  components: UncertaintyComponent[];
  results?: CalculationResults;
  isEditMode: boolean;
}

// Calculation History
export interface CalculationHistory {
  id: string;
  scope: string;
  besaranYangDiukur: string;
  jenisAlat: string;
  measurementRange: string;
  instrumentName: string;
  instrumentBrand: string;
  instrumentType: string;
  instrumentSerial: string;
  components: UncertaintyComponent[];
  results: CalculationResults;
  cmc: number;
  finalUncertainty: number;
  createdAt: string;
  createdBy?: string;
}
