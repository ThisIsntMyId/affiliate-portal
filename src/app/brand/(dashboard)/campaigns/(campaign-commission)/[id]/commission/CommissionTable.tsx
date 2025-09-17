"use client"

import { DynamicTable, TableAction } from '@/components/DynamicTable';
import { Percent, Search } from 'lucide-react';
import { getRoute } from '@/app/brand/routes';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { CommissionRateModel } from '@/models/brand/commission.model';
import { useTransition } from 'react';
import { commissionTableConfig } from './commissionTableConfig';
// import { commissionTableConfig } from './commissionTableConfig';

type PaginatedCommissionRatesResponse = Awaited<ReturnType<typeof CommissionRateModel.getPaginatedCommissionRates>>;

export default function CommissionTable({ data }: { data: PaginatedCommissionRatesResponse }) {
    const [isPending, startTransition] = useTransition();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || '';
    const type = searchParams.get('type') || '';
    const isActive = searchParams.get('isActive') || '';

    const sortOptions = {
        'latest': 'Latest First',
        'oldest': 'Oldest First',
        'title-asc': 'Title A-Z',
        'title-desc': 'Title Z-A',
        'value-asc': 'Value Low-High',
        'value-desc': 'Value High-Low'
    };

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
                    columns={commissionTableConfig}
                    searchable={true}
                    filterable={true}
                    sortable={true}
                    // Pass current values to sync UI
                    filterValues={{ type, isActive }}
                    // Define the inline quick filters
                    quickFilters={[
                        {
                            key: 'type',
                            label: 'Type',
                            type: 'select',
                            options: [
                                { label: 'All Types', value: 'all' },
                                { label: 'Fixed', value: 'fixed' },
                                { label: 'Percent', value: 'percent' }
                            ]
                        },
                        {
                            key: 'isActive',
                            label: 'Status',
                            type: 'select',
                            options: [
                                { label: 'All', value: 'all' },
                                { label: 'Active', value: 'active' },
                                { label: 'Inactive', value: 'inactive' }
                            ]
                        }
                    ]}
                    onAction={handleTableAction}
                    emptyState={{
                        title: 'No commission rates found',
                        description: 'There are no commission rates to display at the moment.',
                        icon: <Percent className="h-8 w-8" />,
                    }}
                />

            </CardContent>
        </Card>
    );
}
