import { FormFieldConfig } from "@/components/DynamicForm";
import { ColumnConfig } from "@/components/DynamicTable";

export const genericTableLoadingConfig: ColumnConfig[] = [
    {
        key: 'col1',
        field: 'col1',
        label: 'Col1',
        type: 'text',
    },
    {
        key: 'col2',
        field: 'col2',
        label: 'Col2',
        type: 'text',
    },
    {
        key: 'col3',
        field: 'col3',
        label: 'Col3',
        type: 'text',
    },
    {
        key: 'col4',
        field: 'col4',
        label: 'Col4',
        type: 'text',
    },
    {
        key: 'col5',
        field: 'col5',
        label: 'Col5',
        type: 'text',
    },
]

// generate a generic form loading config with 5 fields and 4th is a file upload
export const genericFormLoadingConfig: FormFieldConfig[] = [
    {
        name: 'col1',
        label: 'Col1',
        type: 'input'
    },
    {
        name: 'col2',
        label: 'Col2',
        type: 'input'
    },
    {
        name: 'col3',
        label: 'Col3',
        type: 'textarea'
    },
    {
        name: 'col4',
        label: 'Col4',
        type: 'textarea'
    },
    {
        name: 'col5',
        label: 'Col5',
        type: 'select'
    }
    
]
