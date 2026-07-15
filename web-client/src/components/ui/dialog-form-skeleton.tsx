import { Skeleton } from "@/components/ui/skeleton"

export function DialogFormSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-1/3" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
