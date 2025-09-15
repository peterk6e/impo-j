export default function ProfileSkeleton() {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg animate-pulse">
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        
        {/* Profile fields skeleton */}
        <div className="space-y-4">
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
          
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          
          <div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        
        {/* Button skeleton */}
        <div className="h-10 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  )
}
