import { getRequest, postRequest } from "../request";

export async function getListCrypto() {
  try {
    const listCrypto = await getRequest('crypto');
    return listCrypto;
  } catch {
    console.error('Error GET crypto list.');
  }
}

export async function getHistoricalData(data, controller) {
  try {
    const historicalCrypto = await postRequest('crypto/historical-data', data, controller);
    return historicalCrypto;
  } catch(e) {
    if (e.name === 'AbortError') {
      console.error('Request aborted');
    } else {
      console.error('Error historical data crypto.');
    }
  }
}