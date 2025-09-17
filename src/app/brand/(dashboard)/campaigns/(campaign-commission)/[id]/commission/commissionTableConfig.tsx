import { ColumnConfig } from "@/components/DynamicTable";
import { CommissionTypeColors, CommissionTypeLabels } from "@/constants/commission";
import { CommissionForm } from "./CommissionForm";

export const commissionTableConfig: ColumnConfig[] = [
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
        key: 'type',
        field: 'type',
        label: 'Type',
        type: 'tag',
        tagLabel: CommissionTypeLabels,
        tagColors: CommissionTypeColors,
    },
    {
        key: 'value',
        field: 'value',
        label: 'Value',
        type: 'text',
    },
    {
        key: 'isActive',
        field: 'isActive',
        label: 'Status',
        type: 'boolean',
        trueLabel: 'Active',
        falseLabel: 'Inactive'
    },
    {
        key: 'actions',
        field: 'actions',
        label: 'Actions',
        type: 'custom',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render: (row: any) => (
            <div className="flex items-center gap-2">
                <CommissionForm campaignId={row.campaignId} commissionId={row.id}>Edit</CommissionForm>
            </div>
        )
    },
    // {
    //     key: 'actions',
    //     label: 'Actions',
    //     type: 'actions',
    //     actions: [
    //         {
    //             label: 'Edit',
    //             icon: <Edit className="h-4 w-4" />,
    //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //             url: (row: any) => getRoute('brand.campaigns.edit', { id: row.campaignId as number}),
    //             variant: 'default' as const
    //         }
    //     ]
    // }
];
