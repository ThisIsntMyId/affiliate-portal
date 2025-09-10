interface PayoutDetailPageProps {
  params: {
    id: string;
  };
}

export default function BrandAffiliatePayoutDetail({ params }: PayoutDetailPageProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Payout Detail
      </h1>
      <div className="text-gray-600">
        Payout ID: {params.id}
      </div>
    </div>
  );
}
