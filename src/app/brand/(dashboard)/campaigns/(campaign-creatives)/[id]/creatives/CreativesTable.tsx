"use client"

import { DynamicTable, TableAction } from '@/components/DynamicTable';
import { Image as ImageIcon } from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { CreativeModel } from '@/models/brand/creative.model';
import { useTransition } from 'react';
import { creativeTableConfig } from './creativeTableConfig';
import { CreativeType, CreativeTypeLabels } from '@/constants/creative';

type PaginatedCreativesResponse = Awaited<ReturnType<typeof CreativeModel.getPaginatedCreatives>>;

export default function CreativesTable({ data }: { data: PaginatedCreativesResponse }) {
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
        'name-asc': 'Name A-Z',
        'name-desc': 'Name Z-A',
        'type-asc': 'Type A-Z',
        'type-desc': 'Type Z-A'
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
                    columns={creativeTableConfig}
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
                                { label: CreativeTypeLabels[CreativeType.IMAGE], value: CreativeType.IMAGE },
                                { label: CreativeTypeLabels[CreativeType.VIDEO], value: CreativeType.VIDEO },
                                { label: CreativeTypeLabels[CreativeType.BANNER], value: CreativeType.BANNER },
                                { label: CreativeTypeLabels[CreativeType.TEXT], value: CreativeType.TEXT },
                                { label: CreativeTypeLabels[CreativeType.HTML], value: CreativeType.HTML },
                                { label: CreativeTypeLabels[CreativeType.PDF], value: CreativeType.PDF }
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
                        title: 'No creatives found',
                        description: 'There are no creatives to display at the moment.',
                        icon: <ImageIcon className="h-8 w-8" />,
                    }}
                />

            </CardContent>
        </Card>
    );
}
