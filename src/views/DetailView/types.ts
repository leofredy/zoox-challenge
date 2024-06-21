export interface ViewFile {
  data: Array<{
    selected: boolean;
      isHeader: boolean;
      columns: Array<
        {
          selected: boolean;
          label: string;
        }
      >
  }>;
  fileName: string;
  createdAt: number;
  exported: boolean;
  recordCount: {
      lines: number;
      columns: number;
  };
}