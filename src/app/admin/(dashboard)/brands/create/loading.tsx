import { DynamicForm } from '@/components/DynamicForm';
import { Card, CardContent } from '@/components/ui/card';
import { genericFormLoadingConfig } from '@/lib/genericTableAndFormConfig';

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Brand</h1>
        <p className="text-gray-600 mt-1">Add a new brand to the system</p>
      </div>

      <Card className="w-full">
        <CardContent>
          <DynamicForm
            config={genericFormLoadingConfig}
            loading={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
