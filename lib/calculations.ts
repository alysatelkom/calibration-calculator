import { Distribution, UncertaintyComponent, CalculationResults } from "@/types";

/**
 * Get divisor based on distribution type
 */
export function getDivisor(distribution: Distribution): number {
  switch (distribution) {
    case "Normal":
      return 2;
    case "Rectangular":
      return 1.732;
    case "Type A":
      return 1;
    default:
      return 1;
  }
}

/**
 * Calculate all values for a single component
 */
export function calculateComponent(
  uncertainty: number,
  distribution: Distribution,
  ni: number = 50
): Omit<UncertaintyComponent, "id" | "name" | "unit" | "order"> {
  const divisor = getDivisor(distribution);
  const ci = 1; // Always 1 as per requirements
  const ui = uncertainty / divisor;
  const uiCi = ui * ci;
  const uiCiSquared = uiCi * uiCi;
  const uiCiFourthDivNi = (uiCi * uiCi * uiCi * uiCi) / ni;

  return {
    uncertainty,
    distribution,
    divisor,
    ci,
    ui,
    uiCi,
    uiCiSquared,
    ni,
    uiCiFourthDivNi,
  };
}

/**
 * Calculate final results from all components
 */
export function calculateResults(
  components: UncertaintyComponent[]
): CalculationResults {
  const sumUiCiSquared = components.reduce((sum, c) => sum + c.uiCiSquared, 0);
  const sumUiCiFourthDivNi = components.reduce(
    (sum, c) => sum + c.uiCiFourthDivNi,
    0
  );

  const combinedStandardUncertainty = Math.sqrt(sumUiCiSquared);
  const uc4 = Math.pow(combinedStandardUncertainty, 4);
  const effectiveDegreesOfFreedom = uc4 / Math.sqrt(sumUiCiFourthDivNi);
  const coverageFactor = 2;
  const expandedUncertainty = coverageFactor * combinedStandardUncertainty;

  return {
    sumUiCiSquared,
    sumUiCiFourthDivNi,
    combinedStandardUncertainty,
    effectiveDegreesOfFreedom,
    coverageFactor,
    expandedUncertainty,
  };
}

/**
 * Update a component with new values and recalculate
 */
export function updateComponentCalculations(
  component: UncertaintyComponent
): UncertaintyComponent {
  const calculated = calculateComponent(
    component.uncertainty,
    component.distribution,
    component.ni
  );

  return {
    ...component,
    ...calculated,
  };
}
