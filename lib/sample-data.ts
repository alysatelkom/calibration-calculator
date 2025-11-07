import { Instrument } from "@/types";
import { generateId } from "./storage";

/**
 * Sample instrument data based on requirements
 */
export function getSampleInstrument(): Instrument {
  const now = new Date().toISOString();

  return {
    id: generateId(),
    name: "Advanced Multi Product Calibrator",
    brand: "Transmille",
    type: "4015",
    serialNumber: "Y1269E18",
    measurementQuantities: [
      {
        id: generateId(),
        besaranYangDiukur: "DC Voltage",
        jenisAlat: "DC Voltmeter",
        ranges: [
          {
            id: generateId(),
            range: "0.01 mV ~ 202 mV",
            cmc: 0.085,
            drift: 0.0001,
            calibrationUncertainty: 0.00001,
          },
          {
            id: generateId(),
            range: "0.2 V ~ 2.02 V",
            cmc: 0.075,
            drift: 0.0001,
            calibrationUncertainty: 0.00001,
          },
          {
            id: generateId(),
            range: "2 V ~ 20.2 V",
            cmc: 0.065,
            drift: 0.0001,
            calibrationUncertainty: 0.00001,
          },
        ],
      },
      {
        id: generateId(),
        besaranYangDiukur: "AC Voltage",
        jenisAlat: "AC Voltmeter",
        ranges: [
          {
            id: generateId(),
            range: "0.01 mV ~ 202 mV",
            cmc: 0.095,
            drift: 0.0002,
            calibrationUncertainty: 0.00002,
          },
          {
            id: generateId(),
            range: "0.2 V ~ 2.02 V",
            cmc: 0.085,
            drift: 0.0002,
            calibrationUncertainty: 0.00002,
          },
        ],
      },
      {
        id: generateId(),
        besaranYangDiukur: "DC Current",
        jenisAlat: "DC Ammeter",
        ranges: [
          {
            id: generateId(),
            range: "0.01 mA ~ 202 mA",
            cmc: 0.125,
            drift: 0.0003,
            calibrationUncertainty: 0.00003,
          },
          {
            id: generateId(),
            range: "0.2 A ~ 2.02 A",
            cmc: 0.115,
            drift: 0.0003,
            calibrationUncertainty: 0.00003,
          },
        ],
      },
      {
        id: generateId(),
        besaranYangDiukur: "AC Current",
        jenisAlat: "AC Ammeter",
        ranges: [
          {
            id: generateId(),
            range: "0.01 mA ~ 202 mA",
            cmc: 0.135,
            drift: 0.0004,
            calibrationUncertainty: 0.00004,
          },
          {
            id: generateId(),
            range: "0.2 A ~ 2.02 A",
            cmc: 0.125,
            drift: 0.0004,
            calibrationUncertainty: 0.00004,
          },
        ],
      },
      {
        id: generateId(),
        besaranYangDiukur: "Resistance",
        jenisAlat: "Continuity Tester",
        ranges: [
          {
            id: generateId(),
            range: "0 Ω ~ 1000 Ω",
            cmc: 0.15,
            drift: 0.0005,
            calibrationUncertainty: 0.00005,
          },
        ],
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Initialize sample data if no instruments exist
 */
export function initializeSampleData(
  existingInstruments: Instrument[]
): Instrument[] {
  if (existingInstruments.length === 0) {
    return [getSampleInstrument()];
  }
  return existingInstruments;
}
