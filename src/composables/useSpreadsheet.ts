import * as xlsx from 'xlsx';

interface XLSXLine {
  [key: string]: string; 
}
type XLSXFile = Array<XLSXLine>;

export function useSpreadsheet() {
  function csvToJSON(stringFile: string) {
    const lines = stringFile.split("\r" + "\n")
    const table = lines.map(line => line.split(','))
    return table;
  }

  function jsonToCsv(jsonfile: Array<Array<string>>) {
    const csvContent = jsonfile
    .map((row) => Object.values(row).join(","))
    .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    return URL.createObjectURL(blob);
  };

  function xlsxToJSON(bufferFile: ArrayBuffer): Array<Array<string>> {
    const workbook = xlsx.read(bufferFile, { cellDates: true, cellText: true });
  
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    
  
    const xlsxFile = xlsx.utils.sheet_to_json<XLSXFile>(sheet, { header: 'A', dateNF: 'd"/"m"/"yyyy' }).map(line => {
      const lineValues = Object.values(line) as unknown as Array<string | number>;
      return lineValues.map(value => `${value}`);
    });

    return xlsxFile;
  }

  function jsonToXlsx(jsonfile: Array<Array<string>>, fileName: string) {
    const sheet = xlsx.utils.json_to_sheet(jsonfile, { skipHeader: true });
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, sheet, fileName);
    const uri = xlsx.writeFile(workbook, fileName)
    return uri;
  }
  
  return {
    csvToJSON,
    xlsxToJSON,
    jsonToCsv,
    jsonToXlsx
  }
}