export interface SaveFile extends ExportedFile {
  fileName: string;
  createdAt: number;
  data: Array<Array<string>>;
}
export interface ExportedFile {
  exported: boolean;
  recordCount: {
    lines: number;
    columns: number;
  }
}