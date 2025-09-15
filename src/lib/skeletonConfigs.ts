import { FormFieldConfig } from "@/components/DynamicForm";
import { ColumnConfig } from "@/components/DynamicTable";

/**
 * A static configuration for a 5-column table skeleton.
 */
export const skeletonTableColumns: ColumnConfig[] = [
    { key: 'col1', field: 'col1', label: 'Loading...', type: 'text' },
    { key: 'col2', field: 'col2', label: 'Loading...', type: 'text' },
    { key: 'col3', field: 'col3', label: 'Loading...', type: 'text' },
    { key: 'col4', field: 'col4', label: 'Loading...', type: 'text' },
    { key: 'col5', field: 'col5', label: 'Loading...', type: 'text' },
];

/**
 * A static configuration for a 5-field form skeleton.
 */
export const skeletonFormFields: FormFieldConfig[] = [
    { name: 'field1', label: 'Loading...', type: 'input' },
    { name: 'field2', label: 'Loading...', type: 'input' },
    { name: 'field3', label: 'Loading...', type: 'textarea' },
    { name: 'field4', label: 'Loading...', type: 'input' },
    { name: 'field5', label: 'Loading...', type: 'select' },
];