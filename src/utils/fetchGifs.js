export const fetchGifMap = async () => {
  const res = await fetch('https://api.bodyworks.akshatjaiswal.me/api/v1/exercises?limit=200&page=1');
  const data = await res.json();

  const gifMap = {};

  data.data.forEach((item) => {
    gifMap[item.id] = item.gifUrl;
  });

  return gifMap;
};