export interface Props {
  show: boolean;
}
export interface Emits {
  (e: 'close'): void;
  (e: 'open'): void;
  (e: 'put'): void;
}