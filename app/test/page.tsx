export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Test Page Working!</h1>
        <p className="text-gray-600">This is a simple test page to verify routing works.</p>
        <p className="text-sm text-gray-500">URL: /test</p>
      </div>
    </div>
  )
}
