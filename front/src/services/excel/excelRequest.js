import { postRequestBlob } from "../request";

export async function postCreateExcel(data) {
  try {
    const excelFile = await postRequestBlob('excel/create', data);
    return excelFile;
  } catch {
    console.error('Error create an excel file.');
  }
}