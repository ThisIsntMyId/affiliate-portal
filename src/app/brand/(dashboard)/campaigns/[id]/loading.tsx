import { DynamicForm } from '@/components/DynamicForm';
import { Card, CardContent } from '@/components/ui/card';
import { skeletonFormFields } from '@/lib/skeletonConfigs';


export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Campaign</h1>
        <p className="text-gray-600 mt-1">Update campaign information and settings</p>
      </div>

      <Card className="w-full">
        <CardContent>
          <DynamicForm
            config={skeletonFormFields}
            loading={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
