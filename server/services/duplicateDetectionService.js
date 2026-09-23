const { Op } = require('sequelize');
const { Report } = require('../models');

/**
 * Calculates Haversine distance in meters between two [lng, lat] pairs
 */
function calculateDistanceMeters(lon1, lat1, lon2, lat2) {
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Checks for potential duplicate civic reports near a coordinate
 * @param {Object} params
 * @param {number} params.lng - Longitude
 * @param {number} params.lat - Latitude
 * @param {string} params.category - Civic category
 * @param {number} [params.maxDistance=500] - Max radius in meters (default 500m)
 * @param {number} [params.daysWindow=30] - Lookback window in days (default 30 days)
 */
async function findPotentialDuplicates({ lng, lat, category, maxDistance = 500, daysWindow = 30 }) {
  const longitude = parseFloat(lng);
  const latitude = parseFloat(lat);

  if (isNaN(longitude) || isNaN(latitude)) {
    throw new Error('Valid longitude and latitude are required');
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysWindow);

  const latDelta = maxDistance / 111000;
  const lngDelta = maxDistance / (111000 * Math.cos(latitude * (Math.PI / 180)));

  const candidates = await Report.findAll({
    where: {
      status: { [Op.in]: ['REPORTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS'] },
      createdAt: { [Op.gte]: cutoffDate },
      latitude: { [Op.between]: [latitude - latDelta, latitude + latDelta] },
      longitude: { [Op.between]: [longitude - lngDelta, longitude + lngDelta] },
    },
    attributes: ['_id', 'reportId', 'title', 'category', 'description', 'status', 'priority', 'address', 'ward', 'images', 'createdAt', 'longitude', 'latitude'],
    limit: 50,
  });

  const withDistances = candidates
    .map((item) => {
      const plain = item.get({ plain: true });
      plain.distanceMeters = calculateDistanceMeters(longitude, latitude, plain.longitude, plain.latitude);
      plain.sameCategory = plain.category === category;
      plain.location = { coordinates: [plain.longitude, plain.latitude] };
      return plain;
    })
    .filter((item) => item.distanceMeters <= maxDistance)
    .sort((a, b) => {
      if (a.sameCategory === b.sameCategory) {
        return a.distanceMeters - b.distanceMeters;
      }
      return a.sameCategory ? -1 : 1;
    })
    .slice(0, 5);

  return withDistances;
}

module.exports = {
  findPotentialDuplicates,
  calculateDistanceMeters,
};
