import { FormFieldConfig } from "@/components/DynamicForm";
import { CREATIVE_FILE_MAX_SIZE } from "@/constants/creative";

export const createCreativeFormConfig: FormFieldConfig[] = [
    {
        name: 'name',
        label: 'Creative Name',
        type: 'input',
        required: true,
        placeholder: 'Enter creative name',
        description: 'A clear and descriptive name for this creative asset'
    },
    {
        name: 'type',
        label: 'Creative Type',
        type: 'select',
        required: true,
        description: 'Choose the type of creative asset',
        options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
            { label: 'Banner', value: 'banner' },
            { label: 'Text', value: 'text' },
            { label: 'HTML', value: 'html' }
        ]
    },
    {
        name: 'file',
        label: 'Creative File',
        type: 'file',
        required: true,
        description: 'Upload the creative file (images, videos, PDFs, HTML)',
        fileConfig: {
            accept: ['image/*', 'video/*', 'application/pdf', 'text/html', 'text/plain'],
            maxSize: CREATIVE_FILE_MAX_SIZE,
        }
        // accept: 'image/*,video/*,application/pdf,text/html,text/plain'
    },
    {
        name: 'isActive',
        label: 'Status',
        type: 'checkbox',
        required: false,
        description: 'Whether this creative is active',
        // defaultChecked: true
    }
];
