"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface EnvCheck {
  success: boolean
  timestamp: string
  environment: Record<string, any>
  message: string
  error?: string
}

export default function DebugEnvPage() {
  const [envData, setEnvData] = useState<EnvCheck | null>(null)
  const [loading, setLoading] = useState(false)

  const checkEnvironment = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug-env-check")
      const data = await response.json()
      setEnvData(data)
    } catch (error) {
      console.error("Error checking environment:", error)
      setEnvData({
        success: false,
        timestamp: new Date().toISOString(),
        environment: {},
        message: "Failed to check environment",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkEnvironment()
  }, [])

  const getStatusIcon = (value: string) => {
    if (value === "NOT_SET") {
      return <XCircle className="w-4 h-4 text-red-500" />
    } else if (value.includes("SET")) {
      return <CheckCircle className="w-4 h-4 text-green-500" />
    } else {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (value: string) => {
    if (value === "NOT_SET") {
      return <Badge variant="destructive">Missing</Badge>
    } else if (value.includes("SET")) {
      return <Badge variant="default">Set</Badge>
    } else {
      return <Badge variant="secondary">Value: {value}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Environment Variables Debug</h1>
          <Button onClick={checkEnvironment} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {envData && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {envData.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  Status: {envData.success ? "Success" : "Error"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  Last checked: {new Date(envData.timestamp).toLocaleString()}
                </p>
                <p>{envData.message}</p>
                {envData.error && <p className="text-red-600 mt-2">Error: {envData.error}</p>}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Supabase Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getStatusIcon(envData.environment.NEXT_PUBLIC_SUPABASE_URL)}
                      SUPABASE_URL
                    </span>
                    {getStatusBadge(envData.environment.NEXT_PUBLIC_SUPABASE_URL)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getStatusIcon(envData.environment.NEXT_PUBLIC_SUPABASE_ANON_KEY)}
                      SUPABASE_ANON_KEY
                    </span>
                    {getStatusBadge(envData.environment.NEXT_PUBLIC_SUPABASE_ANON_KEY)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getStatusIcon(envData.environment.JWT_SECRET)}
                      JWT_SECRET
                    </span>
                    {getStatusBadge(envData.environment.JWT_SECRET)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getStatusIcon(envData.environment.ADMIN_USERNAME)}
                      ADMIN_USERNAME
                    </span>
                    {getStatusBadge(envData.environment.ADMIN_USERNAME)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getStatusIcon(envData.environment.ADMIN_PASSWORD_HASH)}
                      ADMIN_PASSWORD_HASH
                    </span>
                    {getStatusBadge(envData.environment.ADMIN_PASSWORD_HASH)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Email Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getStatusIcon(envData.environment.FROM_EMAIL)}
                      FROM_EMAIL
                    </span>
                    {getStatusBadge(envData.environment.FROM_EMAIL)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {getStatusIcon(envData.environment.RESEND_API_KEY)}
                      RESEND_API_KEY
                    </span>
                    {getStatusBadge(envData.environment.RESEND_API_KEY)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>NODE_ENV</span>
                    <Badge variant="outline">{envData.environment.NODE_ENV}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total ENV vars</span>
                    <Badge variant="outline">{envData.environment.TOTAL_ENV_VARS}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>NEXT_PUBLIC vars</span>
                    <Badge variant="outline">{envData.environment.NEXT_PUBLIC_VARS?.length || 0}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {envData.environment.NEXT_PUBLIC_VARS && (
              <Card>
                <CardHeader>
                  <CardTitle>All NEXT_PUBLIC Variables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {envData.environment.NEXT_PUBLIC_VARS.map((varName: string) => (
                      <div key={varName} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-mono">{varName}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
