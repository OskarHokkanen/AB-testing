"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, apiUrl } from "@/lib/api";
import {
  FlaskConical,
  LogOut,
  Send,
  History,
  Eye,
  Settings,
  Loader2,
  X,
  Save,
  AlertCircle,
} from "lucide-react";
import ShoppingWebsite from "@/components/ShoppingWebsite";
import CustomizationPanel from "@/components/CustomizationPanel";
import ResultsDisplay from "@/components/ResultsDisplay";
import SubmissionHistory from "@/components/SubmissionHistory";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import EditElementModal from "@/components/EditElementModal";
import { DesignChoice } from "@/lib/metrics";
import {
  areAllDesignChoicesComplete,
  getCompletionStatus,
} from "@/lib/validation";

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
  const [studentName, setStudentName] = useState<string | null>(null);
  const [designChoices, setDesignChoices] = useState<DesignChoice[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "customize">(
    "customize",
  );
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(6);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string>("");
  const websiteRef = useRef<HTMLDivElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

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
        const response = await apiFetch("/api/auth/login", {
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
        setStudentName(data.student.name);
        setRemainingAttempts(data.student.remainingAttempts || 6);

        if (data.student.submissions) {
          setSubmissions(
            data.student.submissions.map(
              (s: {
                designChoices: string | DesignChoice[];
                [key: string]: unknown;
              }) => ({
                ...s,
                designChoices:
                  typeof s.designChoices === "string"
                    ? JSON.parse(s.designChoices)
                    : s.designChoices,
              }),
            ),
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

  // Load draft design choices on mount
  useEffect(() => {
    if (!studentId) return;

    const loadDraft = async () => {
      try {
        console.log("[Draft] Loading draft for student:", studentId);
        const response = await apiFetch(`/api/drafts?studentId=${studentId}`);
        const data = await response.json();

        if (data.success && data.draftDesignChoices.length > 0) {
          console.log(
            "[Draft] Loaded",
            data.draftDesignChoices.length,
            "design choices from draft",
          );
          setDesignChoices(data.draftDesignChoices);
        } else {
          console.log("[Draft] No draft found or draft is empty");
        }
      } catch (error) {
        console.error("[Draft] Failed to load draft:", error);
      }
    };

    loadDraft();
  }, [studentId]);

  const saveDraft = useCallback(async () => {
    if (!studentId) return;

    console.log(
      "[Draft] Saving draft with",
      designChoices.length,
      "design choices",
    );
    setIsSavingDraft(true);
    try {
      const response = await apiFetch("/api/drafts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, designChoices }),
      });

      const data = await response.json();
      if (data.success) {
        console.log("[Draft] Successfully saved draft");
        setLastSaved(new Date());
      } else {
        console.error("[Draft] Failed to save draft:", data.error);
      }
    } catch (error) {
      console.error("[Draft] Error saving draft:", error);
    } finally {
      setIsSavingDraft(false);
    }
  }, [studentId, designChoices]);

  // Auto-save draft when design choices change
  useEffect(() => {
    if (!studentId || selectedSubmission) {
      console.log(
        "[Draft] Auto-save skipped - studentId:",
        studentId,
        "selectedSubmission:",
        !!selectedSubmission,
      );
      return;
    }

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    console.log("[Draft] Auto-save scheduled in 2 seconds");
    // Set new timer to save after 2 seconds of inactivity
    autoSaveTimerRef.current = setTimeout(() => {
      saveDraft();
    }, 2000);

    // Cleanup on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [designChoices, studentId, selectedSubmission, saveDraft]);

  const clearDraft = async () => {
    if (!studentId) return;

    try {
      console.log("[Draft] Clearing draft for student:", studentId);
      const response = await apiFetch(`/api/drafts?studentId=${studentId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        console.log("[Draft] Successfully cleared draft");
      } else {
        console.error("[Draft] Failed to clear draft:", data.error);
      }
    } catch (error) {
      console.error("[Draft] Error clearing draft:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("studentId");
    sessionStorage.removeItem("studentData");
    router.push("/");
  };

  const handleSubmitClick = () => {
    if (!studentId || designChoices.length === 0) return;

    // Validate all choices are complete (including reasoning)
    if (!areAllDesignChoicesComplete(designChoices)) {
      alert(
        "Please complete all fields (element, action, value, and reasoning) for each design change before submitting.",
      );
      return;
    }

    // Check if student has remaining attempts
    if (remainingAttempts <= 0) {
      alert("You have used all 6 submission attempts.");
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    try {
      // Submit design choices
      const response = await apiFetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, designChoices }),
      });

      const data = await response.json();

      if (data.success) {
        // Update remaining attempts
        setRemainingAttempts(data.remainingAttempts || 0);
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

            await apiFetch("/api/screenshot", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                submissionId: data.submission.id,
                html,
              }),
            });

            // Refetch all submissions to get the updated one with screenshot
            const updatedResponse = await apiFetch(
              `/api/submissions?studentId=${studentId}`,
            );
            const updatedData = await updatedResponse.json();

            if (updatedData.success && updatedData.submissions.length > 0) {
              // Find the newly created submission
              const updatedSubmission = updatedData.submissions.find(
                (s: Submission) => s.id === data.submission.id,
              );
              if (updatedSubmission) {
                setSubmissions(updatedData.submissions);
                setSelectedSubmission(updatedSubmission);
              } else {
                // Fallback to original submission if fetch fails
                setSubmissions([data.submission, ...submissions]);
                setSelectedSubmission(data.submission);
              }
            } else {
              // Fallback to original submission if screenshot fails
              setSubmissions([data.submission, ...submissions]);
              setSelectedSubmission(data.submission);
            }
          } catch (screenshotError) {
            console.error("Screenshot generation failed:", screenshotError);
            // Use original submission if screenshot fails
            setSubmissions([data.submission, ...submissions]);
            setSelectedSubmission(data.submission);
          }
        } else {
          // No screenshot needed, use original submission
          setSubmissions([data.submission, ...submissions]);
          setSelectedSubmission(data.submission);
        }
        setDesignChoices([]);
        // Clear the draft after successful submission
        await clearDraft();
        setLastSaved(null);
      } else {
        alert(data.error || "Submission failed");
        // If it's a limit reached error, update remaining attempts
        if (data.error && data.error.includes("Maximum submission limit")) {
          setRemainingAttempts(0);
        }
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
    setLastSaved(null);
  };

  const handleElementClick = (elementName: string) => {
    // Only allow editing when not viewing a submission
    if (!selectedSubmission) {
      setSelectedElement(elementName);
      setShowEditModal(true);
    }
  };

  const handleSaveChange = (newChoice: DesignChoice) => {
    setDesignChoices([...designChoices, newChoice]);
  };

  const completionStatus = getCompletionStatus(designChoices);

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
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">
                  {studentName || studentId}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    remainingAttempts === 0
                      ? "bg-red-100 text-red-700"
                      : remainingAttempts === 1
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {remainingAttempts} attempt
                  {remainingAttempts !== 1 ? "s" : ""} left
                </span>
              </div>
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
              <h2 className="font-semibold text-gray-900">
                Submission History
              </h2>
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
              submissionId={selectedSubmission.id}
              onReportRetry={(newReport) => {
                setSelectedSubmission({
                  ...selectedSubmission,
                  aiReport: newReport,
                });
                // Also update in submissions list
                setSubmissions(
                  submissions.map((s) =>
                    s.id === selectedSubmission.id
                      ? { ...s, aiReport: newReport }
                      : s,
                  ),
                );
              }}
            />
          </div>
        ) : (
          /* Experiment View */
          <div className="space-y-6">
            {/* Top: Customization Panel */}
            <div>
              <CustomizationPanel
                designChoices={designChoices}
                onDesignChoicesChange={setDesignChoices}
              />

              {/* Validation Status */}
              {designChoices.length > 0 && (
                <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {completionStatus.isValid ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-green-700">
                            All changes complete and ready to submit
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-medium text-amber-700">
                            {completionStatus.incomplete} incomplete change
                            {completionStatus.incomplete !== 1 ? "s" : ""} (
                            {completionStatus.complete}/{completionStatus.total}{" "}
                            complete)
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {isSavingDraft ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : lastSaved ? (
                        <>
                          <Save className="w-3 h-3" />
                          <span>Saved {lastSaved.toLocaleTimeString()}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  onClick={handleSubmitClick}
                  disabled={
                    isSubmitting ||
                    !completionStatus.isValid ||
                    remainingAttempts <= 0
                  }
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
                  {remainingAttempts === 0
                    ? "No submission attempts remaining"
                    : designChoices.length === 0
                      ? "Add at least one design change to submit"
                      : !completionStatus.isValid
                        ? "Complete all fields (including reasoning) to enable submission"
                        : `${designChoices.length} design change${
                            designChoices.length !== 1 ? "s" : ""
                          } ready to submit`}
                </p>
              </div>
            </div>

            {/* Bottom: Full-Width Website Preview */}
            <div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Live Preview
                  </span>
                </div>
                <div ref={websiteRef} className="h-[800px] overflow-y-auto">
                  <ShoppingWebsite
                    designChoices={designChoices}
                    onElementClick={handleElementClick}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onConfirm={handleSubmit}
        onCancel={() => setShowConfirmDialog(false)}
        remainingAttempts={remainingAttempts}
        isSubmitting={isSubmitting}
      />

      {/* Edit Element Modal */}
      <EditElementModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        elementName={selectedElement}
        designChoices={designChoices}
        onSaveChange={handleSaveChange}
      />

      {/* Full-Screen Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
            <div className="mb-6">
              <Loader2 className="w-16 h-16 animate-spin text-indigo-600 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Processing Your Experiment
            </h3>
            <p className="text-gray-600 mb-4">
              We're analyzing your design choices and generating detailed
              results. This may take 30-60 seconds.
            </p>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <p className="text-sm text-indigo-800 font-medium">
                Please don't close this window or navigate away
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
