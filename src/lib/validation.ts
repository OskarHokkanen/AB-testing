import { DesignChoice } from "./metrics";

/**
 * Checks if a single design choice is complete
 */
export function isDesignChoiceComplete(choice: DesignChoice): boolean {
  return (
    choice.object.trim() !== "" &&
    choice.action.trim() !== "" &&
    choice.value.trim() !== "" &&
    choice.reasoning.trim() !== ""
  );
}

/**
 * Checks if all design choices in an array are complete
 */
export function areAllDesignChoicesComplete(choices: DesignChoice[]): boolean {
  if (choices.length === 0) {
    return false;
  }
  return choices.every(isDesignChoiceComplete);
}

/**
 * Gets incomplete fields for a design choice
 */
export function getIncompleteFields(choice: DesignChoice): string[] {
  const incomplete: string[] = [];

  if (!choice.object.trim()) {
    incomplete.push("element");
  }
  if (!choice.action.trim()) {
    incomplete.push("action");
  }
  if (!choice.value.trim()) {
    incomplete.push("value");
  }
  if (!choice.reasoning.trim()) {
    incomplete.push("reasoning");
  }

  return incomplete;
}

/**
 * Gets a summary of completion status for all choices
 */
export function getCompletionStatus(choices: DesignChoice[]): {
  total: number;
  complete: number;
  incomplete: number;
  isValid: boolean;
} {
  const total = choices.length;
  const complete = choices.filter(isDesignChoiceComplete).length;
  const incomplete = total - complete;

  return {
    total,
    complete,
    incomplete,
    isValid: total > 0 && incomplete === 0,
  };
}
