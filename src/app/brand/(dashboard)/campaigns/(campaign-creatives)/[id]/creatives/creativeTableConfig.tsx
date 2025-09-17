import { ColumnConfig } from "@/components/DynamicTable";
import { CreativeForm } from "./CreativeForm";
import { CreativeTypeColors, CreativeTypeLabels } from "@/constants/creative";

export const creativeTableConfig: ColumnConfig[] = [
    {
        key: 'code',
        field: 'code',
        label: 'Code',
        type: 'text',
    },
    {
        key: 'name',
        field: 'name',
        label: 'Name',
        type: 'text',
    },
    {
        key: 'type',
        field: 'type',
        label: 'Type',
        type: 'tag',
        tagLabel: CreativeTypeLabels,
        tagColors: CreativeTypeColors,
    },
    {
        key: 'path',
        field: 'path',
        label: 'File',
        type: 'link',
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
                <CreativeForm campaignId={row.campaignId} creativeId={row.id}>Edit</CreativeForm>
            </div>
        )
    },
];
