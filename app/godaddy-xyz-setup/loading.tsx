export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-orange-500 rounded-full animate-pulse">
              <div className="w-8 h-8 bg-white rounded"></div>
            </div>
            <div className="h-10 bg-gray-300 rounded w-96 animate-pulse"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
