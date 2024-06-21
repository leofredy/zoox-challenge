import type { ViewFile } from "@/views/DetailView/types";

export interface Props {
  file: ViewFile;
}

export interface Emits {
  (e: 'update', value: ViewFile): void;
}