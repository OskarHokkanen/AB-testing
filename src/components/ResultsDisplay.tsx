"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  MousePointer,
  ShoppingCart,
  Users,
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
}: ResultsDisplayProps) {
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
      {aiReport && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            AI Analysis Report
          </h3>
          <div className="prose prose-indigo max-w-none">
            <ReactMarkdown>{aiReport}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
