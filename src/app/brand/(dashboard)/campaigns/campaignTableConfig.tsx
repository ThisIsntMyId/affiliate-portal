import { ColumnConfig } from "@/components/DynamicTable";
import { CampaignStatusColors, CampaignStatusLabels } from "@/constants/campaign";
import { Edit } from "lucide-react";
import { getRoute } from '@/app/brand/routes';

export const tableConfig: ColumnConfig[] = [
    {
        key: 'image',
        field: 'image',
        label: 'Image',
        type: 'image',
        imageWidth: '70px',
        imageHeight: '70px',
    },
    {
        key: 'code',
        field: 'code',
        label: 'Code',
        type: 'text',
    },
    {
        key: 'title',
        field: 'title',
        label: 'Title',
        type: 'text',
    },
    {
        key: 'link',
        field: 'link',
        label: 'Link',
        type: 'link'
    },
    {
        key: 'tags',
        field: 'tags',
        label: 'Tags',
        type: 'tags'
    },
    {
        key: 'status',
        field: 'status',
        label: 'Status',
        type: 'tag',
        tagColors: CampaignStatusColors,
        tagLabel: CampaignStatusLabels
    },
    {
        key: 'isPrivate',
        field: 'isPrivate',
        label: 'Visibility',
        type: 'boolean',
        trueLabel: 'Private',
        falseLabel: 'Public'
    },
    {
        key: 'actions',
        label: 'Actions',
        type: 'actions',
        actions: [
            {
                label: 'Edit',
                icon: <Edit className="h-4 w-4" />,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                url: (row: any) => getRoute('brand.campaigns.edit', { id: row.id as number}),
                variant: 'default' as const
            }
        ]
    }
];
