export function getListStock() {
  return fetch("http://localhost:3001/stock")
  .then((res) => res.json())
  .then((res) => res)
  .catch((error) => {"Error GET stock list", error})
}

export function getListCrypto() {
  return fetch("http://localhost:3001/crypto")
  .then((res) => res.json())
  .then((res) => res)
  .catch((error) => {"Error GET crypto list", error})
}

export function createExcel(data) {
  return fetch("http://localhost:3001/excel/create", {
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