import z from "zod"

// NOTE:
// - For frontend actions, prefer Next.js server redirects since they’re authoritative, faster, and more secure.
// - When the user stays on the same page after an action, always call `revalidatePath` and then return response.
// - Often, the response will only trigger a toast, without needing extra data.
// - If the user is redirected, still use `revalidatePath` and then call `redirect`.
// - For APIs, always return these structured responses to maintain consistency.


export const createSuccessResponse = (message: string, data = {}) => {
    return {
        success: true as const,
        message,
        data,
    }
}

export const createErrorResponse = (message: string, data = {}) => {
    return {
        success: false as const,
        message,
        data,
        errors: null
    }
}

export const createZodValidationErrorResponse = (error: z.ZodError) => {
    const flattenError = z.flattenError(error)

    if (flattenError.formErrors?.length > 0) return createErrorResponse('Validation error', flattenError.formErrors.join('. '))

    return {
        success: false as const,
        message: 'Validation error',
        errors: z.flattenError(error).fieldErrors,
        data: null
    }
}

export const createValidationErrorResponse = (errors: Record<string, string[]>) => {

    return {
        success: false as const,
        message: 'Validation error',
        errors: errors,
        data: null
    }
}