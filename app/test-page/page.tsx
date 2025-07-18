"use client"

export default function TestPage() {
  const testRegistration = () => {
    const testPlayer = {
      name: `Test Player ${Date.now()}`,
      nationality: "Costa Rica",
      email: `test-${Date.now()}@example.com`,
      passport: `TEST${Date.now()}`,
      league: "Test League",
      played_in_2024: false,
      gender: "M",
      country: "national",
      categories: {
        handicap: true,
        scratch: false,
        seniorM: false,
        seniorF: false,
        marathon: false,
        desperate: false,
        reenganche3: false,
        reenganche4: false,
        reenganche5: false,
        reenganche8: false,
      },
      total_cost: 36000,
      currency: "CRC",
      payment_status: "pending",
    }

    fetch("/api/register-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPlayer),
    })
      .then((r) => r.json())
      .then(console.log)
      .catch(console.error)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Test Page - APIs Simplificadas</h1>
      <p>Probando APIs con nombres diferentes</p>

      <div className="space-y-4 mt-4">
        <button
          onClick={() =>
            fetch("/api/js-test")
              .then((r) => r.json())
              .then(console.log)
          }
          className="bg-blue-500 text-white px-4 py-2 rounded block"
        >
          ✅ Test Basic API (funciona)
        </button>

        <button
          onClick={() =>
            fetch("/api/supabase-js")
              .then((r) => r.json())
              .then(console.log)
          }
          className="bg-green-500 text-white px-4 py-2 rounded block"
        >
          ✅ Test Supabase API (funciona)
        </button>

        <button
          onClick={() =>
            fetch("/api/stats-test")
              .then((r) => r.json())
              .then(console.log)
              .catch(console.error)
          }
          className="bg-purple-500 text-white px-4 py-2 rounded block"
        >
          🔧 Test Stats API (nuevo)
        </button>

        <button onClick={testRegistration} className="bg-orange-500 text-white px-4 py-2 rounded block">
          🔧 Test Register API (nuevo)
        </button>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Diagnóstico:</h3>
        <ul className="space-y-1 text-sm">
          <li>✅ APIs básicas funcionan</li>
          <li>✅ Supabase funciona</li>
          <li>🔧 Probando APIs con nombres diferentes...</li>
        </ul>
      </div>
    </div>
  )
}
