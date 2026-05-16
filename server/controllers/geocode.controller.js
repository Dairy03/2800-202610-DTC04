export const getLatLongFromAddress = async (address) => {
  try {
    const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

    const url =
      `https://api.geoapify.com/v1/geocode/search` +
      `?text=${encodeURIComponent(address)}` +
      `&filter=countrycode:ca` +
      `&apiKey=${encodeURIComponent(GEOAPIFY_API_KEY)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      throw new Error(
        `Geocoding failed: ${data.statusCode || ""} ${data.error} - ${
          data.message || ""
        }`
      );
    }

    if (!data.features || !data.features.length) {
      throw new Error(`Geocoding failed: no results found for "${address}"`);
    }

    const result = data.features[0];
    const lat = result.properties.lat;
    const lng = result.properties.lon;

    return [lat, lng];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
