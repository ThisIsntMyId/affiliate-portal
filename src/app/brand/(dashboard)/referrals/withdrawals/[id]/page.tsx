interface WithdrawalDetailPageProps {
  params: {
    id: string;
  };
}

export default function BrandReferralWithdrawalDetail({ params }: WithdrawalDetailPageProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Withdrawal Detail
      </h1>
      <div className="text-gray-600">
        Withdrawal ID: {params.id}
      </div>
    </div>
  );
}
