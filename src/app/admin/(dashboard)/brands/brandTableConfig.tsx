import { ColumnConfig } from "@/components/DynamicTable";
import { BrandStatusColors, BrandStatusLabels } from "@/constants/brand";
import { Edit, Globe } from "lucide-react";
import { getRoute } from '@/app/admin/routes';

export const tableConfig: ColumnConfig[] = [
    {
        key: 'logo',
        field: 'logo',
        label: 'Logo',
        type: 'image',
        imageWidth: '70px',
        imageHeight: '70px',
        // width: '90px'
    },
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (row: any) => {
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                url: (row: any) => getRoute('admin.brands.view', { id: row.id as number}),
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
