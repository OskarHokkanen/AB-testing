"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FlaskConical,
  LogOut,
  Send,
  History,
  Eye,
  Settings,
  Loader2,
  X,
} from "lucide-react";
import ShoppingWebsite from "@/components/ShoppingWebsite";
import CustomizationPanel from "@/components/CustomizationPanel";
import ResultsDisplay from "@/components/ResultsDisplay";
import SubmissionHistory from "@/components/SubmissionHistory";
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

export default function SimulatorPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [designChoices, setDesignChoices] = useState<DesignChoice[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "customize">("customize");
  const websiteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedStudentId = sessionStorage.getItem("studentId");

    if (!storedStudentId) {
      router.push("/");
      return;
    }

    // Verify the student ID is still valid in the database
    const verifyStudent = async () => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: storedStudentId }),
        });

        const data = await response.json();

        if (!data.success) {
          // Student ID no longer valid, clear session and redirect
          sessionStorage.removeItem("studentId");
          sessionStorage.removeItem("studentData");
          router.push("/");
          return;
        }

        // Student is valid, set state
        setStudentId(storedStudentId);

        if (data.student.submissions) {
          setSubmissions(
            data.student.submissions.map((s: { designChoices: string | DesignChoice[]; [key: string]: unknown }) => ({
              ...s,
              designChoices:
                typeof s.designChoices === "string"
                  ? JSON.parse(s.designChoices)
                  : s.designChoices,
            }))
          );
        }
      } catch {
        // Network error, redirect to login
        sessionStorage.removeItem("studentId");
        sessionStorage.removeItem("studentData");
        router.push("/");
      }
    };

    verifyStudent();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("studentId");
    sessionStorage.removeItem("studentData");
    router.push("/");
  };

  const handleSubmit = async () => {
    if (!studentId || designChoices.length === 0) return;

    // Validate all choices are complete
    const incompleteChoice = designChoices.find(
      (c) => !c.object || !c.action || !c.value
    );
    if (incompleteChoice) {
      alert("Please complete all design choices before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit design choices
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, designChoices }),
      });

      const data = await response.json();

      if (data.success) {
        // Try to generate screenshot
        if (websiteRef.current) {
          try {
            const html = `
              <!DOCTYPE html>
              <html>
              <head>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                  body { font-family: Arial, sans-serif; }
                </style>
              </head>
              <body>
                ${websiteRef.current.innerHTML}
              </body>
              </html>
            `;

            await fetch("/api/screenshot", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                submissionId: data.submission.id,
                html,
              }),
            });
          } catch (screenshotError) {
            console.error("Screenshot generation failed:", screenshotError);
          }
        }

        // Update submissions list
        setSubmissions([data.submission, ...submissions]);
        setSelectedSubmission(data.submission);
        setDesignChoices([]);
      } else {
        alert(data.error || "Submission failed");
      }
    } catch {
      alert("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setShowHistory(false);
  };

  const handleNewExperiment = () => {
    setSelectedSubmission(null);
    setDesignChoices([]);
  };

  if (!studentId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FlaskConical className="w-6 h-6 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">
                AB Testing Simulator
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Student: <strong>{studentId}</strong>
              </span>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <History className="w-5 h-5" />
                <span className="hidden sm:inline">History</span>
                {submissions.length > 0 && (
                  <span className="bg-indigo-100 text-indigo-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {submissions.length}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* History Sidebar */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowHistory(false)}
          />
          <div className="relative ml-auto w-full max-w-md bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Submission History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <SubmissionHistory
                submissions={submissions}
                onSelectSubmission={handleSelectSubmission}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {selectedSubmission ? (
          /* Results View */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Submission Results
              </h2>
              <button
                onClick={handleNewExperiment}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                <FlaskConical className="w-5 h-5" />
                <span>New Experiment</span>
              </button>
            </div>

            {/* Design Choices Summary */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Design Choices Made
              </h3>
              <div className="space-y-3">
                {selectedSubmission.designChoices.map((choice, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <span className="font-medium text-gray-900">
                        {choice.object}
                      </span>
                      <span>→</span>
                      <span>{choice.action}</span>
                      <span>→</span>
                      <span className="text-indigo-600 font-medium">
                        {choice.value}
                      </span>
                    </div>
                    {choice.reasoning && (
                      <p className="text-sm text-gray-500 italic">
                        &quot;{choice.reasoning}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <ResultsDisplay
              metrics={selectedSubmission.metrics}
              aiReport={selectedSubmission.aiReport}
              screenshotPath={selectedSubmission.screenshotPath}
            />
          </div>
        ) : (
          /* Experiment View */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Customization Panel */}
            <div className="order-2 lg:order-1">
              {/* Mobile Tabs */}
              <div className="lg:hidden flex mb-4 bg-white rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setActiveTab("customize")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg ${
                    activeTab === "customize"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Customize</span>
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg ${
                    activeTab === "preview"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
              </div>

              <div className={`${activeTab === "preview" ? "lg:block hidden" : ""}`}>
                <CustomizationPanel
                  designChoices={designChoices}
                  onDesignChoicesChange={setDesignChoices}
                />

                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || designChoices.length === 0}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Submit Experiment</span>
                      </>
                    )}
                  </button>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    {designChoices.length === 0
                      ? "Add at least one design change to submit"
                      : `${designChoices.length} design change${
                          designChoices.length !== 1 ? "s" : ""
                        } ready to submit`}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Website Preview */}
            <div className={`order-1 lg:order-2 ${activeTab === "customize" ? "lg:block hidden" : ""}`}>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-20">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Live Preview
                  </span>
                </div>
                <div
                  ref={websiteRef}
                  className="h-[600px] overflow-y-auto"
                  style={{ transform: "scale(0.9)", transformOrigin: "top left", width: "111.11%" }}
                >
                  <ShoppingWebsite designChoices={designChoices} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
