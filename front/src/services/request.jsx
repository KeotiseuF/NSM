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