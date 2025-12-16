"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, LogIn } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!studentId.trim()) {
      setError("Please enter your student ID");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: studentId.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        // Store student ID in sessionStorage and redirect
        sessionStorage.setItem("studentId", studentId.trim());
        sessionStorage.setItem("studentData", JSON.stringify(data.student));
        router.push("/simulator");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <FlaskConical className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            AB Testing Simulator
          </h1>
          <p className="text-gray-600">
            Learn AB testing by customizing a shopping website
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="studentId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter your student ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Start Learning</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Basic HCI Course - AB Testing Exercise
          </p>
        </div>
      </div>
    </div>
  );
}
