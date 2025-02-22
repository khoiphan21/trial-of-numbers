export const logError = (message: string) => (error: any) =>
  console.error(`${message}: ${error}`);
