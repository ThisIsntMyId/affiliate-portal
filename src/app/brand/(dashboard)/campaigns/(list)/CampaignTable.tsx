"use client"

import { CampaignSortOptionsLabels, CampaignStatus} from '@/constants/campaign';
import { DynamicTable, TableAction } from '@/components/DynamicTable';
import { Search } from 'lucide-react';
import { getRoute } from '@/app/brand/routes';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { CampaignModel } from '@/models/brand/campaign.model';
import { useTransition } from 'react';
import { tableConfig } from '../campaignTableConfig';

type PaginatedCampaignsResponse = Awaited<ReturnType<typeof CampaignModel.getPaginatedCampaigns>>;

export default function CampaignTable({ data }: { data: PaginatedCampaignsResponse }) {
    const [isPending, startTransition] = useTransition();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || '';
    const status = searchParams.get('status') || '';
    const isPrivate = searchParams.get('isPrivate') || '';

    const sortOptions = CampaignSortOptionsLabels;

    const handleTableAction = (action: TableAction) => {
        // Create a mutable copy of the current URL search parameters
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));

        switch (action.type) {
            case 'search':
                if(action.data) currentParams.set('search', action.data as string);
                else currentParams.delete('search');
                currentParams.set('page', '1'); // Reset to first page on new search
                break;
            
            // Handle single, inline filter changes
            case 'filter':
                const { key, value } = action.data as { key: string; value: string };
                if (value && value !== 'all') { // Use 'all' to clear the filter
                    currentParams.set(key, value);
                } else {
                    currentParams.delete(key);
                }
                currentParams.set('page', '1');
                break;


            case 'sort':
                if(action.data) currentParams.set('sort', action.data as string);
                else currentParams.delete('sort');
                break;
            case 'page':
                currentParams.set('page', action.data.toString());
                break;
            case 'perPage':
                currentParams.set('limit', action.data.toString());
                currentParams.set('page', '1');
                break;
        }

        startTransition(() => {
            // Navigate to the new URL. Next.js will handle the re-rendering.
            router.push(`${pathname}?${currentParams.toString()}`);
        })
    };

    return (
        <Card className="w-full">
            <CardContent>
                <DynamicTable
                    loading={isPending}
                    data={data.data}
                    pagination={data.pagination}
                    pageLimits={[2, 5, 10, 20, 50, 100]}
                    searchQuery={search}
                    sortBy={sort}
                    sortOptions={sortOptions}
                    columns={tableConfig}
                    searchable={true}
                    filterable={true}
                    sortable={true}
                    // Pass current values to sync UI
                    filterValues={{ status, isPrivate }}
                    // Define the inline quick filters
                    quickFilters={[
                        {
                            key: 'status',
                            label: 'Status',
                            type: 'select',
                            options: [
                                { label: 'All Statuses', value: 'all' },
                                { label: 'Draft', value: CampaignStatus.DRAFT },
                                { label: 'Active', value: CampaignStatus.ACTIVE },
                                { label: 'Paused', value: CampaignStatus.PAUSED },
                                { label: 'Suspended', value: CampaignStatus.SUSPENDED },
                                { label: 'Trashed', value: CampaignStatus.TRASHED }
                            ]
                        },
                        {
                            key: 'isPrivate',
                            label: 'Visibility',
                            type: 'select',
                            options: [
                                { label: 'All', value: 'all' },
                                { label: 'Private', value: 'private' },
                                { label: 'Public', value: 'public' }
                            ]
                        }
                    ]}
                    onAction={handleTableAction}
                    emptyState={{
                        title: 'No campaigns found',
                        description: 'There are no campaigns to display at the moment.',
                        icon: <Search className="h-8 w-8" />,
                        action: () => router.push(getRoute('brand.campaigns.create')),
                        actionLabel: 'Create Campaign'
                    }}
                />

            </CardContent>
        </Card>
    );
}
