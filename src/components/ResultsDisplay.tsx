"use client";

import React, { useState } from "react";
import { apiFetch } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  MousePointer,
  ShoppingCart,
  Users,
  RefreshCw,
} from "lucide-react";

interface MetricsResult {
  conversionRate: number;
  bounceRate: number;
  clickThroughRate: number;
  avgTimeOnPage: number;
  cartAbandonmentRate: number;
}

interface ResultsDisplayProps {
  metrics: MetricsResult;
  aiReport: string | null;
  screenshotPath?: string | null;
  submissionId?: string;
  onReportRetry?: (newReport: string) => void;
}

// Baseline metrics for comparison
const BASELINE = {
  conversionRate: 2.5,
  bounceRate: 45,
  clickThroughRate: 3.5,
  avgTimeOnPage: 120,
  cartAbandonmentRate: 70,
};

function MetricCard({
  label,
  value,
  baseline,
  unit,
  icon: Icon,
  lowerIsBetter = false,
}: {
  label: string;
  value: number;
  baseline: number;
  unit: string;
  icon: React.ElementType;
  lowerIsBetter?: boolean;
}) {
  const diff = value - baseline;
  const percentChange = ((diff / baseline) * 100).toFixed(1);
  const isImproved = lowerIsBetter ? diff < 0 : diff > 0;
  const isWorse = lowerIsBetter ? diff > 0 : diff < 0;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-gray-600">
          <Icon className="w-5 h-5" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        {diff !== 0 && (
          <div
            className={`flex items-center text-sm ${
              isImproved
                ? "text-green-600"
                : isWorse
                  ? "text-red-600"
                  : "text-gray-500"
            }`}
          >
            {isImproved ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {Math.abs(Number(percentChange))}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {value}
        {unit}
      </div>
      <div className="text-sm text-gray-500 mt-1">
        Baseline: {baseline}
        {unit}
      </div>
    </div>
  );
}

export default function ResultsDisplay({
  metrics,
  aiReport,
  screenshotPath,
  submissionId,
  onReportRetry,
}: ResultsDisplayProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);
  const [currentReport, setCurrentReport] = useState(aiReport);

  const handleRetry = async () => {
    if (!submissionId) return;

    setIsRetrying(true);
    setRetryError(null);

    try {
      const response = await apiFetch("/api/submissions/retry-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });

      const data = await response.json();

      if (data.success && data.submission.aiReport) {
        setCurrentReport(data.submission.aiReport);
        if (onReportRetry) {
          onReportRetry(data.submission.aiReport);
        }
      } else {
        setRetryError(data.error || "Failed to generate report");
      }
    } catch (error) {
      console.error("Retry error:", error);
      setRetryError("Connection error. Please try again.");
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            label="Conversion Rate"
            value={metrics.conversionRate}
            baseline={BASELINE.conversionRate}
            unit="%"
            icon={TrendingUp}
          />
          <MetricCard
            label="Bounce Rate"
            value={metrics.bounceRate}
            baseline={BASELINE.bounceRate}
            unit="%"
            icon={Users}
            lowerIsBetter
          />
          <MetricCard
            label="Click-Through Rate"
            value={metrics.clickThroughRate}
            baseline={BASELINE.clickThroughRate}
            unit="%"
            icon={MousePointer}
          />
          <MetricCard
            label="Avg. Time on Page"
            value={metrics.avgTimeOnPage}
            baseline={BASELINE.avgTimeOnPage}
            unit="s"
            icon={Clock}
          />
          <MetricCard
            label="Cart Abandonment"
            value={metrics.cartAbandonmentRate}
            baseline={BASELINE.cartAbandonmentRate}
            unit="%"
            icon={ShoppingCart}
            lowerIsBetter
          />
        </div>
      </div>

      {/* Screenshot */}
      {screenshotPath && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Website Screenshot
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <img
              src={screenshotPath}
              alt="Website screenshot"
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* AI Report */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          AI Analysis Report
        </h3>
        {currentReport ? (
          <div className="prose prose-indigo max-w-none">
            <style jsx>{`
              :global(.prose li > p) {
                display: inline;
                margin: 0;
              }
              :global(.prose li) {
                margin-top: 0.25rem;
                margin-bottom: 0.25rem;
              }
            `}</style>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-outside ml-6 my-4" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol
                    className="list-decimal list-outside ml-6 my-4"
                    {...props}
                  />
                ),
                li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4">
                    <table
                      className="min-w-full divide-y divide-gray-200"
                      {...props}
                    />
                  </div>
                ),
                thead: ({ node, ...props }) => (
                  <thead className="bg-gray-50" {...props} />
                ),
                tbody: ({ node, ...props }) => (
                  <tbody
                    className="bg-white divide-y divide-gray-200"
                    {...props}
                  />
                ),
                tr: ({ node, ...props }) => <tr {...props} />,
                th: ({ node, ...props }) => (
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    {...props}
                  />
                ),
                h1: ({ node, ...props }) => (
                  <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-bold mt-5 mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-semibold mt-4 mb-2" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="my-3 leading-relaxed" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-semibold text-gray-900" {...props} />
                ),
              }}
            >
              {currentReport}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>AI report unavailable.</strong> The AI analysis service
                failed to generate a report, but your submission was saved
                successfully. You can still view your metrics and design choices
                above.
              </p>
            </div>
            {submissionId && (
              <div>
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
                  />
                  <span>{isRetrying ? "Generating..." : "Retry Report"}</span>
                </button>
                {retryError && (
                  <p className="text-sm text-red-600 mt-2">{retryError}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reflection Questions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Reflection Questions
        </h3>
        <div className="space-y-3">
          <p className="text-gray-700">
            1. What were the key insights from your A/B test results?
          </p>
          <p className="text-gray-700">
            2. Which design changes had the most significant impact on your metrics, and why do you think that was?
          </p>
          <p className="text-gray-700">
            3. Did any results surprise you? How did they differ from your initial hypotheses?
          </p>
          <p className="text-gray-700">
            4. Based on these results, what would you test differently in your next experiment?
          </p>
          <p className="text-gray-700">
            5. How would you apply what you learned from this A/B test to improve the overall user experience?
          </p>
        </div>
      </div>
    </div>
  );
}
