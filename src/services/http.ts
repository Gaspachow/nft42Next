import fetch from 'isomorphic-fetch';

const defaultOptions = {
  method: 'POST',
};

export const makeRequest = (url: string, options?: RequestInit) => {
  const { method } = { ...defaultOptions, ...options };

  return fetch(url, {
    method,
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => err);
};