export interface Props {
  show: boolean;
  abortReading: boolean;
}
export interface UpdateProgress {
  fileName: string;
  fileSize: number;
  fileLoaded: number;
  showProgressModal: boolean;
}
export interface Emits {
  (e: 'update', value: UpdateProgress): void;
  (e: 'close'): void;
  (e: 'aborted'): void;
  (e: 'error'): void;
}

export interface SaveFile {
  fileName: string;
  createdAt: number;
  data: Array<Array<string>>;
}
