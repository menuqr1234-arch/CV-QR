import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">CV Not Found</h2>
        <p className="text-gray-600 mb-6">The CV you're looking for doesn't exist or has been removed.</p>
        <Link href="/" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Create New CV
        </Link>
      </div>
    </div>
  )
}