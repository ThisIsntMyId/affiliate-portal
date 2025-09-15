import { CreateCampaignForm } from './CreateCampaignForm';

export default function CreateCampaignPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Campaign</h1>
        <p className="text-gray-600 mt-1">Create a new affiliate campaign</p>
      </div>

      <CreateCampaignForm />
    </div>
  );
}
