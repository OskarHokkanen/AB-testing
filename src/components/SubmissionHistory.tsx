"use client";

import React from "react";
import { Calendar, ChevronRight } from "lucide-react";
import { DesignChoice } from "@/lib/metrics";

interface Submission {
  id: string;
  designChoices: DesignChoice[];
  metrics: {
    conversionRate: number;
    bounceRate: number;
    clickThroughRate: number;
    avgTimeOnPage: number;
    cartAbandonmentRate: number;
  };
  aiReport: string | null;
  screenshotPath: string | null;
  createdAt: string;
}

interface SubmissionHistoryProps {
  submissions: Submission[];
  onSelectSubmission: (submission: Submission) => void;
}

export default function SubmissionHistory({
  submissions,
  onSelectSubmission,
}: SubmissionHistoryProps) {
  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 text-center text-gray-500">
        <p>No previous submissions found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Previous Submissions
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {submissions.map((submission) => (
          <button
            key={submission.id}
            onClick={() => onSelectSubmission(submission)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
          >
            <div>
              <div className="flex items-center space-x-2 text-gray-600 text-sm mb-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(submission.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="font-medium text-gray-900">
                {submission.designChoices.length} design change
                {submission.designChoices.length !== 1 ? "s" : ""}
              </div>
              {submission.metrics && (
                <div className="text-sm text-gray-500 mt-1">
                  Conversion: {submission.metrics.conversionRate}% | Bounce:{" "}
                  {submission.metrics.bounceRate}%
                </div>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
}
