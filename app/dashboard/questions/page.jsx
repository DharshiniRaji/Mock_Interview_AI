"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoaderCircle, Upload, Code, MessageSquare, Brain, Timer, Bug, CheckCircle } from 'lucide-react';
import { chatSession } from '@/utils/GeminiAIModel';

const DSAInterviewQuestions = () => {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPhase, setCurrentPhase] = useState('selection'); // selection, intuition, algorithm, complexity, coding, debugging, feedback
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [customProblem, setCustomProblem] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [phaseScores, setPhaseScores] = useState({});
  const [currentCode, setCurrentCode] = useState('');

  const categories = ['All', 'Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Searching'];

  const dsaProblems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      category: "Arrays",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      examples: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]"
    },
    {
      id: 2,
      title: "Valid Parentheses",
      difficulty: "Easy", 
      category: "Strings",
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      examples: "Input: s = '()'\nOutput: true"
    },
    {
      id: 3,
      title: "Binary Tree Inorder Traversal",
      difficulty: "Medium",
      category: "Trees",
      description: "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
      examples: "Input: root = [1,null,2,3]\nOutput: [1,3,2]"
    },
    {
      id: 4,
      title: "Longest Common Subsequence",
      difficulty: "Medium",
      category: "Dynamic Programming", 
      description: "Given two strings text1 and text2, return the length of their longest common subsequence.",
      examples: "Input: text1 = 'abcde', text2 = 'ace'\nOutput: 3"
    },
    {
      id: 5,
      title: "Number of Islands",
      difficulty: "Medium",
      category: "Graphs",
      description: "Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
      examples: "Input: grid = [['1','1','0'],['1','1','0'],['0','0','1']]\nOutput: 2"
    }
  ];

  const filteredProblems = selectedCategory === 'All' 
    ? dsaProblems 
    : dsaProblems.filter(problem => problem.category === selectedCategory);

  const phaseConfig = {
    selection: { icon: Code, title: "Choose Problem", color: "bg-blue-500" },
    intuition: { icon: Brain, title: "Intuition Phase", color: "bg-purple-500" },
    algorithm: { icon: MessageSquare, title: "Algorithm Discussion", color: "bg-green-500" },
    complexity: { icon: Timer, title: "Complexity Analysis", color: "bg-yellow-500" },
    coding: { icon: Code, title: "Coding Phase", color: "bg-red-500" },
    debugging: { icon: Bug, title: "Debugging", color: "bg-orange-500" },
    feedback: { icon: CheckCircle, title: "Final Feedback", color: "bg-emerald-500" }
  };

  const startInterview = async (problem) => {
    setSelectedProblem(problem);
    setCurrentPhase('intuition');
    setConversation([]);
    setLoading(true);
    
    const initialPrompt = `You are conducting a DSA interview. The problem is: "${problem.title}". 
    Description: ${problem.description}
    Examples: ${problem.examples}
    ----------------------------------------------

    You are conducting a technical DSA interview.
    Your tone must be strict but polite, not sycophantic, and concise like a real interviewer.
    Do not give long paragraphs. Do not over-explain unless the candidate explicitly asks.

    ----------------------------------------------
    INTUITION vs ALGORITHM RULES (IMPORTANT)
    ----------------------------------------------
    - Intuition = High-level idea, concept, or mental model. No steps.
      Example: "I will use a hash map to check complements quickly."

    - Algorithm = Step-by-step procedure with ordered actions.
      Example: "1. Create a map 2. Loop through array 3. Check complement 4. Store number."

    - If the candidate gives algorithm-level detail during the Intuition Phase,
      say: "That's too detailed. Give only the high-level intuition."

    - If the candidate gives vague intuition like "I'll think logically" or
      "I'll check the numbers," say: "That's too generic. Give a deeper intuition."
    ----------------------------------------------

    ----------------------------------------------
    FOLLOW-UP LIMIT RULE (IMPORTANT)
    ----------------------------------------------
    - Ask ONLY ONE follow-up question per phase if necessary.
    - Do NOT ask multiple follow-ups.
    - You may ask ONE edge-case question in Algorithm Phase if needed.
    - No unnecessary questioning or dragging the interview.
    ----------------------------------------------


    Interview Flow Rules:

    1. Intuition Phase:
    - Start with:
      "Let's start the {problem.title}. Example: {examples}. What's your approach? Explain your initial thoughts without writing code."
    - Keep responses short.
    - If the answer is too generic, respond: "That's too generic. Give a deeper intuition."
    - If they give algorithm steps, say: "That's too detailed. Keep it high-level."
    - If the answer is wrong, do not give hints unless they ask.
    - If correct, move to Algorithm Phase.

    2. Algorithm Phase:
    - Ask for their algorithm.
    - You may ask ONE follow-up or ONE edge case:
      "Will your algorithm work for this test case: {test case}?"
    - Do not reveal the solution unless they explicitly ask.

    3. Complexity Phase:
    - If the algorithm is correct, ask:
      "Let's discuss complexity. What is the time and space complexity of your solution?"
    - If incorrect, stay in this phase, ask at most ONE follow-up, no hints unless asked.

    4. Coding Phase:
    - Evaluate code strictly.
    - If wrong, no hints unless asked.
    - If correct, move to Debugging & Feedback.

    5. Debugging & Feedback Phase:
    - Give minimal feedback.
    - Provide only small corrections or slight improvements.
    - If everything is correct, acknowledge briefly.

    General Rules:
    - Never flatter.
    - Never reveal solutions unless explicitly asked.
    - Be concise, strict, and professional.
    - No long paragraphs.
    `;
    
    try {
    const result = await chatSession.sendMessage(initialPrompt);
    const aiResponse = result.response.text();

    setConversation([{
      type: 'ai',
      message: aiResponse,
      phase: 'intuition'
    }]);
  } catch (error) {
    console.error('Error starting interview:', error);

    // Friendly fallback message
    setConversation([{
      type: 'ai',
      message: '⚠️ AI service is currently unavailable. Please try again in a few moments.',
      phase: 'intuition'
    }]);
  } finally {
    setLoading(false);
  }
};
  const handleUserInput = async () => {
    if (!userResponse.trim()) return;
    
    const newUserMessage = {
      type: 'user',
      message: userResponse,
      phase: currentPhase
    };
    
    setConversation(prev => [...prev, newUserMessage]);
    setLoading(true);
    
    try {
    let prompt = '';

    switch(currentPhase) {
      case 'intuition':
        prompt = `User's intuition response: "${userResponse}"

        As the interviewer:
        - Evaluate the intuition.
        - If it is vague, reply: "That's too generic. Give a deeper intuition."
        - If it is too detailed, reply: "That's too detailed. Keep it high-level."
        - Ask ONLY ONE follow-up question if needed.
        Do NOT ask multiple questions.

        If the intuition is correct, transition to Algorithm Phase by saying:
        "Good. Now explain your algorithm step by step."`;
        break;

      case 'algorithm':
        prompt = `User's algorithm explanation: "${userResponse}"

        As the interviewer:
        - Evaluate clarity and correctness.
        - Ask ONLY ONE follow-up OR ONE edge case.
        Example edge case to ask: "Will your algorithm handle this test case correctly: [edge case]?"
        Do NOT ask more than one.

        If the algorithm is correct, transition to Complexity Phase by saying:
        "Good. Now let's discuss complexity."`;
        break;

      case 'complexity':
        prompt = `User's complexity response: "${userResponse}"

        As the interviewer:
        - Verify time and space complexity.
        - Ask ONLY ONE follow-up if necessary.
        Do NOT ask multiple questions.

        If correct, transition to Coding Phase by saying:
        "Good. Now implement your solution."`;
        break;

      case 'coding':
        prompt = `User's code: "${userResponse}"

        As the interviewer:
        - Evaluate correctness, edge cases, and style.
        - If issues exist, point out ONE specific correction.
        If mostly correct, say:
        "Looks good. Let's test and debug."`;
        break;

      case 'debugging':
        prompt = `User's debugging attempt: "${userResponse}"

        As the interviewer:
        - Point out ONE specific issue if anything exists else just appreciate the candidate.
        - Guide minimally, no over-explaining.
        - If everything is correct, immediately feedback should be generated next.`;
        break;
    }

    const result = await chatSession.sendMessage(prompt);
    const aiResponse = result.response.text();

    // Detect phase transitions
    let nextPhase = currentPhase;
    if (aiResponse.toLowerCase().includes('algorithm') && currentPhase === 'intuition') {
      nextPhase = 'algorithm';
    } else if (aiResponse.toLowerCase().includes('complexity') && currentPhase === 'algorithm') {
      nextPhase = 'complexity';
    } else if (aiResponse.toLowerCase().includes('implement') && currentPhase === 'complexity') {
      nextPhase = 'coding';
    } else if (aiResponse.toLowerCase().includes('test') && currentPhase === 'coding') {
      nextPhase = 'debugging';
    } else if (currentPhase === 'debugging' && aiResponse.toLowerCase().includes('feedback')) {
      // Automatically generate feedback after debugging
      await generateFinalFeedback();
      nextPhase = 'feedback';
    }

    setCurrentPhase(nextPhase);

    setConversation(prev => [...prev, {
      type: 'ai',
      message: aiResponse,
      phase: nextPhase
    }]);

  } catch (error) {
    console.error('Error sending message:', error);
  }

  setUserResponse('');
  setLoading(false);
};

  const handleCustomProblem = async () => {
    if (!customProblem.trim()) return;
    
    const problem = {
      id: 'custom',
      title: "Custom Problem",
      difficulty: "Unknown",
      category: "Custom",
      description: customProblem,
      examples: "Custom problem uploaded by user"
    };
    
    setShowUploadDialog(false);
    await startInterview(problem);
  };

  const generateFinalFeedback = async () => {
  setLoading(true);
  const prompt = `Generate concise interview feedback based on this conversation: ${JSON.stringify(conversation)}

  Output format MUST be exactly like this:

  Scores (1-10):
    - Problem-solving approach: [score]
    - Communication and explanation: [score]
    - Code quality: [score]
    - Overall performance: [score]

  Specific improvement (if any): [short suggestion]

  Do NOT include long paragraphs or detailed phase-by-phase breakdowns. Keep it very concise and easy to read.`;

    try {
      const result = await chatSession.sendMessage(prompt);
      const feedback = result.response.text();

      setConversation(prev => [...prev, {
        type: 'ai',
        message: feedback,
        phase: 'feedback'
      }]);
      setCurrentPhase('feedback');
    } catch (error) {
      console.error('Error generating feedback:', error);
    }
    setLoading(false);
  };


  if (currentPhase !== 'selection' && selectedProblem) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedProblem.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={selectedProblem.difficulty === 'Easy' ? 'secondary' : selectedProblem.difficulty === 'Medium' ? 'default' : 'destructive'}>
                    {selectedProblem.difficulty}
                  </Badge>
                  <Badge variant="outline">{selectedProblem.category}</Badge>
                </div>
              </div>
              <Button variant="outline" onClick={() => setCurrentPhase('selection')}>
                Back to Problems
              </Button>
            </div>
          </div>

          {/* Phase Progress */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4 overflow-x-auto">
              {Object.entries(phaseConfig).map(([phase, config], index) => {
                const Icon = config.icon;
                const isActive = currentPhase === phase;
                const isCompleted = Object.keys(phaseConfig).indexOf(currentPhase) > index;
                
                return (
                  <div key={phase} className="flex items-center gap-2 min-w-fit">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                      isActive ? config.color : isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <span className={`font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                      {config.title}
                    </span>
                    {index < Object.keys(phaseConfig).length - 2 && (
                      <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Problem Description */}
            <div className="lg:col-span-1">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>Problem Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{selectedProblem.description}</p>
                  <div>
                    <h4 className="font-medium mb-2">Examples:</h4>
                    <pre className="text-xs bg-gray-100 p-3 rounded whitespace-pre-wrap">
                      {selectedProblem.examples}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interview Conversation */}
            <div className="lg:col-span-2">
              <Card className="h-96">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare size={20} />
                    Interview Conversation
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {conversation.map((msg, index) => (
                      <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.type === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 px-4 py-2 rounded-lg">
                          <LoaderCircle className="animate-spin h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {currentPhase !== 'feedback' && (
                    <div className="space-y-3">
                      {currentPhase === 'coding' ? (
                        <Textarea
                          placeholder="Write your code here..."
                          value={userResponse}
                          onChange={(e) => setUserResponse(e.target.value)}
                          className="min-h-24 font-mono text-sm"
                        />
                      ) : (
                        <Textarea
                          placeholder="Type your response..."
                          value={userResponse}
                          onChange={(e) => setUserResponse(e.target.value)}
                          className="min-h-16"
                        />
                      )}
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleUserInput} 
                          disabled={loading || !userResponse.trim()}
                          className="flex-1"
                        >
                          {loading ? (
                            <>
                              <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                              Processing...
                            </>
                          ) : (
                            'Send Response'
                          )}
                        </Button>
                        {currentPhase === 'debugging' && (
                          <Button onClick={generateFinalFeedback} variant="outline">
                            Get Feedback
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🧠 DSA Interview Practice</h1>
          <p className="text-gray-600">Master DSA interviews through structured practice with AI feedback</p>
        </div>

        {/* Problem Selection Actions */}
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            onClick={() => setShowUploadDialog(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload size={18} />
            Upload Custom Problem
          </Button>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Select Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Problem Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProblems.map(problem => (
            <Card key={problem.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{problem.title}</CardTitle>
                  <Badge variant={
                    problem.difficulty === 'Easy' ? 'secondary' : 
                    problem.difficulty === 'Medium' ? 'default' : 
                    'destructive'
                  }>
                    {problem.difficulty}
                  </Badge>
                </div>
                <Badge variant="outline" className="w-fit">{problem.category}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {problem.description}
                </p>
                <Button 
                  onClick={() => startInterview(problem)}
                  className="w-full"
                >
                  Start Interview
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Problem Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Custom Problem</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Paste your DSA problem description here..."
                value={customProblem}
                onChange={(e) => setCustomProblem(e.target.value)}
                className="min-h-32"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleCustomProblem}
                  disabled={!customProblem.trim()}
                  className="flex-1"
                >
                  Start Interview
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowUploadDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DSAInterviewQuestions;