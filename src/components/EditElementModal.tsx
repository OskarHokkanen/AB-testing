"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import { CUSTOMIZATION_OPTIONS, DesignChoice } from "@/lib/metrics";

interface EditElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementName: string;
  designChoices: DesignChoice[];
  onSaveChange: (choice: DesignChoice) => void;
}

export default function EditElementModal({
  isOpen,
  onClose,
  elementName,
  designChoices,
  onSaveChange,
}: EditElementModalProps) {
  const [action, setAction] = useState("");
  const [value, setValue] = useState("");
  const [reasoning, setReasoning] = useState("");

  // Reset form when modal opens with a new element
  useEffect(() => {
    if (isOpen) {
      setAction("");
      setValue("");
      setReasoning("");
    }
  }, [isOpen, elementName]);

  if (!isOpen) return null;

  const availableActions = CUSTOMIZATION_OPTIONS.actions[
    elementName as keyof typeof CUSTOMIZATION_OPTIONS.actions
  ] || [];

  const availableValues = action
    ? (CUSTOMIZATION_OPTIONS.values[
        elementName as keyof typeof CUSTOMIZATION_OPTIONS.values
      ] as Record<string, string[]>)?.[action] || []
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!action || !value || !reasoning.trim()) {
      alert("Please complete all fields before saving.");
      return;
    }

    const newChoice: DesignChoice = {
      object: elementName,
      action,
      value,
      reasoning,
    };

    onSaveChange(newChoice);
    onClose();
  };

  const isFormValid = action && value && reasoning.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit {elementName}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Action Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action
              </label>
              <select
                value={action}
                onChange={(e) => {
                  setAction(e.target.value);
                  setValue(""); // Reset value when action changes
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select action...</option>
                {availableActions.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </select>
            </div>

            {/* Value Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value
              </label>
              <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!action}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select value...</option>
                {availableValues.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>

            {/* Reasoning Text Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reasoning
              </label>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                placeholder="Explain why you made this change and what effect you expect it to have..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] resize-y"
              />
            </div>

            {/* Existing Changes for this Element */}
            {designChoices.filter((c) => c.object === elementName).length > 0 && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Existing changes for this element:
                </h3>
                <div className="space-y-2">
                  {designChoices
                    .filter((c) => c.object === elementName)
                    .map((choice, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-lg p-3 text-sm"
                      >
                        <div className="flex items-center space-x-2 text-gray-600 mb-1">
                          <span className="font-medium">{choice.action}</span>
                          <span>→</span>
                          <span className="text-indigo-600 font-medium">
                            {choice.value}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs italic">
                          &quot;{choice.reasoning}&quot;
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Add Change</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
