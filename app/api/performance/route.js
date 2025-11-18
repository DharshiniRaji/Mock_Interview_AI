import { db } from "@/utils/db";
import { UserAnswer, MockInterview, PerformanceMetrics } from "@/utils/schema";
import { eq, desc, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    // Get all user's interview attempts
    const userInterviews = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, userEmail))
      .orderBy(desc(MockInterview.createdAt));

    // Get all user answers with ratings
    const userAnswers = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.userEmail, userEmail))
      .orderBy(desc(UserAnswer.createdAt));

    // Calculate performance metrics
    const performanceData = calculatePerformanceMetrics(userAnswers, userInterviews);

    return NextResponse.json(performanceData);
  } catch (error) {
    console.error("Error fetching performance data:", error);
    return NextResponse.json(
      { error: "Failed to fetch performance data" },
      { status: 500 }
    );
  }
}

function calculatePerformanceMetrics(answers, interviews) {
  if (!answers.length) {
    return {
      overallScore: 0,
      interviewsTaken: 0,
      averageConfidence: 0,
      improvementRate: 0,
      skillScores: [],
      progressOverTime: [],
      weakAreas: [],
      strengths: []
    };
  }

  // Group answers by mock interview
  const interviewGroups = {};
  answers.forEach(answer => {
    if (!interviewGroups[answer.mockIdRef]) {
      interviewGroups[answer.mockIdRef] = [];
    }
    interviewGroups[answer.mockIdRef].push(answer);
  });

  // Calculate scores for each interview session
  const sessionScores = Object.entries(interviewGroups).map(([mockId, answers]) => {
    const avgRating = answers.reduce((sum, a) => sum + (parseInt(a.rating) || 0), 0) / answers.length;
    const interview = interviews.find(i => i.mockId === mockId);
    
    return {
      mockId,
      score: avgRating * 10, // Convert 1-10 rating to percentage
      date: interview?.createdAt || new Date().toISOString(),
      answers
    };
  });

  // Sort by date
  sessionScores.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate overall metrics
  const overallScore = sessionScores.reduce((sum, s) => sum + s.score, 0) / sessionScores.length;
  
  // Calculate improvement rate (comparing first half vs second half)
  const midPoint = Math.floor(sessionScores.length / 2);
  const firstHalfAvg = sessionScores.slice(0, midPoint).reduce((sum, s) => sum + s.score, 0) / midPoint || 0;
  const secondHalfAvg = sessionScores.slice(midPoint).reduce((sum, s) => sum + s.score, 0) / (sessionScores.length - midPoint) || 0;
  const improvementRate = firstHalfAvg > 0 ? Math.round(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100) : 0;

  // Analyze skills from feedback
  const skillScores = analyzeSkills(answers);

  // Get progress over time (last 5 sessions)
  const progressOverTime = sessionScores.slice(-5).map((session, index) => ({
    date: `Session ${sessionScores.length - 4 + index}`,
    score: Math.round(session.score),
    confidence: Math.round(session.score * 0.9) // Approximate confidence from score
  }));

  // Identify weak areas
  const weakAreas = skillScores
    .filter(skill => skill.score < 70)
    .map(skill => ({
      area: skill.skill,
      score: skill.score,
      feedback: generateFeedback(skill.skill, skill.score)
    }));

  // Identify strengths
  const strengths = skillScores
    .filter(skill => skill.score >= 75)
    .slice(0, 3)
    .map(skill => ({
      area: skill.skill,
      score: skill.score
    }));

  return {
    overallScore: Math.round(overallScore),
    interviewsTaken: interviews.length,
    averageConfidence: Math.round(overallScore * 0.9),
    improvementRate: Math.max(0, improvementRate),
    skillScores,
    progressOverTime,
    weakAreas: weakAreas.slice(0, 3),
    strengths
  };
}

function analyzeSkills(answers) {
  const skills = {
    'Communication': [],
    'Technical Knowledge': [],
    'Problem Solving': [],
    'Confidence': [],
    'Clarity': [],
    'Body Language': []
  };

  answers.forEach(answer => {
    const rating = parseInt(answer.rating) || 0;
    const score = rating * 10;
    const feedback = answer.feedback?.toLowerCase() || '';

    // Analyze feedback to categorize skills
    if (feedback.includes('communication') || feedback.includes('express')) {
      skills['Communication'].push(score);
    }
    if (feedback.includes('technical') || feedback.includes('knowledge')) {
      skills['Technical Knowledge'].push(score);
    }
    if (feedback.includes('problem') || feedback.includes('solution')) {
      skills['Problem Solving'].push(score);
    }
    if (feedback.includes('confident') || feedback.includes('assurance')) {
      skills['Confidence'].push(score);
    }
    if (feedback.includes('clear') || feedback.includes('concise')) {
      skills['Clarity'].push(score);
    }
    
    // Default: add to all skills if no specific match
    if (!feedback) {
      Object.keys(skills).forEach(key => skills[key].push(score));
    }
  });

  // Calculate average for each skill
  return Object.entries(skills).map(([skill, scores]) => {
    const validScores = scores.length > 0 ? scores : [50]; // Default if no data
    const currentScore = Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length);
    const previousScore = validScores.length > 1 
      ? Math.round(validScores.slice(0, -1).reduce((a, b) => a + b, 0) / (validScores.length - 1))
      : currentScore - 5;
    
    return {
      skill,
      score: currentScore,
      previous: previousScore,
      target: 85
    };
  });
}

function generateFeedback(skill, score) {
  const feedbackMap = {
    'Communication': 'Focus on articulating your thoughts clearly and concisely',
    'Technical Knowledge': 'Deepen your understanding of core technical concepts',
    'Problem Solving': 'Practice breaking down complex problems systematically',
    'Confidence': 'Build confidence through more practice interviews',
    'Clarity': 'Work on structuring your answers using frameworks like STAR',
    'Body Language': 'Practice maintaining eye contact and confident posture'
  };

  return feedbackMap[skill] || 'Continue practicing to improve this area';
}