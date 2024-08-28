import { getRequest, postRequest } from "../request";

export async function getListCrypto() {
  try {
    const listCrypto = await getRequest('crypto');
    return listCrypto;
  } catch {
    console.error('Error GET crypto list.');
  }
}

export async function getHistoricalData(data) {
  try {
    const historicalCrypto = await postRequest('crypto/historical-data', data);
    return historicalCrypto;
  } catch {
    console.error('Error historical data crypto.');
  }
}