export interface Props {
  filename: string;
  size: number;
  loaded: number;
  show: boolean;
}
export interface Emits {
  (e: 'close'): void;
  (e: 'cancel'): void;
  (e: 'other'): void;
}