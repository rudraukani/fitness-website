export const fetchGifMap = async () => {
  try {
    const res = await fetch(
      'https://api.bodyworks.akshatjaiswal.me/api/v1/exercises?limit=200&page=1'
    );

    console.log('gif fetch status', res.status);
    console.log('gif fetch ok', res.ok);

    const data = await res.json();
    console.log('raw gif API response', data);

    if (!data || !Array.isArray(data.data)) {
      console.error('Unexpected API shape:', data);
      return {};
    }

    const gifMap = {};

    data.data.forEach((item) => {
      const nameKey = item?.name?.toLowerCase?.().trim();

      if (nameKey && item?.gifUrl) {
        gifMap[nameKey] = item.gifUrl;
      }
    });

    console.log('built gifMap', gifMap);
    console.log('gifMap key count', Object.keys(gifMap).length);

    return gifMap;
  } catch (error) {
    console.error('fetchGifMap error:', error);
    return {};
  }
};