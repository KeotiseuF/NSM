const urlBack = import.meta.env.VITE_API_URL;

export function getRequest(path) {
  return fetch(`${urlBack}/${path}`)
  .then((res) => res.json())
  .then((res) => res);
}

export function postRequestBlob(path, body) {
  return fetch(`${urlBack}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    responseType: 'blob',
    body: JSON.stringify(body)
  })
  .then((res) => res.blob())
  .then((res) => res)
}

export function postRequest(path, body) {
  return fetch(`${urlBack}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(body)
  })
  .then((res) => res.json())
  .then((res) => res)
}