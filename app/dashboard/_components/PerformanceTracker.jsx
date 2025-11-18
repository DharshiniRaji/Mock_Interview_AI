"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Award, AlertCircle, Loader2 } from 'lucide-react';

const PerformanceTracker = () => {
  const [selectedView, setSelectedView] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/performance');
      
      if (!response.ok) {
        throw new Error('Failed to fetch performance data');
      }
      
      const performanceData = await response.json();
      setData(performanceData);
    } catch (err) {
      console.error('Error fetching performance data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (current, previous) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your performance data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2 text-center">Error Loading Data</h3>
          <p className="text-red-700 text-center">{error}</p>
          <button 
            onClick={fetchPerformanceData}
            className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!data || data.interviewsTaken === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Performance Data Yet</h3>
          <p className="text-gray-600 mb-6">
            Complete your first mock interview to see your performance analytics and track your progress.
          </p>
          <a 
            href="/dashboard"
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Start Your First Interview
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Performance Tracker</h1>
          <p className="text-gray-600">Track your progress and identify areas for improvement</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Overall Score</span>
              <Award className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{data.overallScore}%</div>
            <div className="flex items-center mt-2 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+{data.improvementRate}% improvement</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Interviews Taken</span>
              <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xs font-bold">{data.interviewsTaken}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{data.interviewsTaken}</div>
            <p className="text-gray-500 text-sm mt-2">Total sessions</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Avg Confidence</span>
              <div className="w-5 h-5 bg-green-100 rounded-full"></div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{data.averageConfidence}%</div>
            <p className="text-gray-500 text-sm mt-2">Based on analysis</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Improvement Rate</span>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">+{data.improvementRate}%</div>
            <p className="text-gray-500 text-sm mt-2">Overall growth</p>
          </div>
        </div>

        {/* View Selector */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'skills', 'progress', 'weaknesses'].map((view) => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                    selectedView === view
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {view}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview View */}
            {selectedView === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Progress Over Time */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Over Time</h3>
                    {data.progressOverTime.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.progressOverTime}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} name="Overall Score" />
                          <Line type="monotone" dataKey="confidence" stroke="#10B981" strokeWidth={2} name="Confidence" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-400">
                        <p>Complete more interviews to see progress trends</p>
                      </div>
                    )}
                  </div>

                  {/* Skills Radar */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Overview</h3>
                    {data.skillScores.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={data.skillScores}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="skill" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar name="Current Score" dataKey="score" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                          <Radar name="Target" dataKey="target" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-400">
                        <p>Skills analysis will appear after interviews</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Skills View */}
            {selectedView === 'skills' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Breakdown</h3>
                {data.skillScores.length > 0 ? (
                  <div className="space-y-4">
                    {data.skillScores.map((skill, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-900">{skill.skill}</span>
                            {getTrendIcon(skill.score, skill.previous)}
                          </div>
                          <span className={`text-lg font-bold ${getScoreColor(skill.score)}`}>
                            {skill.score}%
                          </span>
                        </div>
                        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${skill.score}%` }}
                          ></div>
                          <div
                            className="absolute top-0 left-0 h-full border-r-2 border-green-500"
                            style={{ left: `${skill.target}%` }}
                            title={`Target: ${skill.target}%`}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Previous: {skill.previous}%</span>
                          <span>Target: {skill.target}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <p>Complete interviews to see detailed skill breakdowns</p>
                  </div>
                )}
              </div>
            )}

            {/* Progress View */}
            {selectedView === 'progress' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Progress Analysis</h3>
                {data.progressOverTime.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={data.progressOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" fill="#3B82F6" name="Overall Score" />
                        <Bar dataKey="confidence" fill="#10B981" name="Confidence Level" />
                      </BarChart>
                    </ResponsiveContainer>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {data.strengths.length > 0 && (
                        <div className="bg-green-50 rounded-lg p-6">
                          <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                            <Award className="w-5 h-5 mr-2" />
                            Your Strengths
                          </h4>
                          <div className="space-y-2">
                            {data.strengths.map((strength, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-green-800">{strength.area}</span>
                                <span className="font-bold text-green-900">{strength.score}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-blue-50 rounded-lg p-6">
                        <h4 className="font-semibold text-blue-900 mb-3">Quick Stats</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-blue-700">Best Performance</p>
                            <p className="text-2xl font-bold text-blue-900">
                              {Math.max(...data.progressOverTime.map(p => p.score))}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-blue-700">Average Score</p>
                            <p className="text-2xl font-bold text-blue-900">
                              {Math.round(data.progressOverTime.reduce((a, b) => a + b.score, 0) / data.progressOverTime.length)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <p>Progress tracking will appear after multiple interview sessions</p>
                  </div>
                )}
              </div>
            )}

            {/* Weaknesses View */}
            {selectedView === 'weaknesses' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas for Improvement</h3>
                {data.weakAreas.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {data.weakAreas.map((area, index) => (
                        <div key={index} className="bg-red-50 rounded-lg p-6 border border-red-100">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-lg ${getScoreBgColor(area.score)}`}>
                              <AlertCircle className={`w-6 h-6 ${getScoreColor(area.score)}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">{area.area}</h4>
                                <span className={`text-lg font-bold ${getScoreColor(area.score)}`}>
                                  {area.score}%
                                </span>
                              </div>
                              <p className="text-gray-700 mb-3">{area.feedback}</p>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    area.score >= 80 ? 'bg-green-500' : area.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${area.score}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 bg-blue-50 rounded-lg p-6">
                      <h4 className="font-semibold text-blue-900 mb-3">Recommended Actions</h4>
                      <ul className="space-y-2 text-blue-800">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Schedule more practice sessions focused on your weak areas</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Review feedback from previous interviews carefully</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Practice answering questions using structured frameworks</span>
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-green-50 rounded-lg p-8 max-w-md mx-auto">
                      <Award className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-green-900 mb-2">Great Job!</h4>
                      <p className="text-green-700">
                        You're performing well across all areas. Keep up the excellent work!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTracker;