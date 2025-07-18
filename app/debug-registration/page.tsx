"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Database, TestTube, AlertCircle, CheckCircle } from "lucide-react"

export default function DebugRegistrationPage() {
  const [loading, setLoading] = useState(false)
  const [schemaResult, setSchemaResult] = useState<any>(null)
  const [registrationResult, setRegistrationResult] = useState<any>(null)

  const testDatabaseSchema = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug-registration-schema")
      const result = await response.json()
      setSchemaResult(result)
    } catch (error) {
      setSchemaResult({
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
        email: "debug-test@example.com",
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
          marathon: false,
          desperate: false,
        },
        total_cost: 70,
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

      const result = await response.json()
      setRegistrationResult({
        status: response.status,
        response: result,
        submitted_data: testData,
      })
    } catch (error) {
      setRegistrationResult({
        error: "Network error",
        details: error,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Debug Registration System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={testDatabaseSchema} disabled={loading} className="flex items-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                Test Database Schema
              </Button>
              <Button onClick={testRegistration} disabled={loading} className="flex items-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                Test Registration
              </Button>
            </div>
          </CardContent>
        </Card>

        {schemaResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {schemaResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                Database Schema Test
                <Badge variant={schemaResult.success ? "default" : "destructive"}>
                  {schemaResult.success ? "PASSED" : "FAILED"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(schemaResult, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {registrationResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {registrationResult.response?.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                Registration Test
                <Badge variant={registrationResult.response?.success ? "default" : "destructive"}>
                  {registrationResult.response?.success ? "PASSED" : "FAILED"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(registrationResult, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
