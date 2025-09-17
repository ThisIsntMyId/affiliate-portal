import { FormFieldConfig } from "@/components/DynamicForm";
import { CREATIVE_FILE_MAX_SIZE, CreativeType, CreativeTypeLabels } from "@/constants/creative";

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
            { label: CreativeTypeLabels[CreativeType.IMAGE], value: CreativeType.IMAGE },
            { label: CreativeTypeLabels[CreativeType.VIDEO], value: CreativeType.VIDEO },
            { label: CreativeTypeLabels[CreativeType.BANNER], value: CreativeType.BANNER },
            { label: CreativeTypeLabels[CreativeType.TEXT], value: CreativeType.TEXT },
            { label: CreativeTypeLabels[CreativeType.HTML], value: CreativeType.HTML },
            { label: CreativeTypeLabels[CreativeType.PDF], value: CreativeType.PDF }
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
            hint: 'Upload up to 1 file (images, videos, PDFs, HTML) • Size: 5MB'
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
