import { ActiveFileResult } from '../types';
import { getMostChangedFiles } from '../utils/git';

const MAX_ACTIVE_FILES = 10;

export async function collectActiveFiles(): Promise<ActiveFileResult[]> {
  return getMostChangedFiles(MAX_ACTIVE_FILES);
}
