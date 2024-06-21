export interface Props {
  value: boolean;
}
export interface Emits {
  (e: 'change', value: boolean): void;
}