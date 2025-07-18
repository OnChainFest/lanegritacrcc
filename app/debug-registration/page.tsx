"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DebugRegistrationPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testSchema = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug-registration-schema")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Failed to test schema", details: error })
    } finally {
      setLoading(false)
    }
  }

  const testRegistration = async () => {
    setLoading(true)
    try {
      const testData = {
        name: "Test Player Debug",
        email: `test-${Date.now()}@example.com`,
        nationality: "Nacional",
        passport: "123456789",
        league: "Test League",
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

      const data = await response.json()
      setResult({ registration_test: data, test_data: testData })
    } catch (error) {
      setResult({ error: "Failed to test registration", details: error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Debug Registration System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testSchema} disabled={loading}>
              Test Database Schema
            </Button>
            <Button onClick={testRegistration} disabled={loading}>
              Test Registration
            </Button>
          </div>

          {loading && <div>Loading...</div>}

          {result && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={result.success ? "default" : "destructive"}>
                  {result.success ? "SUCCESS" : "ERROR"}
                </Badge>
              </div>

              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
