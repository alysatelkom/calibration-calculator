import { Instrument, UncertaintyTemplate } from "@/types";

const INSTRUMENTS_KEY = "calibration_instruments";
const TEMPLATES_KEY = "uncertainty_templates";

/**
 * Storage utilities for instruments
 */
export const instrumentStorage = {
  getAll(): Instrument[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(INSTRUMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  save(instruments: Instrument[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(INSTRUMENTS_KEY, JSON.stringify(instruments));
  },

  add(instrument: Instrument): void {
    const instruments = this.getAll();
    instruments.push(instrument);
    this.save(instruments);
  },

  update(id: string, updatedInstrument: Instrument): void {
    const instruments = this.getAll();
    const index = instruments.findIndex((i) => i.id === id);
    if (index !== -1) {
      instruments[index] = updatedInstrument;
      this.save(instruments);
    }
  },

  delete(id: string): void {
    const instruments = this.getAll();
    const filtered = instruments.filter((i) => i.id !== id);
    this.save(filtered);
  },

  getById(id: string): Instrument | undefined {
    const instruments = this.getAll();
    return instruments.find((i) => i.id === id);
  },
};

/**
 * Storage utilities for templates
 */
export const templateStorage = {
  getAll(): UncertaintyTemplate[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(TEMPLATES_KEY);
    return data ? JSON.parse(data) : [];
  },

  save(templates: UncertaintyTemplate[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  },

  add(template: UncertaintyTemplate): void {
    const templates = this.getAll();
    templates.push(template);
    this.save(templates);
  },

  update(id: string, updatedTemplate: UncertaintyTemplate): void {
    const templates = this.getAll();
    const index = templates.findIndex((t) => t.id === id);
    if (index !== -1) {
      templates[index] = updatedTemplate;
      this.save(templates);
    }
  },

  delete(id: string): void {
    const templates = this.getAll();
    const filtered = templates.filter((t) => t.id !== id);
    this.save(filtered);
  },

  getById(id: string): UncertaintyTemplate | undefined {
    const templates = this.getAll();
    return templates.find((t) => t.id === id);
  },

  getByQuantityAndRange(
    quantity: string,
    range: string
  ): UncertaintyTemplate[] {
    const templates = this.getAll();
    return templates.filter(
      (t) =>
        t.measurementQuantity === quantity && t.measurementRange === range
    );
  },
};

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
