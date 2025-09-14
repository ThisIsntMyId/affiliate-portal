"use client"

import { BrandSortOptionsLabels, BrandStatus, BrandStatusColors, BrandStatusLabels } from '@/constants/brand';
import { DynamicTable, ColumnConfig, TableAction } from '@/components/DynamicTable';
import { Edit, Globe, Search } from 'lucide-react';
import { getRoute } from '../../routes';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { BrandModel } from '@/models/admin/brand.model';
import { useTransition } from 'react';

// Table column configuration
const columns: ColumnConfig[] = [
    {
        key: 'code',
        field: 'code',
        label: 'Code',
        type: 'text',
        // width: '120px'
    },
    {
        key: 'name',
        field: 'name',
        label: 'Brand Name',
        type: 'text',
        // width: '200px'
    },
    {
        key: 'email',
        field: 'email',
        label: 'Email',
        type: 'text',
        // width: '250px'
    },
    {
        key: 'website',
        field: 'website',
        label: 'Website',
        type: 'text',
        // width: '200px',
        render: (row) => {
            const website = row.website as string;
            if (!website) return <span className="text-gray-400">-</span>;
            return (
                <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                >
                    {website}
                </a>
            );
        }
    },
    {
        key: 'status',
        field: 'status',
        label: 'Status',
        type: 'tag',
        // width: '120px',
        tagColors: BrandStatusColors,
        tagLabel: BrandStatusLabels
    },
    {
        key: 'actions',
        label: 'Actions',
        type: 'actions',
        // width: '100px',
        actions: [
            {
                label: 'Edit',
                icon: <Edit className="h-4 w-4" />,
                url: (row) => getRoute('admin.brands.view', { id: row.id as number }),
                variant: 'outline' as const
            },
            {
                label: 'Visit',
                icon: <Globe className="h-4 w-4" />,
                url: 'website',
                variant: 'default' as const,
                newTab: true
            }
        ]
    }
];

type PaginatedBrandsResponse = Awaited<ReturnType<typeof BrandModel.getPaginatedBrands>>;

export default function BrandTable({ data }: { data: PaginatedBrandsResponse }) {
    const [isPending, startTransition] = useTransition();

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || '';
    // const status = searchParams.get('status') || '';

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
            case 'filter':
                currentParams.set(action.data.key as string, action.data.value as string);
                currentParams.set('page', '1'); // Reset to first page on filter change
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
                    columns={columns}
                    searchable={true}
                    filterable={true}
                    sortable={true}
                    filters={[
                        {
                            key: 'status',
                            label: 'Status',
                            type: 'select',
                            options: [
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
