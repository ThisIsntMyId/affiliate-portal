"use client";

import { useState } from "react";
import { ModalForm } from "@/components/ModalForm";
import { createCreativeFormConfig } from "./creativeFormConfig";
import { getCreative, updateCreative, createCreative } from "@/actions/brand/creative.action";
import { CreativeColumns } from "@/models/brand/creative.model";
import { DynamicFormSubmissionError } from "@/components/DynamicForm";

interface CreativeFormProps {
  campaignId: number;
  creativeId?: number;
  children: React.ReactNode;
}

const blankFormValues = {
  name: '',
  type: 'image',
  file: undefined,
  isActive: true,
};

export function CreativeForm({
  campaignId,
  creativeId,
  children,
}: CreativeFormProps) {
  const [defaultValues, setDefaultValues] = useState<Record<string, unknown>>(blankFormValues);

  const isUpdateMode = !!creativeId;
  const modalTitle = isUpdateMode ? "Edit Creative" : "Create Creative";
  const modalDescription = isUpdateMode
    ? "Update the details for this creative asset"
    : "Upload and configure a new creative asset for this campaign";

  const handleOpen = async () => {
    if (!isUpdateMode) {
      setDefaultValues(blankFormValues);
      return;
    }

    try {
      const response = await getCreative({
        id: creativeId,
        campaignId: campaignId,
      });

      if (response.success && response.data) {
        const creativeData = response.data as CreativeColumns;
        setDefaultValues({
          name: creativeData.name || '',
          type: creativeData.type || 'image',
          file: creativeData.path, // Use existing path for display/update
          isActive: creativeData.isActive ?? true,
        });
      } else {
        console.error(response.message || 'Failed to load creative details.');
        setDefaultValues(blankFormValues);
      }
    } catch (error) {
      console.error('Failed to load creative details:', error);
      setDefaultValues(blankFormValues);
    }
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }

    const payload = {
      campaignId: campaignId,
      name: values.name as string,
      type: values.type as string,
      file: values.file as File | string, // Can be a File object or a URL string
      isActive: values.isActive as boolean,
    };

    const response = isUpdateMode
      ? await updateCreative({ ...payload, id: creativeId })
      : await createCreative(payload);

    if (!response.success && response.errors) {
      throw new DynamicFormSubmissionError('Validation failed', response.errors);
    }
  };

  return (
    <ModalForm
      modalTitle={modalTitle}
      modalDescription={modalDescription}
      config={createCreativeFormConfig}
      onSubmit={handleSubmit}
      onOpen={handleOpen}
      defaultValues={defaultValues}
      saveText={isUpdateMode ? "Update Creative" : "Create Creative"}
      cancelText="Cancel"
      loadingText={isUpdateMode ? "Updating..." : "Creating..."}
    >
      {children}
    </ModalForm>
  );
}