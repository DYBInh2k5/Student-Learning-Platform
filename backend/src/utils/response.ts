export const ApiResponse = {
  success: (data: any, message: string = 'Success') => ({
    success: true,
    message,
    data,
  }),

  error: (message: string, error?: any) => ({
    success: false,
    message,
    error: error?.message || error,
  }),
};
