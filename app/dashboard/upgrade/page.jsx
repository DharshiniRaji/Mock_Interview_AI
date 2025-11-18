"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Upload, FileText, Mic, MicOff, Camera, CameraOff, Send, AlertCircle, List, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";

const ResumeInterviewPlatform = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [resumeFile, setResumeFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedProjectOrInternship, setSelectedProjectOrInternship] = useState("");
  const [questionType, setQuestionType] = useState("context");
  
  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Hint visibility states
  const [showHints, setShowHints] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Recording states
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState("");

  const { user } = useUser();
  const router = useRouter();
  const fileInputRef = useRef();
  const videoRef = useRef();
  const mediaRecorderRef = useRef();
  const recognitionRef = useRef();
  const audioChunksRef = useRef([]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            }
          }

          if (finalTranscript) {
            setUserAnswer(prev => prev + finalTranscript);
            setTranscript(prev => prev + finalTranscript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setError(`Speech recognition error: ${event.error}`);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Reset states when moving to new question
  const resetQuestionStates = () => {
    setUserAnswer("");
    setFeedback(null);
    setTranscript("");
    setShowHints(false);
    setHasSubmitted(false);
    setAudioBlob(null);
    setAudioURL("");
  };

  // Load PDF.js dynamically
  const loadPDFJS = async () => {
    try {
      if (!window.pdfjsLib) {
        return new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve(window.pdfjsLib);
          };
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      return window.pdfjsLib;
    } catch (error) {
      console.error('Failed to load PDF.js:', error);
      throw new Error('PDF library failed to load');
    }
  };

  // Extract text from PDF
  const extractTextFromPDF = async (file) => {
    try {
      console.log('Starting PDF extraction for file:', file.name, 'Size:', file.size);
      
      const pdfjsLib = await loadPDFJS();
      const arrayBuffer = await file.arrayBuffer();
      
      console.log('PDF.js loaded, processing arrayBuffer...');
      
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true,
        verbosity: 0
      });
      
      const pdf = await loadingTask.promise;
      console.log('PDF loaded, pages:', pdf.numPages);
      
      let fullText = '';
      
      for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 10); pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          const pageText = textContent.items
            .filter(item => item.str && item.str.trim())
            .map(item => item.str.trim())
            .join(' ');
          
          if (pageText.trim()) {
            fullText += pageText + '\n\n';
          }
          
          console.log(`Page ${pageNum} extracted, length:`, pageText.length);
        } catch (pageError) {
          console.warn(`Error extracting page ${pageNum}:`, pageError);
        }
      }
      
      if (fullText.trim()) {
        console.log('PDF extraction successful, total length:', fullText.length);
        return cleanExtractedText(fullText);
      }
      
      throw new Error('No text content found in PDF');
      
    } catch (error) {
      console.error('PDF extraction failed:', error);
      throw error;
    }
  };

  // Clean extracted text
  const cleanExtractedText = (text) => {
    return text
      .replace(/\s+/g, ' ')
      .replace(/([.!?])\s+([A-Z])/g, '$1\n$2')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/[^\x20-\x7E\n]/g, '')
      .trim();
  };

  // Extract resume data using AI
  const extractResumeData = async (text) => {
    const prompt = `
      Analyze this resume text and extract structured information in JSON format.
      
      Resume Text:
      ${text}
      
      Extract and return ONLY a JSON object with this structure:
      {
        "personalInfo": {
          "name": "Full Name",
          "email": "email@example.com", 
          "phone": "phone number",
          "location": "city, country"
        },
        "projects": [
          {
            "title": "Project Name",
            "description": "Brief description",
            "techStack": ["tech1", "tech2"],
            "duration": "time period",
            "keyFeatures": ["feature1", "feature2"]
          }
        ],
        "experience": [
          {
            "company": "Company Name",
            "role": "Position Title",
            "duration": "time period", 
            "responsibilities": "main responsibilities",
            "techUsed": ["tech1", "tech2"]
          }
        ],
        "internships": [
          {
            "company": "Company Name",
            "role": "Position Title",
            "duration": "time period",
            "responsibilities": "main responsibilities", 
            "techUsed": ["tech1", "tech2"]
          }
        ],
        "education": [
          {
            "institution": "University Name",
            "degree": "Degree Type",
            "field": "Field of Study",
            "year": "graduation year"
          }
        ],
        "techStack": ["JavaScript", "React", "Node.js"],
        "certifications": ["Certification Name"],
        "achievements": ["Achievement description"],
        "skills": {
          "programming": ["language1", "language2"],
          "frontend": ["framework1", "framework2"],
          "backend": ["framework1", "framework2"],
          "databases": ["db1", "db2"],
          "tools": ["tool1", "tool2"]
        }
      }
      
      Extract ONLY information present in the resume. If a section is empty, use empty array [].
      Return only the JSON object, no additional text.
    `;

    const result = await chatSession.sendMessage(prompt);
    const response = result.response.text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(response);
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size should be less than 10MB");
      return;
    }

    setLoading(true);
    setError("");
    setResumeFile(file);

    try {
      const extractedText = await extractTextFromPDF(file);
      
      if (!extractedText || extractedText.length < 50) {
        throw new Error("Extracted text is too short or empty. This might be an image-based PDF.");
      }

      setRawText(extractedText);
      const structuredData = await extractResumeData(extractedText);
      
      const hasValidData = structuredData.personalInfo || 
                          (structuredData.techStack && structuredData.techStack.length > 0) || 
                          (structuredData.projects && structuredData.projects.length > 0) ||
                          (structuredData.experience && structuredData.experience.length > 0);
      
      if (!hasValidData) {
        throw new Error("Could not extract meaningful information from the resume");
      }

      setExtractedData(structuredData);
      setActiveTab("review");
      
    } catch (error) {
      console.error("Error processing PDF:", error);
      
      if (error.message.includes("image-based") || error.message.includes("No text content")) {
        setError("This PDF appears to be image-based or scanned. Please try converting it to text-based PDF or use manual input.");
      } else if (error.message.includes("PDF library")) {
        setError("PDF processing library failed to load. Please try manual input or refresh the page.");
      } else if (error.message.includes("too short")) {
        setError("Could not extract enough text from PDF. Please try manual input.");
      } else {
        setError(`PDF processing failed: ${error.message}. Please try manual input.`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle manual text input
  const handleManualInput = async () => {
    if (!rawText.trim()) {
      setError("Please paste your resume content");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const structuredData = await extractResumeData(rawText);
      
      const hasValidData = structuredData.personalInfo || 
                          (structuredData.techStack && structuredData.techStack.length > 0) || 
                          (structuredData.projects && structuredData.projects.length > 0) ||
                          (structuredData.experience && structuredData.experience.length > 0);

      if (!hasValidData) {
        throw new Error("Could not extract meaningful information from the text. Please check the format.");
      }

      setExtractedData(structuredData);
      setActiveTab("review");

    } catch (error) {
      console.error("Error processing manual input:", error);
      setError("Failed to process resume content. Please check the format and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate interview questions
  const generateQuestions = async () => {
    if (!extractedData) {
      setError("No resume data available");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let prompt = "";
      
      if (questionType === "context" && selectedProjectOrInternship) {
        const allItems = [
          ...(extractedData.projects || []), 
          ...(extractedData.experience || []), 
          ...(extractedData.internships || [])
        ];
        
        const selectedItem = allItems.find(item => 
          item.title === selectedProjectOrInternship || 
          item.company === selectedProjectOrInternship
        );
        
        if (!selectedItem) {
          throw new Error("Selected project/experience not found");
        }

        prompt = `
          Based on this specific project/experience from resume: ${JSON.stringify(selectedItem)}
          
          Generate exactly 5 interview questions that test:
          1. Technical understanding of technologies used
          2. Problem-solving approach and challenges
          3. Impact and results achieved
          4. Design decisions made
          5. Lessons learned and improvements
          
          Return ONLY a JSON array:
          [
            {
              "question": "Interview question here",
              "suggestedApproach": "How to approach this question",
              "keyPoints": ["point 1", "point 2", "point 3"]
            }
          ]
          
          Make questions specific to the actual technologies mentioned.
        `;
      } else {
        prompt = `
          Based on this complete resume: ${JSON.stringify(extractedData)}
          
          Generate exactly 5 comprehensive interview questions covering:
          1. Career journey and motivations
          2. Technical skills and experience  
          3. Leadership and teamwork
          4. Problem-solving abilities
          5. Future goals and growth
          
          Return ONLY a JSON array:
          [
            {
              "question": "Interview question here", 
              "suggestedApproach": "How to approach this question",
              "keyPoints": ["point 1", "point 2", "point 3"]
            }
          ]
          
          Base questions on actual experience in the resume.
        `;
      }

      const result = await chatSession.sendMessage(prompt);
      const response = result.response.text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      
      const generatedQuestions = JSON.parse(response);
      
      if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error("Failed to generate questions");
      }

      setQuestions(generatedQuestions);
      resetQuestionStates();
      setActiveTab("interview");
      
    } catch (error) {
      console.error("Error generating questions:", error);
      setError("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Speech recognition controls
  const startListening = () => {
    if (recognitionRef.current && speechSupported) {
      setTranscript("");
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      setError("Speech recognition is not supported in your browser");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Camera controls
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false  // Separate audio for recording
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setError("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setIsCameraOn(false);
  };

  // Audio recording controls (fixed)
  const startRecording = async () => {
    try {
      // Stop speech recognition if it's running
      if (isListening) {
        stopListening();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioURL(audioUrl);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setError('Recording error: ' + event.error);
      };

      mediaRecorderRef.current.start(100); // Collect data every 100ms
      setIsRecording(true);
      setError(""); // Clear any previous errors
      
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Could not start recording. Please check microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Submit answer for evaluation
  const submitAnswer = async () => {
    if (!userAnswer.trim()) {
      setError("Please provide an answer");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const currentQuestion = questions[currentQuestionIndex];
      const prompt = `
        Question: ${currentQuestion.question}
        User Answer: ${userAnswer}
        Resume Context: ${JSON.stringify(extractedData)}
        
        Evaluate this answer on a scale of 1-10 for:
        1. Communication (clarity, structure, flow)
        2. Technical Clarity (accuracy, depth)
        3. Confidence (assertiveness, conviction)
        
        Return ONLY this JSON:
        {
          "scores": {
            "communication": 8,
            "technicalClarity": 7,
            "confidence": 6
          },
          "overallScore": 7,
          "strengths": ["What was done well"],
          "suggestions": ["Specific improvements"],
          "missingPoints": ["Important points not covered"]
        }
      `;

      const result = await chatSession.sendMessage(prompt);
      const response = result.response.text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      
      const evaluationResult = JSON.parse(response);
      setFeedback(evaluationResult);
      setHasSubmitted(true);
      setActiveTab("feedback");
      
    } catch (error) {
      console.error("Error evaluating answer:", error);
      setError("Failed to evaluate answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetQuestionStates();
      setActiveTab("interview");
    } else {
      setActiveTab("complete");
    }
  };

  const retryQuestion = () => {
    resetQuestionStates();
    setActiveTab("interview");
  };

  // Jump to specific question
  const jumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    resetQuestionStates();
    setActiveTab("interview");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎯 Resume-Based Interview Preparation
          </h1>
          <p className="text-gray-600 text-lg">
            Upload your resume and get personalized interview questions with AI-powered feedback
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
              {error.includes("PDF") && (
                <div className="mt-2">
                  <Button 
                    onClick={() => setActiveTab("manual-input")}
                    variant="outline"
                    size="sm"
                    className="ml-2"
                  >
                    Try Manual Input
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="upload">📄 Upload</TabsTrigger>
            <TabsTrigger value="manual-input">✍️ Manual</TabsTrigger>
            <TabsTrigger value="review" disabled={!extractedData}>🔍 Review</TabsTrigger>
            <TabsTrigger value="configure" disabled={!extractedData}>⚙️ Configure</TabsTrigger>
            <TabsTrigger value="interview" disabled={questions.length === 0}>🎤 Interview</TabsTrigger>
            <TabsTrigger value="feedback" disabled={!feedback}>📊 Feedback</TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="mt-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Upload className="h-6 w-6" />
                  Upload Your Resume
                </CardTitle>
                <CardDescription>
                  Upload your PDF resume for automatic text extraction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700">
                    {resumeFile ? resumeFile.name : "Click to upload your resume (PDF only)"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Supported format: PDF (Max size: 10MB)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {loading && (
                  <div className="flex items-center justify-center">
                    <LoaderCircle className="animate-spin mr-2 h-6 w-6" />
                    <span>Processing PDF...</span>
                  </div>
                )}
                <div className="text-center">
                  <Button 
                    onClick={() => setActiveTab("manual-input")}
                    variant="outline"
                    className="mt-4"
                  >
                    Or paste resume content manually →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Input Tab */}
          <TabsContent value="manual-input" className="mt-6">
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle>📝 Paste Your Resume Content</CardTitle>
                <CardDescription>
                  Copy and paste your complete resume content here (recommended for best results)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your complete resume content here...

Example format:
John Doe
Software Developer
Email: john@example.com
Phone: +1234567890

PROJECTS:
E-commerce Platform
- Built full-stack platform using React, Node.js, MongoDB
- Technologies: React, Node.js, MongoDB, Express

EXPERIENCE:
ABC Company - Software Developer (2022-2024)
- Developed web applications using React and TypeScript

SKILLS:
JavaScript, React, Node.js, Python, MongoDB, SQL

EDUCATION:
Bachelor of Computer Science, XYZ University (2022)"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="min-h-80"
                />
                <Button 
                  onClick={handleManualInput}
                  disabled={loading || !rawText.trim()}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                      Processing Resume...
                    </>
                  ) : (
                    "Process Resume Content"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review" className="mt-6">
            {extractedData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>👤 Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Name:</strong> {extractedData.personalInfo?.name || "Not found"}</p>
                        <p><strong>Email:</strong> {extractedData.personalInfo?.email || "Not found"}</p>
                        <p><strong>Phone:</strong> {extractedData.personalInfo?.phone || "Not found"}</p>
                        {extractedData.personalInfo?.location && (
                          <p><strong>Location:</strong> {extractedData.personalInfo.location}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>🛠️ Technical Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(extractedData.techStack || []).length > 0 ? (
                          extractedData.techStack.map((tech, index) => (
                            <Badge key={index} variant="default" className="text-sm">{tech}</Badge>
                          ))
                        ) : (
                          <p className="text-gray-500">No technical skills found in resume</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>🚀 Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(extractedData.projects || []).length > 0 ? (
                        extractedData.projects.map((project, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <h3 className="font-semibold">{project.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                            {project.techStack && project.techStack.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {project.techStack.map((tech, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No projects found</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>💼 Experience</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[...(extractedData.experience || []), ...(extractedData.internships || [])].length > 0 ? (
                        [...(extractedData.experience || []), ...(extractedData.internships || [])].map((exp, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <h3 className="font-semibold">{exp.company}</h3>
                            <p className="text-sm font-medium text-blue-600">{exp.role}</p>
                            <p className="text-sm text-gray-600 mt-1">{exp.responsibilities}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No experience found</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <Button onClick={() => setActiveTab("configure")} size="lg">
                    Continue to Configure Interview →
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Configure Tab */}
          <TabsContent value="configure" className="mt-6">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>🎯 Configure Your Interview</CardTitle>
                <CardDescription>
                  Choose the type of questions you want to practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Question Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        questionType === "context" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                      onClick={() => setQuestionType("context")}
                    >
                      <h3 className="font-semibold">🧩 Context-Specific</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Deep dive into a specific project or experience
                      </p>
                    </div>
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        questionType === "overall" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                      onClick={() => setQuestionType("overall")}
                    >
                      <h3 className="font-semibold">🌐 Overall Resume</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        General questions covering your entire profile
                      </p>
                    </div>
                  </div>
                </div>

                {questionType === "context" && (
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Select Project/Experience to Focus On
                    </label>
                    <select 
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      value={selectedProjectOrInternship}
                      onChange={(e) => setSelectedProjectOrInternship(e.target.value)}
                    >
                      <option value="">Choose a project or experience...</option>
                      {(extractedData?.projects || []).map((project, index) => (
                        <option key={`project-${index}`} value={project.title}>
                          📁 {project.title}
                        </option>
                      ))}
                      {(extractedData?.experience || []).map((exp, index) => (
                        <option key={`exp-${index}`} value={exp.company}>
                          💼 {exp.company} - {exp.role}
                        </option>
                      ))}
                      {(extractedData?.internships || []).map((internship, index) => (
                        <option key={`internship-${index}`} value={internship.company}>
                          🎓 {internship.company} - {internship.role}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Button 
                  onClick={generateQuestions} 
                  disabled={loading || (questionType === "context" && !selectedProjectOrInternship)}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                      Generating Questions...
                    </>
                  ) : (
                    "Generate Interview Questions"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interview Tab with Hidden Hints */}
          <TabsContent value="interview" className="mt-6">
            {questions.length > 0 && (
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  
                  {/* Questions Sidebar */}
                  <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <List className="h-5 w-5" />
                          All Questions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {questions.map((q, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              index === currentQuestionIndex
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => jumpToQuestion(index)}
                          >
                            <div className="flex items-start gap-2">
                              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                index === currentQuestionIndex
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {index + 1}
                              </span>
                              <p className="text-sm line-clamp-3">{q.question}</p>
                            </div>
                          </div>
                        ))}
                        
                        <div className="pt-3 border-t">
                          <div className="text-sm text-gray-600 mb-2">Progress</div>
                          <Progress value={(currentQuestionIndex + 1) / questions.length * 100} className="h-2" />
                          <div className="text-xs text-gray-500 mt-1">
                            {currentQuestionIndex + 1} of {questions.length} questions
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Main Interview Content */}
                  <div className="lg:col-span-3">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">
                          Question {currentQuestionIndex + 1}
                        </h2>
                        <Badge variant="secondary" className="text-sm">
                          {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
                        </Badge>
                      </div>
                      
                      <Card className="mb-6">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-4">
                            {questions[currentQuestionIndex]?.question}
                          </h3>
                          
                          {/* Show/Hide Hints Button */}
                          <div className="mb-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowHints(!showHints)}
                              className="flex items-center gap-2"
                            >
                              {showHints ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              {showHints ? "Hide Hints" : "Show Hints"}
                            </Button>
                          </div>

                          {/* Hints - Only show if showHints is true */}
                          {showHints && (
                            <>
                              {questions[currentQuestionIndex]?.suggestedApproach && (
                                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                  <h4 className="font-medium text-blue-800 mb-2">💡 Suggested Approach:</h4>
                                  <p className="text-sm text-blue-700">
                                    {questions[currentQuestionIndex].suggestedApproach}
                                  </p>
                                </div>
                              )}
                              {questions[currentQuestionIndex]?.keyPoints && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                  <h4 className="font-medium text-green-800 mb-2">🔑 Key Points to Cover:</h4>
                                  <ul className="text-sm text-green-700 space-y-1">
                                    {questions[currentQuestionIndex].keyPoints.map((point, index) => (
                                      <li key={index}>• {point}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </>
                          )}
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Video Practice */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              📹 Video Practice
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="relative">
                              <video 
                                ref={videoRef}
                                autoPlay
                                muted
                                className="w-full h-48 bg-gray-900 rounded-lg object-cover"
                              />
                              <div className="flex gap-2 mt-4">
                                <Button
                                  variant={isCameraOn ? "destructive" : "default"}
                                  onClick={isCameraOn ? stopCamera : startCamera}
                                  size="sm"
                                >
                                  {isCameraOn ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                                  {isCameraOn ? "Stop Camera" : "Start Camera"}
                                </Button>
                                <Button
                                  variant={isRecording ? "destructive" : "default"}
                                  onClick={isRecording ? stopRecording : startRecording}
                                  size="sm"
                                  disabled={isListening} // Prevent conflict with speech recognition
                                >
                                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                  {isRecording ? "Stop Recording" : "Record Audio"}
                                </Button>
                              </div>
                              
                              {/* Audio playback */}
                              {audioURL && (
                                <div className="mt-3">
                                  <audio controls className="w-full">
                                    <source src={audioURL} type="audio/wav" />
                                    Your browser does not support audio playback.
                                  </audio>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Answer Section */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              ✍️ Your Answer
                              {speechSupported && (
                                <Button
                                  variant={isListening ? "destructive" : "outline"}
                                  onClick={isListening ? stopListening : startListening}
                                  size="sm"
                                  disabled={isRecording} // Prevent conflict with audio recording
                                >
                                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                  {isListening ? "Stop Listening" : "Voice to Text"}
                                </Button>
                              )}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {isListening && (
                              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                  <span className="text-sm text-red-700 font-medium">Listening... Speak now</span>
                                </div>
                              </div>
                            )}

                            {isRecording && (
                              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                  <span className="text-sm text-green-700 font-medium">Recording audio...</span>
                                </div>
                              </div>
                            )}
                            
                            <Textarea
                              placeholder="Type your answer here or use 'Voice to Text' to speak your response..."
                              value={userAnswer}
                              onChange={(e) => setUserAnswer(e.target.value)}
                              className="min-h-32 mb-4"
                            />
                            
                            {transcript && (
                              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="text-sm text-blue-700">
                                  <strong>Recent speech:</strong> {transcript.slice(-100)}...
                                </div>
                              </div>
                            )}
                            
                            <Button
                              onClick={submitAnswer}
                              disabled={!userAnswer.trim() || loading}
                              className="w-full"
                            >
                              {loading ? (
                                <>
                                  <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                                  Evaluating...
                                </>
                              ) : (
                                <>
                                  <Send className="mr-2 h-4 w-4" />
                                  Submit Answer
                                </>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="mt-6">
            {feedback && (
              <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">📊 Your Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {feedback.scores?.communication || 0}/10
                        </div>
                        <div className="text-sm text-gray-600">Communication</div>
                        <Progress value={(feedback.scores?.communication || 0) * 10} className="mt-2" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {feedback.scores?.technicalClarity || 0}/10
                        </div>
                        <div className="text-sm text-gray-600">Technical Clarity</div>
                        <Progress value={(feedback.scores?.technicalClarity || 0) * 10} className="mt-2" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {feedback.scores?.confidence || 0}/10
                        </div>
                        <div className="text-sm text-gray-600">Confidence</div>
                        <Progress value={(feedback.scores?.confidence || 0) * 10} className="mt-2" />
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-800">
                        Overall: {feedback.overallScore || 0}/10
                      </div>
                    </div>

                    {feedback.strengths && feedback.strengths.length > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-green-800 mb-3">✅ Strengths:</h4>
                        <ul className="space-y-2">
                          {feedback.strengths.map((strength, index) => (
                            <li key={index} className="text-sm text-green-700">• {strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {feedback.suggestions && feedback.suggestions.length > 0 && (
                      <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-yellow-800 mb-3">💡 Suggestions:</h4>
                        <ul className="space-y-2">
                          {feedback.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-yellow-700">• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {feedback.missingPoints && feedback.missingPoints.length > 0 && (
                      <div className="bg-red-50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-red-800 mb-3">❌ Missing Points:</h4>
                        <ul className="space-y-2">
                          {feedback.missingPoints.map((point, index) => (
                            <li key={index} className="text-sm text-red-700">• {point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-4 mt-6">
                      {currentQuestionIndex < questions.length - 1 ? (
                        <Button onClick={nextQuestion} className="flex-1">
                          Next Question →
                        </Button>
                      ) : (
                        <Button onClick={() => setActiveTab("complete")} className="flex-1">
                          Complete Interview
                        </Button>
                      )}
                      <Button variant="outline" onClick={retryQuestion}>
                        Retry Question
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Complete Tab */}
          <TabsContent value="complete" className="mt-6">
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <CardTitle className="text-3xl">🎉 Interview Complete!</CardTitle>
                <CardDescription>
                  Great job completing your resume-based interview practice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg">
                  You've successfully answered all {questions.length} questions based on your resume.
                </div>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => window.location.reload()} 
                    size="lg"
                  >
                    Start New Interview
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push("/dashboard")} 
                    size="lg"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResumeInterviewPlatform;