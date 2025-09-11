'use client';

import { DynamicForm, FormFieldConfig, DynamicFormSubmissionError } from '@/components/DynamicForm';
import { login } from '@/actions/admin/auth.action';
import { toast } from 'sonner';

const loginFormConfig: FormFieldConfig[] = [
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email",
    required: true,
    description: "Enter your admin email address"
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
    description: "Enter your admin password"
  }
];

export function LoginForm() {
  const handleLogin = async (values: Record<string, unknown>) => {
    // Full control over parameters
    const email = values.email as string;
    const password = values.password as string;

    // Custom validation and modifications
    if (!email || !password) {
      throw new DynamicFormSubmissionError('All fields are required');
    }

    // Call server action with modified data
    const result = await login({
      email: email.toLowerCase().trim(),
      password: password,
    });

    // Handle result
    if (!result?.success) {
      if (result?.errors) {
        // Handle field-specific errors
        throw new DynamicFormSubmissionError('Validation failed', result.errors.fieldErrors);
      } else if (result?.error) {
        // Handle general error
        throw new DynamicFormSubmissionError(result.error);
      }
    }
    toast.success('Login successful!');
  };

  return (
    <DynamicForm
      config={loginFormConfig}
      onSubmit={handleLogin}
      submitText="Sign In"
      loadingText="Signing in..."
      submitButtonAlign="full"
      showCard={false}
    />
  );
}