const urlBack = import.meta.env.VITE_API_URL;

export function getListStock() {
  return fetch(`${urlBack}/api_3/stock`)
  .then((res) => res.json())
  .then((res) => res)
  .catch((error) => {"Error GET stock list", error})
}

export function getListCrypto() {
  return fetch(`${urlBack}/api_3/crypto`)
  .then((res) => res.json())
  .then((res) => res)
  .catch((error) => {"Error GET crypto list", error})
}

export function postCreateExcel(data) {
  return fetch(`${urlBack}/api_3/excel/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    responseType: 'blob',
    body: JSON.stringify({data})
  })
  .then((res) => res.blob())
  .then((res) => res)
  .catch((error) => {"Error GET crypto list", error})
}

export function getHistoricalData(data) {
  return fetch(`${urlBack}/api_3/crypto/historical-data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
  .then((res) => res.json())
  .then((res) => res)
  .catch((error) => {"Error historical data", error})
}