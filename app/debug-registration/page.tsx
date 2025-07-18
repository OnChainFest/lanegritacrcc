"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, Database, TestTube, AlertTriangle } from "lucide-react"

export default function DebugRegistrationPage() {
  const [loading, setLoading] = useState(false)
  const [schemaResults, setSchemaResults] = useState<any>(null)
  const [registrationResults, setRegistrationResults] = useState<any>(null)

  const testDatabaseSchema = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug-registration-schema")
      const data = await response.json()
      setSchemaResults(data)
    } catch (error) {
      setSchemaResults({
        success: false,
        error: "Network error",
        details: error,
      })
    } finally {
      setLoading(false)
    }
  }

  const testRegistration = async () => {
    setLoading(true)
    try {
      const testData = {
        name: "Test Player Debug",
        nationality: "Nacional",
        email: `debug-test-${Date.now()}@example.com`,
        passport: "DEBUG123",
        league: "Debug League",
        played_in_2024: false,
        gender: "M",
        country: "national",
        categories: {
          handicap: true,
          senior: false,
          scratch: false,
        },
        extras: {
          reenganche: false,
          marathon: true,
          desperate: false,
        },
        total_cost: 92,
        currency: "USD",
        payment_status: "pending",
      }

      const response = await fetch("/api/register-player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      })

      const data = await response.json()
      setRegistrationResults({
        ...data,
        test_type: "registration",
        status_code: response.status,
        test_data: testData,
      })
    } catch (error) {
      setRegistrationResults({
        success: false,
        error: "Registration test failed",
        details: error,
        test_type: "registration",
      })
    } finally {
      setLoading(false)
    }
  }

  const ResultCard = ({ title, results, icon }: { title: string; results: any; icon: React.ReactNode }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {results?.success ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : results?.success === false ? (
            <XCircle className="w-6 h-6 text-red-600" />
          ) : (
            icon
          )}
          {title}
          {results && (
            <Badge variant={results.success ? "default" : "destructive"}>
              {results.success ? "SUCCESS" : "FAILED"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {results ? (
          <div className="space-y-4">
            {results.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <h4 className="font-semibold text-red-900">Error</h4>
                </div>
                <p className="text-red-800 text-sm">{results.error}</p>
                {results.details && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-red-700 text-sm">Show details</summary>
                    <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(results.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {results.success && results.message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-green-900">Success</h4>
                </div>
                <p className="text-green-800 text-sm">{results.message}</p>
              </div>
            )}

            {results.sample_data && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Sample Data Structure</h4>
                <pre className="text-sm text-blue-800 overflow-auto max-h-40 bg-white p-2 rounded">
                  {JSON.stringify(results.sample_data, null, 2)}
                </pre>
              </div>
            )}

            {results.test_data && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Test Data Used</h4>
                <pre className="text-sm text-gray-800 overflow-auto max-h-40 bg-white p-2 rounded">
                  {JSON.stringify(results.test_data, null, 2)}
                </pre>
              </div>
            )}

            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-gray-900">Full Response</summary>
              <pre className="mt-2 text-xs text-gray-800 overflow-auto max-h-60 bg-white p-2 rounded">
                {JSON.stringify(results, null, 2)}
              </pre>
            </details>
          </div>
        ) : (
          <p className="text-gray-500">No results yet. Click the test button above.</p>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-6 h-6" />
              Debug Registration System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={testDatabaseSchema} disabled={loading} className="flex items-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                Test Database Schema
              </Button>
              <Button
                onClick={testRegistration}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                Test Registration
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              <p>Use these tests to verify the registration system is working correctly:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  <strong>Database Schema:</strong> Tests connection and table structure
                </li>
                <li>
                  <strong>Registration:</strong> Tests the complete registration flow
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <ResultCard
          title="Database Schema Test"
          results={schemaResults}
          icon={<Database className="w-6 h-6 text-blue-600" />}
        />

        <ResultCard
          title="Registration Test"
          results={registrationResults}
          icon={<TestTube className="w-6 h-6 text-purple-600" />}
        />
      </div>
    </div>
  )
}
