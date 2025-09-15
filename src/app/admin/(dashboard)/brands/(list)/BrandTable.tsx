"use client"

import { BrandSortOptionsLabels, BrandStatus} from '@/constants/brand';
import { DynamicTable, TableAction } from '@/components/DynamicTable';
import { Search } from 'lucide-react';
import { getRoute } from '@/app/admin/routes';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { BrandModel } from '@/models/admin/brand.model';
import { useTransition } from 'react';
import { tableConfig } from '../brandTableConfig';

type PaginatedBrandsResponse = Awaited<ReturnType<typeof BrandModel.getPaginatedBrands>>;

export default function BrandTable({ data }: { data: PaginatedBrandsResponse }) {
    const [isPending, startTransition] = useTransition();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || '';
    const status = searchParams.get('status') || '';

    const sortOptions = BrandSortOptionsLabels;

    const handleTableAction = (action: TableAction) => {
        // Create a mutable copy of the current URL search parameters
        const currentParams = new URLSearchParams(Array.from(searchParams.entries()));

        switch (action.type) {
            case 'search':
                if(action.data) currentParams.set('search', action.data as string);
                else currentParams.delete('search');
                currentParams.set('page', '1'); // Reset to first page on new search
                break;
            
            // NEW: Handle single, inline filter changes
            case 'filter':
                const { key, value } = action.data as { key: string; value: string };
                if (value && value !== 'all') { // Use 'all' to clear the filter
                    currentParams.set(key, value);
                } else {
                    currentParams.delete(key);
                }
                currentParams.set('page', '1');
                break;

            // NEW: Handle batch updates from the modal
            case 'filterBatch':
                const batchFilters = action.data as Record<string, unknown>;
                // Clear existing filter params first
                currentParams.delete('status');
                // Apply new batch filters
                Object.entries(batchFilters).forEach(([key, value]) => {
                    if (value && value !== 'all' && value !== '') {
                        currentParams.set(key, String(value));
                    }
                });
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
                    filterValues={{ status }} // Pass the current status
                    // Define the inline quick filter
                    quickFilters={[
                        {
                            key: 'status',
                            label: 'Status',
                            type: 'select',
                            options: [
                                { label: 'All Statuses', value: 'all' }, // Option to clear filter
                                { label: 'Active', value: BrandStatus.ACTIVE },
                                { label: 'Inactive', value: BrandStatus.INACTIVE },
                                { label: 'Suspended', value: BrandStatus.SUSPENDED }
                            ]
                        }
                    ]}
                    // Advanced filters for the modal
                    filters={[
                        {
                            key: 'status',
                            label: 'Status',
                            type: 'select',
                            options: [
                                { label: 'All Statuses', value: 'all' },
                                { label: 'Active', value: BrandStatus.ACTIVE },
                                { label: 'Inactive', value: BrandStatus.INACTIVE },
                                { label: 'Suspended', value: BrandStatus.SUSPENDED }
                            ]
                        }
                    ]}
                    onAction={handleTableAction}
                    emptyState={{
                        title: 'No brands found',
                        description: 'There are no brands to display at the moment.',
                        icon: <Search className="h-8 w-8" />,
                        action: () => router.push(getRoute('admin.brands.create')),
                        actionLabel: 'Create Brand'
                    }}
                />

            </CardContent>
        </Card>
    );
}
