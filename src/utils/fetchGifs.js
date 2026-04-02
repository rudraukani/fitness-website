export const fetchGifMap = async () => {
  try {
    const res = await fetch(
      'https://api.bodyworks.akshatjaiswal.me/api/v1/exercises?limit=200&page=1'
    );

    const data = await res.json();

    if (!data || !Array.isArray(data.data)) {
      console.error('Unexpected API shape:', data);
      return {};
    }

    const gifMap = {};

    data.data.forEach((item) => {
      const nameKey = item?.name?.toLowerCase?.().trim();
      const idKey = item?.id?.toString?.();

      if (item?.gifUrl) {
        if (nameKey) gifMap[nameKey] = item.gifUrl;
        if (idKey) gifMap[idKey] = item.gifUrl;
      }
    });

    return gifMap;
  } catch (error) {
    console.error('fetchGifMap error:', error);
    return {};
  }
};