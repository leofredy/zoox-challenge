import type { SaveFile } from '@/types/file';

export type SavedFile = SaveFile;

export interface Props {
  files: Array<SavedFile>;
}

export interface Emits {
  (e: 'delete'): void;
}