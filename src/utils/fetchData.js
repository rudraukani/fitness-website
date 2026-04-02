export const exerciseOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
  },
};

export const fetchData = async (url, options, retries = 2) => {
  const res = await fetch(url, options);

  if (res.status === 429) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return fetchData(url, options, retries - 1);
    }
    throw new Error('Too many requests. Please wait a moment and try again.');
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${text}`);
  }

  return res.json();
};