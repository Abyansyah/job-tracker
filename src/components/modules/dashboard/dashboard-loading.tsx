import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonLoader = () => <div className="animate-pulse bg-slate-200 rounded-md"></div>;

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white rounded-xl shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-2/3 bg-slate-200 rounded animate-pulse"/>
              <Skeleton className="h-4 w-4 bg-slate-200 rounded-full animate-pulse"/>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-1/2 bg-slate-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-1/3 bg-slate-200 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white rounded-xl shadow-sm border-slate-200">
          <CardHeader>
            <div className="h-6 w-1/3 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse mt-2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-slate-200 rounded-md animate-pulse"></div>
          </CardContent>
        </Card>
        <Card className="bg-white rounded-xl shadow-sm border-slate-200">
          <CardHeader>
            <div className="h-6 w-1/2 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse mt-2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] bg-slate-200 rounded-full mx-auto w-[200px] animate-pulse"></div>
            <div className="mt-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center w-full">
                    <div className="w-3 h-3 rounded-full mr-2 bg-slate-200 animate-pulse"></div>
                    <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-4 w-1/6 bg-slate-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 bg-white rounded-xl shadow-sm border-slate-200">
        <CardHeader>
          <div className="h-6 w-1/4 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse mt-2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-4 w-full">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg animate-pulse"></div>
                  <div className="w-full space-y-2">
                    <div className="h-5 w-1/3 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="w-1/4 space-y-2 text-right">
                  <div className="h-5 w-3/4 bg-slate-200 rounded ml-auto animate-pulse"></div>
                  <div className="h-3 w-full bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
