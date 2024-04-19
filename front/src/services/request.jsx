export function getListCrypto() {
  return fetch("http://localhost:3001/crypto")
  .then((res) => res.json())
  .then((res) => res)
  .catch((error) => {"Error GET crypto list", error})
}