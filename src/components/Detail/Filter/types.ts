import type { ViewFile } from "@/views/DetailView/types";

export interface Props {
  file: ViewFile;
}

export interface Emits {
  (e: 'seeAllColumns'): void;
  (e: 'seeNothingColumns'): void;
  (e: 'setColumn', value: Column): void;
}

export interface Column { 
  index: number;
}