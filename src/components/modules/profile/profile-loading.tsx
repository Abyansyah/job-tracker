import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
    <Card className="bg-white rounded-xl shadow-sm border-slate-200">
      <CardHeader>
        <div className="h-6 w-48 bg-slate-200 rounded"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-slate-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 w-32 bg-slate-200 rounded"></div>
              <div className="h-4 w-48 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-200 rounded"></div>
              <div className="h-10 bg-slate-200 rounded-md"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 bg-slate-200 rounded"></div>
              <div className="h-10 bg-slate-200 rounded-md"></div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
              <div className="h-10 bg-slate-200 rounded-md"></div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="h-10 w-36 bg-slate-200 rounded-md"></div>
          </div>
        </div>
      </CardContent>
    </Card>
    <Card className="bg-white rounded-xl shadow-sm border-slate-200">
      <CardHeader>
        <div className="h-6 w-40 bg-slate-200 rounded"></div>
      </CardHeader>
      <CardContent className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-28 bg-slate-200 rounded"></div>
            <div className="h-10 bg-slate-200 rounded-md"></div>
          </div>
        ))}
        <div className="flex justify-end">
          <div className="h-10 w-36 bg-slate-200 rounded-md"></div>
        </div>
      </CardContent>
    </Card>
    ]
    <Card className="bg-white rounded-xl shadow-sm border-slate-200">
      <CardHeader>
        <div className="h-6 w-52 bg-slate-200 rounded"></div>
      </CardHeader>
      <CardContent>
        <div className="h-20 bg-slate-100 rounded-lg p-4 space-y-2">
          <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
          <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
        </div>
      </CardContent>
    </Card>
  </div>
);
