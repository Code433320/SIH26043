// backend/src/services/ml.service.js

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * Calls the FastAPI ML service's /analyze-problem endpoint.
 * Returns category, priority score, duplicate detection, and cluster info.
 * Throws if the ML service is unreachable or returns an error — the caller
 * decides whether to fail the whole request or fall back gracefully.
 */
export const analyzeProblem = async ({ title, description, affected_people, severity, urgency }) => {
  const response = await fetch(`${ML_SERVICE_URL}/analyze-problem`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, affected_people, severity, urgency }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`ML service error (${response.status}): ${errorBody}`);
  }

  const result = await response.json();

  // Normalize to the shape problems.service.js expects
  return {
    category: result.category,
    priority_score: result.priority_score,
    duplicate_flag: result.is_duplicate,
    duplicate_of: result.duplicate_of,
    cluster_id: result.cluster_id,
  };
};