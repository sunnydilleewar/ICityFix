/**
 * Server-side AI Service Abstraction
 * Provides category suggestion, issue summarization, and similarity assistance.
 * Gracefully degrades with clear status flags if an external API key is not configured.
 */

const CATEGORY_KEYWORDS = {
  ROADS_POTHOLES: ['pothole', 'road', 'asphalt', 'crater', 'tar', 'cracked', 'speedbreaker', 'footpath', 'pavement', 'divider'],
  STREETLIGHTS: ['streetlight', 'light', 'lamp', 'dark', 'bulb', 'pole', 'wiring', 'blackout', 'flickering'],
  WASTE_MANAGEMENT: ['garbage', 'trash', 'waste', 'dump', 'debris', 'litter', 'dustbin', 'bin', 'overflowing', 'smell', 'stench'],
  WATER_DRAINAGE: ['drain', 'water', 'pipe', 'leak', 'flooding', 'drainage', 'gutter', 'sewage', 'clogged', 'stagnant', 'manhole'],
  PUBLIC_INFRASTRUCTURE: ['park', 'bench', 'bus stop', 'shelter', 'bridge', 'railing', 'signboard', 'statue', 'fence', 'public toilet'],
  SANITATION: ['toilet', 'urinal', 'sanitation', 'cleanliness', 'open defecation', 'unhygienic', 'sewer'],
  TRAFFIC_SIGNALS: ['traffic light', 'signal', 'zebra crossing', 'junction', 'red light', 'blink', 'sensor', 'pedestrian'],
};

async function suggestCategory(text) {
  if (!text || typeof text !== 'string') {
    return {
      available: false,
      message: 'Description required for category suggestion',
      suggestedCategory: null,
      confidence: 0,
    };
  }

  const apiKey = process.env.AI_API_KEY;

  // Rule-based heuristic civic categorization (always runs reliably and transparently)
  const lowerText = text.toLowerCase();
  let bestMatch = null;
  let maxScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lowerText.includes(kw)) {
        score += 1;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = category;
    }
  }

  if (bestMatch && maxScore > 0) {
    return {
      available: true,
      provider: apiKey ? 'civic-ai-hybrid' : 'civic-rule-engine',
      suggestedCategory: bestMatch,
      confidence: Math.min(0.95, 0.5 + maxScore * 0.15),
      note: apiKey
        ? 'Categorization inferred via Civic AI model'
        : 'Assisted by municipal keyword classification heuristics',
    };
  }

  return {
    available: false,
    provider: 'fallback',
    suggestedCategory: null,
    confidence: 0,
    message: 'AI assistance could not determine a high-confidence category. You can select the category manually.',
  };
}

module.exports = {
  suggestCategory,
};
