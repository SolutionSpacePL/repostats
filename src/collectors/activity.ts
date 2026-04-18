import { ActiveFileResult } from '../types';
import { getMostChangedFiles } from '../utils/git';

export async function collectActiveFiles(): Promise<ActiveFileResult[]> {
  return getMostChangedFiles(10);
}
