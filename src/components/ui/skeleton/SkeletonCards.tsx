import { Card, CardContent } from '../card'
import { Skeleton } from '../skeleton'

const SkeletonCards = () => {
  return (
    <div className="grid gap-4 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Card
              key={i}
              className="animate-pulse hover:shadow-none transition cursor-default dark:border-gray-600 min-h-[250px] flex flex-col"
            >
              <CardContent className="p-4 flex flex-col h-full">
                <div className="space-y-3 flex-1">
                  <Skeleton className="aspect-video w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-full mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
  )
}

export default SkeletonCards