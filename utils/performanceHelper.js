// utils/performanceHelper.js

/**
 * Extracts numeric scores from AI feedback text
 * Looks for patterns like "Score: 8/10" or "Rating: 75%"
 */
export function extractScoresFromFeedback(feedbackText) {
  const scores = {
    communication: 0,
    technical: 0,
    problemSolving: 0,
    confidence: 0,
    clarity: 0
  };

  // Helper function to extract score from text
  const extractScore = (text, keywords) => {
    for (const keyword of keywords) {
      // Match patterns like "8/10", "8 out of 10", "80%"
      const patterns = [
        new RegExp(`${keyword}[:\\s]+([0-9]+)\\s*\\/\\s*10`, 'i'),
        new RegExp(`${keyword}[:\\s]+([0-9]+)%`, 'i'),
        new RegExp(`${keyword}[:\\s]+([0-9]+)\\s+out of\\s+10`, 'i')
      ];

      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          let score = parseInt(match[1]);
          // Convert to percentage if needed
          if (text.match(pattern).includes('/10') || text.match(pattern).includes('out of')) {
            score = score * 10;
          }
          return Math.min(100, Math.max(0, score));
        }
      }
    }
    return null;
  };

  // Extract scores for each category
  scores.communication = extractScore(feedbackText, [
    'communication',
    'speaking',
    'articulation',
    'expression'
  ]) || 0;

  scores.technical = extractScore(feedbackText, [
    'technical',
    'knowledge',
    'expertise',
    'skills'
  ]) || 0;

  scores.problemSolving = extractScore(feedbackText, [
    'problem solving',
    'problem-solving',
    'analytical',
    'thinking'
  ]) || 0;

  scores.confidence = extractScore(feedbackText, [
    'confidence',
    'assertiveness',
    'self-assurance'
  ]) || 0;

  scores.clarity = extractScore(feedbackText, [
    'clarity',
    'clear',
    'concise',
    'structured'
  ]) || 0;

  return scores;
}

/**
 * Calculates overall score from individual category scores
 */
export function calculateOverallScore(scores) {
  const validScores = Object.values(scores).filter(score => score > 0);
  
  if (validScores.length === 0) return 0;
  
  const sum = validScores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / validScores.length);
}

/**
 * Saves performance metrics to the database
 */
export async function savePerformanceMetrics({
  userEmail,
  mockId,
  feedbackText = null,
  manualScores = null
}) {
  try {
    let scores;

    // Use manual scores if provided, otherwise extract from feedback
    if (manualScores) {
      scores = manualScores;
    } else if (feedbackText) {
      scores = extractScoresFromFeedback(feedbackText);
    } else {
      throw new Error('Either feedbackText or manualScores must be provided');
    }

    const overallScore = calculateOverallScore(scores);

    const response = await fetch('/api/performance/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userEmail,
        mockId,
        overallScore,
        communicationScore: scores.communication,
        technicalScore: scores.technical,
        problemSolvingScore: scores.problemSolving,
        confidenceScore: scores.confidence,
        clarityScore: scores.clarity
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to save performance metrics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving performance metrics:', error);
    throw error;
  }
}

/**
 * Example usage after interview completion:
 * 
 * // Option 1: Extract from AI feedback
 * await savePerformanceMetrics({
 *   userEmail: user.primaryEmailAddress.emailAddress,
 *   mockId: interviewId,
 *   feedbackText: aiFeedback
 * });
 * 
 * // Option 2: Provide manual scores
 * await savePerformanceMetrics({
 *   userEmail: user.primaryEmailAddress.emailAddress,
 *   mockId: interviewId,
 *   manualScores: {
 *     communication: 85,
 *     technical: 75,
 *     problemSolving: 80,
 *     confidence: 70,
 *     clarity: 90
 *   }
 * });
 */