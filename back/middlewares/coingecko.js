exports.getList = () => {
  return fetch("https://api.coingecko.com/api/v3/coins/list")
  .then((list) => list.json())
  .then((list) => list)
}