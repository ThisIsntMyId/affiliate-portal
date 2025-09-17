"use client";

import { useState } from "react";
import { ModalForm } from "@/components/ModalForm";
import { createCommissionRateFormConfig } from "./commissionFormConfig";
import { getCommissionRate, updateCommissionRate, createCommissionRate } from "@/actions/brand/commission.action";
import { CommissionRateColumns } from "@/models/brand/commission.model";
import { DynamicFormSubmissionError } from "@/components/DynamicForm";

interface CommissionFormProps {
  campaignId: number;
  commissionId?: number;
  children: React.ReactNode;
}

const blankFormValues = {
  title: '',
  type: 'percent',
  value: '',
  isActive: true,
};

export function CommissionForm({
  campaignId,
  commissionId,
  children,
}: CommissionFormProps) {
  const [defaultValues, setDefaultValues] = useState<Record<string, unknown>>(blankFormValues);

  const isUpdateMode = !!commissionId;
  const modalTitle = isUpdateMode ? "Edit Commission Rate" : "Create Commission Rate";
  const modalDescription = isUpdateMode
    ? "Update commission rate settings"
    : "Configure new commission rate settings";

  const handleOpen = async () => {
    if (!isUpdateMode) {
      setDefaultValues(blankFormValues);
      return;
    }

    try {
      const response = await getCommissionRate({
        id: commissionId,
        campaignId: campaignId,
      });

      if (response.success && response.data) {
        const commissionData = response.data as CommissionRateColumns;
        setDefaultValues({
          title: commissionData.title || '',
          type: commissionData.type || 'percent',
          value: commissionData.value || '',
          isActive: commissionData.isActive ?? true,
        });
      } else {
        console.error(response.message || 'Failed to load commission details.');
        setDefaultValues(blankFormValues);
      }
    } catch (error) {
      console.error('Failed to load commission details:', error);
      setDefaultValues(blankFormValues);
    }
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!campaignId) {
      throw new Error('Campaign ID is required');
    }

    const payload = {
      campaignId: campaignId,
      title: values.title as string,
      type: values.type as 'fixed' | 'percent',
      value: parseFloat(values.value as string),
      isActive: values.isActive as boolean,
    };

    const response = isUpdateMode
      ? await updateCommissionRate({ ...payload, id: commissionId })
      : await createCommissionRate(payload);

    if (!response.success && response.errors) {
      throw new DynamicFormSubmissionError('Validation failed', response.errors);
    }
  };

  return (
    <ModalForm
      modalTitle={modalTitle}
      modalDescription={modalDescription}
      config={createCommissionRateFormConfig}
      onSubmit={handleSubmit}
      onOpen={handleOpen}
      defaultValues={defaultValues}
      saveText={isUpdateMode ? "Update Commission" : "Create Commission"}
      cancelText="Cancel"
      loadingText={isUpdateMode ? "Updating..." : "Creating..."}
      gridCols={2}
    >
      {children}
    </ModalForm>
  );
}