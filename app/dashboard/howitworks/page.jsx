"use client";

import { 
  Brain, 
  Video, 
  MessageSquare, 
  Star, 
  Upload, 
  Code, 
  Timer, 
  CheckCircle, 
  FileText, 
  Camera, 
  Mic, 
  Target, 
  TrendingUp, 
  Lightbulb,
  Users,
  Award,
  BarChart3,
  Zap,
  Shield,
  PlayCircle,
  BookOpen,
  Cpu,
  GitBranch,
  PieChart
} from "lucide-react";

const mainFeatures = [
  {
    icon: <Brain className="w-12 h-12 text-purple-500" />,
    title: "Traditional Mock Interviews",
    description: "Create customized interviews based on job position, tech stack, and experience level",
    steps: [
      "Enter your target job role (e.g., Frontend Developer)",
      "Specify the tech stack (React, Node.js, Python, etc.)",
      "Set your experience level (0-50 years)",
      "AI generates relevant interview questions instantly"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: <Code className="w-12 h-12 text-blue-500" />,
    title: "DSA Interview Practice", 
    description: "Master Data Structures & Algorithms through structured coding interviews",
    steps: [
      "Choose from curated DSA problems by category",
      "Go through structured phases: Intuition → Algorithm → Complexity → Coding → Debugging",
      "Get real-time feedback on your problem-solving approach",
      "Receive detailed performance analysis and improvement suggestions"
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <FileText className="w-12 h-12 text-green-500" />,
    title: "Resume-Based Interviews",
    description: "Upload your resume and get personalized questions about your projects and experience",
    steps: [
      "Upload your PDF resume for automatic parsing",
      "AI extracts projects, skills, and experience details",
      "Choose context-specific or overall resume questions",
      "Practice with questions tailored to your background"
    ],
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <Video className="w-12 h-12 text-red-500" />,
    title: "Video & Audio Recording",
    description: "Practice with real interview conditions using camera and microphone",
    steps: [
      "Enable webcam and microphone for realistic practice",
      "Record your responses to review later",
      "Speech-to-text conversion for easy answer submission",
      "Build confidence with video interview simulation"
    ],
    color: "from-red-500 to-orange-500"
  }
];

const workflowSteps = [
  {
    step: "01",
    icon: <Target className="w-8 h-8 text-white" />,
    title: "Choose Your Path",
    description: "Select from Traditional Interviews, DSA Practice, or Resume-based sessions based on your preparation needs.",
    bgColor: "bg-blue-500"
  },
  {
    step: "02", 
    icon: <PlayCircle className="w-8 h-8 text-white" />,
    title: "Set Up Your Session",
    description: "Configure job details, upload resume, or select coding problems. Enable camera/microphone for realistic practice.",
    bgColor: "bg-purple-500"
  },
  {
    step: "03",
    icon: <MessageSquare className="w-8 h-8 text-white" />,
    title: "Practice & Record",
    description: "Answer AI-generated questions while recording. Use speech-to-text or type responses directly.",
    bgColor: "bg-green-500"
  },
  {
    step: "04",
    icon: <Brain className="w-8 h-8 text-white" />,
    title: "Get AI Feedback",
    description: "Receive detailed analysis on communication, technical clarity, confidence, and specific improvement areas.",
    bgColor: "bg-orange-500"
  },
  {
    step: "05",
    icon: <TrendingUp className="w-8 h-8 text-white" />,
    title: "Track Progress",
    description: "Monitor your improvement over time with detailed analytics and performance metrics.",
    bgColor: "bg-indigo-500"
  }
];

const dsaPhases = [
  {
    phase: "Intuition",
    icon: <Lightbulb className="w-6 h-6" />,
    description: "Explain your initial approach and thinking process",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300"
  },
  {
    phase: "Algorithm", 
    icon: <GitBranch className="w-6 h-6" />,
    description: "Discuss the detailed algorithm and data structures",
    color: "bg-blue-100 text-blue-800 border-blue-300"
  },
  {
    phase: "Complexity",
    icon: <Timer className="w-6 h-6" />,
    description: "Analyze time and space complexity of your solution",
    color: "bg-purple-100 text-purple-800 border-purple-300"
  },
  {
    phase: "Coding",
    icon: <Code className="w-6 h-6" />,
    description: "Implement your solution with clean, working code",
    color: "bg-green-100 text-green-800 border-green-300"
  },
  {
    phase: "Debugging",
    icon: <Shield className="w-6 h-6" />,
    description: "Test with examples and handle edge cases",
    color: "bg-red-100 text-red-800 border-red-300"
  }
];

const features = [
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "AI-Powered Questions",
    description: "Dynamic question generation based on job requirements and experience level"
  },
  {
    icon: <Camera className="w-6 h-6 text-blue-500" />,
    title: "Video Practice",
    description: "Record yourself to improve body language and presentation skills"
  },
  {
    icon: <Mic className="w-6 h-6 text-green-500" />,
    title: "Speech Recognition", 
    description: "Convert speech to text for seamless answer submission"
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-purple-500" />,
    title: "Detailed Analytics",
    description: "Comprehensive feedback on communication, technical skills, and confidence"
  },
  {
    icon: <BookOpen className="w-6 h-6 text-indigo-500" />,
    title: "Resume Parsing",
    description: "Automatic extraction and analysis of your resume content"
  },
  {
    icon: <Users className="w-6 h-6 text-pink-500" />,
    title: "Progress Tracking",
    description: "Monitor improvement across multiple interview sessions"
  }
];

const stats = [
  { number: "5+", label: "Interview Types", icon: <MessageSquare className="w-5 h-5" /> },
  { number: "50+", label: "DSA Problems", icon: <Code className="w-5 h-5" /> },
  { number: "10+", label: "Skill Categories", icon: <Target className="w-5 h-5" /> },
  { number: "AI", label: "Powered Feedback", icon: <Brain className="w-5 h-5" /> }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How It <span className="text-yellow-300">Works</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Master your interview skills with our comprehensive AI-powered platform. 
              Practice traditional interviews, DSA coding, and resume-based questions 
              with real-time feedback and analytics.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold">{stat.number}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Interview Preparation Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform offers multiple specialized interview formats to prepare you for any technical role
          </p>
        </div>

        <div className="grid gap-12 lg:gap-16">
          {mainFeatures.map((feature, index) => (
            <div key={index} className={`relative ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''} lg:flex lg:items-center lg:gap-12`}>
              <div className="lg:w-1/2">
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.color} mb-6`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  {feature.description}
                </p>
                <div className="space-y-3">
                  {feature.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                        {stepIndex + 1}
                      </div>
                      <p className="text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 mt-8 lg:mt-0">
                <div className="bg-white rounded-2xl shadow-xl p-8 border">
                  <div className={`h-64 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center`}>
                    <div className="text-white text-6xl opacity-50">
                      {feature.icon}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DSA Interview Phases */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              DSA Interview Phases
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our structured approach mirrors real coding interviews with five distinct phases
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {dsaPhases.map((phase, index) => (
              <div key={index} className={`${phase.color} border rounded-xl p-6 hover:shadow-lg transition-shadow`}>
                <div className="flex items-center gap-3 mb-4">
                  {phase.icon}
                  <h3 className="font-bold text-lg">{phase.phase}</h3>
                </div>
                <p className="text-sm leading-relaxed">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Interview Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow our proven 5-step process to maximize your interview preparation
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200"></div>
          
          <div className="space-y-12">
            {workflowSteps.map((step, index) => (
              <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8`}>
                {/* Step Number Circle */}
                <div className={`hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center text-white font-bold text-xl z-10`}>
                  {step.step}
                </div>
                
                {/* Content */}
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16'}`}>
                  <div className="bg-white rounded-xl shadow-lg p-8 border hover:shadow-xl transition-shadow">
                    <div className={`inline-flex p-3 ${step.bgColor} rounded-xl mb-6`}>
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
                
                {/* Mobile Step Number */}
                <div className={`lg:hidden flex-shrink-0 w-12 h-12 ${step.bgColor} rounded-full flex items-center justify-center text-white font-bold`}>
                  {step.step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features Grid */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cutting-edge technology to give you the most realistic interview experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback & Analytics Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Feedback System
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get detailed analysis and actionable insights to improve your interview performance
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Communication Analysis</h3>
                  <p className="text-gray-600">Evaluate clarity, structure, and flow of your responses</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Technical Accuracy</h3>
                  <p className="text-gray-600">Assess depth of understanding and correctness of solutions</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Confidence Scoring</h3>
                  <p className="text-gray-600">Measure assertiveness and conviction in your delivery</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                  <p className="text-gray-600">Monitor improvement trends across multiple sessions</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Sample Feedback Report</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Communication</span>
                    <span className="font-semibold">8.5/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Technical Clarity</span>
                    <span className="font-semibold">7.2/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Confidence</span>
                    <span className="font-semibold">6.8/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h5 className="font-semibold text-yellow-800 mb-2">💡 Key Improvements</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Structure answers with clear examples</li>
                  <li>• Speak with more authority and confidence</li>
                  <li>• Quantify achievements when possible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful candidates who have improved their interview skills with our AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
              <PlayCircle className="w-5 h-5" />
              Start Free Practice
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center gap-2">
              <Brain className="w-5 h-5" />
              View Features
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}