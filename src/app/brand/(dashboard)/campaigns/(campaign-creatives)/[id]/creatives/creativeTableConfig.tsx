import { ColumnConfig } from "@/components/DynamicTable";

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
        type: 'text',
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
    }
];
