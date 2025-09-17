import { FormFieldConfig } from "@/components/DynamicForm";

export const createCommissionRateFormConfig: FormFieldConfig[] = [
    {
        name: 'title',
        label: 'Commission Rate Title',
        type: 'input',
        required: true,
        placeholder: 'Enter commission rate title',
        description: 'A clear and descriptive title for this commission rate',
        colSpan: 2
    },
    {
        name: 'type',
        label: 'Commission Type',
        type: 'select',
        required: true,
        description: 'Choose whether this is a fixed amount or percentage',
        options: [
            { label: 'Fixed Amount', value: 'fixed' },
            { label: 'Percentage', value: 'percent' }
        ]
    },
    {
        name: 'value',
        label: 'Commission Value',
        type: 'number',
        required: true,
        placeholder: 'Enter commission value',
        description: 'Enter the commission amount (fixed amount or percentage)',
        numberConfig: {
            step: 0.01
        }
    },
    {
        name: 'isActive',
        label: 'Status',
        type: 'checkbox',
        required: false,
        description: 'Whether this commission rate is active',
        colSpan: 2
    }
];
