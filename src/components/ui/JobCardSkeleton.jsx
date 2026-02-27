import Skeleton from "../ui/Skeleton";

export default function JobCardSkeleton() {
  return (
    <div className="p-5 bg-white border border-gray-100 shadow-sm rounded-2xl">
      
      {/* Title + Save Button */}
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="w-1/2 h-5" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>

      {/* Company */}
      <Skeleton className="w-1/3 h-4 mb-2" />

      {/* Location */}
      <Skeleton className="w-1/4 h-4" />

    </div>
  );
}