"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { CUSTOMIZATION_OPTIONS, DesignChoice } from "@/lib/metrics";

interface CustomizationPanelProps {
  designChoices: DesignChoice[];
  onDesignChoicesChange: (choices: DesignChoice[]) => void;
}

export default function CustomizationPanel({
  designChoices,
  onDesignChoicesChange,
}: CustomizationPanelProps) {
  const addChoice = () => {
    onDesignChoicesChange([
      ...designChoices,
      { object: "", action: "", value: "", reasoning: "" },
    ]);
  };

  const removeChoice = (index: number) => {
    onDesignChoicesChange(designChoices.filter((_, i) => i !== index));
  };

  const updateChoice = (
    index: number,
    field: keyof DesignChoice,
    value: string
  ) => {
    const newChoices = [...designChoices];
    newChoices[index] = { ...newChoices[index], [field]: value };

    // Reset dependent fields when parent changes
    if (field === "object") {
      newChoices[index].action = "";
      newChoices[index].value = "";
    } else if (field === "action") {
      newChoices[index].value = "";
    }

    onDesignChoicesChange(newChoices);
  };

  const getActionsForObject = (object: string): string[] => {
    return CUSTOMIZATION_OPTIONS.actions[object as keyof typeof CUSTOMIZATION_OPTIONS.actions] || [];
  };

  const getValuesForAction = (object: string, action: string): string[] => {
    const objectValues = CUSTOMIZATION_OPTIONS.values[object as keyof typeof CUSTOMIZATION_OPTIONS.values];
    if (!objectValues) return [];
    return objectValues[action as keyof typeof objectValues] || [];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Design Customizations</h2>
        <button
          onClick={addChoice}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Change</span>
        </button>
      </div>

      {designChoices.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No design changes yet.</p>
          <p className="text-sm">Click &quot;Add Change&quot; to start customizing the website.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {designChoices.map((choice, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-700">Change #{index + 1}</h3>
                <button
                  onClick={() => removeChoice(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Remove this change"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Object Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Element
                  </label>
                  <select
                    value={choice.object}
                    onChange={(e) => updateChoice(index, "object", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select element...</option>
                    {CUSTOMIZATION_OPTIONS.objects.map((obj) => (
                      <option key={obj} value={obj}>
                        {obj}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Action
                  </label>
                  <select
                    value={choice.action}
                    onChange={(e) => updateChoice(index, "action", e.target.value)}
                    disabled={!choice.object}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select action...</option>
                    {getActionsForObject(choice.object).map((action) => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Value Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Value
                  </label>
                  <select
                    value={choice.value}
                    onChange={(e) => updateChoice(index, "value", e.target.value)}
                    disabled={!choice.action}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select value...</option>
                    {getValuesForAction(choice.object, choice.action).map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reasoning Text Field */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Reasoning
                </label>
                <textarea
                  value={choice.reasoning}
                  onChange={(e) => updateChoice(index, "reasoning", e.target.value)}
                  placeholder="Explain why you made this change and what effect you expect it to have..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px] resize-y"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
