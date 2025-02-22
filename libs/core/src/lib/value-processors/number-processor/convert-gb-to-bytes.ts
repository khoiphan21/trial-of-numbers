/**
 * @Assumption FILE_SIZE_01
 */
export function convertGBToBytes(sizeInGB: number): number {
  return sizeInGB * 1024 * 1024 * 1024;
}
