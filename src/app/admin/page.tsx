"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Users,
  FileText,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  LogOut,
  Loader2,
  Eye,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DesignChoice } from "@/lib/metrics";

interface Submission {
  id: string;
  studentId: string;
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

interface Student {
  id: string;
  studentId: string;
  name: string | null;
  createdAt: string;
  submissionCount: number;
  submissions: Submission[];
}

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [students, setStudents] = useState<Student[]>([]);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [bulkCount, setBulkCount] = useState(10);
  const [bulkNamePrefix, setBulkNamePrefix] = useState("");
  const [bulkStartNumber, setBulkStartNumber] = useState(1);
  const [isGeneratingBulk, setIsGeneratingBulk] = useState(false);
  const [guidMode, setGuidMode] = useState<"random" | "custom">("random");
  const [guidPrefix, setGuidPrefix] = useState("");
  const [guidStartNumber, setGuidStartNumber] = useState(1);

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    submissionId: string;
    studentId: string;
    step: 1 | 2;
  } | null>(null);
  const [isDeletingSubmission, setIsDeletingSubmission] = useState(false);

  useEffect(() => {
    const adminData = sessionStorage.getItem("adminData");
    if (adminData) {
      setIsLoggedIn(true);
      loadStudents();
    }
    setIsLoading(false);
  }, []);

  const loadStudents = async () => {
    try {
      const response = await fetch("/api/admin/students");
      const data = await response.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Failed to load students:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem("adminData", JSON.stringify(data.admin));
        setIsLoggedIn(true);
        loadStudents();
      } else {
        setLoginError(data.error || "Login failed");
      }
    } catch {
      setLoginError("Connection error");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminData");
    setIsLoggedIn(false);
    router.push("/admin");
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentId.trim()) return;

    setIsAddingStudent(true);

    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: newStudentId.trim(),
          name: newStudentName.trim() || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStudents([data.student, ...students]);
        setNewStudentId("");
        setNewStudentName("");
      } else {
        alert(data.error || "Failed to add student");
      }
    } catch {
      alert("Connection error");
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (
      !confirm(
        `Are you sure you want to delete student ${studentId} and all their submissions?`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/students?studentId=${studentId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (data.success) {
        setStudents(students.filter((s) => s.studentId !== studentId));
      } else {
        alert(data.error || "Failed to delete student");
      }
    } catch {
      alert("Connection error");
    }
  };

  const handleBulkGenerate = async () => {
    if (bulkCount < 1 || bulkCount > 100) {
      alert("Please enter a number between 1 and 100");
      return;
    }

    setIsGeneratingBulk(true);

    try {
      const response = await fetch("/api/admin/students/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          count: bulkCount,
          namePrefix: bulkNamePrefix.trim() || null,
          startNumber: bulkStartNumber,
          guidMode: guidMode,
          guidPrefix: guidPrefix.trim() || null,
          guidStartNumber: guidStartNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStudents([...data.students, ...students]);
        const nameInfo = bulkNamePrefix.trim()
          ? ` named "${bulkNamePrefix} ${bulkStartNumber}" to "${bulkNamePrefix} ${bulkStartNumber + data.count - 1}"`
          : "";
        alert(`Successfully created ${data.count} students${nameInfo}`);
        // Update start numbers for next batch
        setBulkStartNumber(bulkStartNumber + data.count);
        if (guidMode === "custom") {
          setGuidStartNumber(guidStartNumber + data.count);
        }
      } else {
        alert(data.error || "Failed to generate students");
      }
    } catch {
      alert("Connection error");
    } finally {
      setIsGeneratingBulk(false);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    setIsDeletingSubmission(true);
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });

      const data = await response.json();

      if (data.success) {
        // Reload students to update the list
        await loadStudents();
        setDeleteConfirmation(null);
      } else {
        alert(`Failed to delete submission: ${data.error}`);
      }
    } catch (error) {
      console.error("Delete submission error:", error);
      alert("Failed to delete submission");
    } finally {
      setIsDeletingSubmission(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600">AB Testing Simulator Administration</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6" />
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-800 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.reduce((acc, s) => acc + s.submissionCount, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-500">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter((s) => s.submissionCount > 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Student Form */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Student
          </h2>
          <form onSubmit={handleAddStudent} className="flex gap-4">
            <input
              type="text"
              placeholder="Student ID (required)"
              value={newStudentId}
              onChange={(e) => setNewStudentId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Name (optional)"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isAddingStudent || !newStudentId.trim()}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              <span>Add Student</span>
            </button>
          </form>
        </div>

        {/* Bulk Generate Students */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Bulk Generate Students
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Generate multiple students with either randomly generated GUIDs or custom sequential IDs.
            Optionally assign names with a prefix (e.g., &quot;User&quot;, &quot;Group&quot;, &quot;Student&quot;).
          </p>
          
          {/* GUID Mode Selection */}
          <div className="mb-4 flex gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="guidMode"
                value="random"
                checked={guidMode === "random"}
                onChange={(e) => setGuidMode(e.target.value as "random")}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-sm text-gray-700">Random GUIDs</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="guidMode"
                value="custom"
                checked={guidMode === "custom"}
                onChange={(e) => setGuidMode(e.target.value as "custom")}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-sm text-gray-700">Custom Sequential IDs</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1">
              <label htmlFor="bulkCount" className="text-sm text-gray-600">
                Count
              </label>
              <input
                type="number"
                id="bulkCount"
                min={1}
                max={100}
                value={bulkCount}
                onChange={(e) =>
                  setBulkCount(
                    Math.min(100, Math.max(1, parseInt(e.target.value) || 1)),
                  )
                }
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="bulkNamePrefix" className="text-sm text-gray-600">
                Name Prefix (optional)
              </label>
              <input
                type="text"
                id="bulkNamePrefix"
                placeholder="e.g., User, Group, Student"
                value={bulkNamePrefix}
                onChange={(e) => setBulkNamePrefix(e.target.value)}
                className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="bulkStartNumber"
                className="text-sm text-gray-600"
              >
                Start #
              </label>
              <input
                type="number"
                id="bulkStartNumber"
                min={1}
                value={bulkStartNumber}
                onChange={(e) =>
                  setBulkStartNumber(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {/* Custom GUID fields - only show if custom mode selected */}
            {guidMode === "custom" && (
              <>
                <div className="flex flex-col gap-1">
                  <label htmlFor="guidPrefix" className="text-sm text-gray-600">
                    ID Prefix (optional)
                  </label>
                  <input
                    type="text"
                    id="guidPrefix"
                    placeholder="e.g., STU, ID"
                    value={guidPrefix}
                    onChange={(e) => setGuidPrefix(e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="guidStartNumber" className="text-sm text-gray-600">
                    ID Start #
                  </label>
                  <input
                    type="number"
                    id="guidStartNumber"
                    min={1}
                    value={guidStartNumber}
                    onChange={(e) =>
                      setGuidStartNumber(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </>
            )}
            
            <button
              type="button"
              onClick={handleBulkGenerate}
              disabled={isGeneratingBulk}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isGeneratingBulk ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Users className="w-5 h-5" />
                  <span>Generate Students</span>
                </>
              )}
            </button>
          </div>
          {bulkNamePrefix.trim() && (
            <p className="text-sm text-gray-500 mt-3">
              Preview: Names will be &quot;{bulkNamePrefix} {bulkStartNumber}
              &quot; through &quot;{bulkNamePrefix}{" "}
              {bulkStartNumber + bulkCount - 1}&quot;
            </p>
          )}
        </div>

        {/* Students List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Students</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {students.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No students registered yet.
              </div>
            ) : (
              students.map((student) => (
                <div key={student.id}>
                  <div
                    className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      setExpandedStudent(
                        expandedStudent === student.studentId
                          ? null
                          : student.studentId,
                      )
                    }
                  >
                    <div className="flex items-center space-x-4">
                      {expandedStudent === student.studentId ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.studentId}
                        </p>
                        {student.name && (
                          <p className="text-sm text-gray-500">
                            {student.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {student.submissionCount} submission
                        {student.submissionCount !== 1 ? "s" : ""}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStudent(student.studentId);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Submissions */}
                  {expandedStudent === student.studentId &&
                    student.submissions.length > 0 && (
                      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                          Submissions
                        </h4>
                        <div className="space-y-2">
                          {student.submissions.map((submission) => (
                            <div
                              key={submission.id}
                              className="bg-white rounded-lg p-4 border border-gray-200"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    submission.createdAt,
                                  ).toLocaleString()}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() =>
                                      setSelectedSubmission(submission)
                                    }
                                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 text-sm"
                                  >
                                    <Eye className="w-4 h-4" />
                                    <span>View Details</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      setDeleteConfirmation({
                                        submissionId: submission.id,
                                        studentId: student.studentId,
                                        step: 1,
                                      })
                                    }
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="grid grid-cols-5 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-500">Conv:</span>{" "}
                                  <span className="font-medium">
                                    {submission.metrics.conversionRate}%
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Bounce:</span>{" "}
                                  <span className="font-medium">
                                    {submission.metrics.bounceRate}%
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">CTR:</span>{" "}
                                  <span className="font-medium">
                                    {submission.metrics.clickThroughRate}%
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Time:</span>{" "}
                                  <span className="font-medium">
                                    {submission.metrics.avgTimeOnPage}s
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Cart:</span>{" "}
                                  <span className="font-medium">
                                    {submission.metrics.cartAbandonmentRate}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedSubmission(null)}
          />
          <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Submission Details
              </h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {/* Design Choices */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  Design Choices
                </h3>
                <div className="space-y-2">
                  {selectedSubmission.designChoices.map((choice, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="text-sm">
                        <span className="font-medium">{choice.object}</span> →{" "}
                        {choice.action} →{" "}
                        <span className="text-indigo-600">{choice.value}</span>
                      </div>
                      {choice.reasoning && (
                        <p className="text-sm text-gray-500 mt-1 italic">
                          &quot;{choice.reasoning}&quot;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Metrics</h3>
                <div className="grid grid-cols-5 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedSubmission.metrics.conversionRate}%
                    </p>
                    <p className="text-sm text-gray-500">Conversion</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedSubmission.metrics.bounceRate}%
                    </p>
                    <p className="text-sm text-gray-500">Bounce</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedSubmission.metrics.clickThroughRate}%
                    </p>
                    <p className="text-sm text-gray-500">CTR</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedSubmission.metrics.avgTimeOnPage}s
                    </p>
                    <p className="text-sm text-gray-500">Time</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedSubmission.metrics.cartAbandonmentRate}%
                    </p>
                    <p className="text-sm text-gray-500">Cart Abandon</p>
                  </div>
                </div>
              </div>

              {/* Screenshot */}
              {selectedSubmission.screenshotPath && (
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-3">Screenshot</h3>
                  <img
                    src={selectedSubmission.screenshotPath}
                    alt="Submission screenshot"
                    className="w-full rounded-lg border border-gray-200"
                  />
                </div>
              )}

              {/* AI Report */}
              {selectedSubmission.aiReport && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">AI Report</h3>
                  <div className="prose prose-sm max-w-none bg-gray-50 rounded-lg p-4 border border-gray-200">
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
                          <ul
                            className="list-disc list-outside ml-6 my-4"
                            {...props}
                          />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol
                            className="list-decimal list-outside ml-6 my-4"
                            {...props}
                          />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="pl-2" {...props} />
                        ),
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
                          <h1
                            className="text-2xl font-bold mt-6 mb-4"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            className="text-xl font-bold mt-5 mb-3"
                            {...props}
                          />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3
                            className="text-lg font-semibold mt-4 mb-2"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="my-3 leading-relaxed" {...props} />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong
                            className="font-semibold text-gray-900"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {selectedSubmission.aiReport}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isDeletingSubmission && setDeleteConfirmation(null)}
          />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {deleteConfirmation.step === 1
                  ? "Delete Submission?"
                  : "Are you absolutely sure?"}
              </h2>
              <p className="text-gray-600">
                {deleteConfirmation.step === 1 ? (
                  <>
                    This will permanently delete this submission for student{" "}
                    <span className="font-semibold">
                      {deleteConfirmation.studentId}
                    </span>
                    .
                  </>
                ) : (
                  <>
                    This action <span className="font-semibold">cannot be undone</span>. The
                    submission data and associated screenshot will be permanently removed.
                  </>
                )}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                disabled={isDeletingSubmission}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmation.step === 1) {
                    setDeleteConfirmation({
                      ...deleteConfirmation,
                      step: 2,
                    });
                  } else {
                    handleDeleteSubmission(deleteConfirmation.submissionId);
                  }
                }}
                disabled={isDeletingSubmission}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isDeletingSubmission ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>
                    {deleteConfirmation.step === 1 ? "Continue" : "Delete Permanently"}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
