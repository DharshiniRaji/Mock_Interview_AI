// utils/resumeParser.js - Utility functions for parsing resumes
import { chatSession } from "./GeminiAIModel";

/**
 * Parse PDF file and extract text content
 * Note: In production, use a proper PDF parsing library like pdf-parse or pdf2pic
 */
export const parsePDFContent = async (file) => {
  try {
    // For now, we'll simulate PDF parsing
    // In production, integrate with pdf-parse or similar library
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        // Simulate text extraction - replace with actual PDF parsing
        const simulatedText = `
          John Doe
          Software Developer
          Email: john.doe@email.com
          Phone: +1234567890
          
          PROJECTS:
          E-commerce Platform
          - Built full-stack e-commerce platform using React, Node.js, MongoDB
          - Implemented payment gateway integration with Stripe
          - Added real-time chat support using Socket.io
          - Technologies: React, Node.js, MongoDB, Express, Socket.io
          
          Task Management App
          - Developed task management application with real-time updates
          - Created responsive UI using Vue.js and Vuetify
          - Integrated Firebase for backend services
          - Technologies: Vue.js, Firebase, Vuetify
          
          INTERNSHIPS:
          Tech Solutions Inc - Frontend Developer Intern (6 months)
          - Developed responsive web applications using React and TypeScript
          - Collaborated with design team to implement UI/UX improvements
          - Participated in code reviews and agile development process
          
          CERTIFICATIONS:
          - AWS Cloud Practitioner
          - Google Analytics Certified
          - MongoDB Developer Certification
          
          ACHIEVEMENTS:
          - Winner of College Hackathon 2023
          - Published research paper on AI in Healthcare
          - Led team of 5 developers in capstone project
          
          TECHNICAL SKILLS:
          Programming Languages: JavaScript, Python, Java, C++
          Frontend: React, Vue.js, Angular, HTML5, CSS3, TypeScript
          Backend: Node.js, Express, Django, Spring Boot
          Databases: MongoDB, PostgreSQL, MySQL
          Cloud: AWS, Firebase, Google Cloud
          Tools: Git, Docker, Jenkins, VS Code
        `;
        resolve(simulatedText);
      };
      reader.readAsText(file);
    });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse PDF content");
  }
};

/**
 * Extract structured data from raw resume text using AI
 */
export const extractResumeData = async (rawText) => {
  try {
    const prompt = `
      Analyze the following resume text and extract structured information in JSON format.
      
      Resume Text:
      ${rawText}
      
      Please extract and return a JSON object with the following structure:
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
        "internships": [
          {
            "company": "Company Name",
            "role": "Position Title",
            "duration": "time period",
            "responsibilities": "main responsibilities",
            "techUsed": ["tech1", "tech2"]
          }
        ],
        "experience": [
          {
            "company": "Company Name",
            "role": "Position Title",
            "duration": "time period",
            "responsibilities": "main responsibilities"
          }
        ],
        "education": [
          {
            "institution": "University/College Name",
            "degree": "Degree Type",
            "field": "Field of Study",
            "year": "graduation year",
            "gpa": "if mentioned"
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
      
      Make sure to extract all relevant information and categorize it properly.
      Return only the JSON object, no additional text.
    `;

    const result = await chatSession.sendMessage(prompt);
    const response = result.response.text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(response);
  } catch (error) {
    console.error("Error extracting resume data:", error);
    throw new Error("Failed to extract structured data from resume");
  }
};

/**
 * Generate context-specific interview questions
 */
export const generateContextQuestions = async (selectedItem, itemType) => {
  try {
    const itemContext = itemType === 'project' ? 'project' : 'internship/experience';
    
    const prompt = `
      Based on this ${itemContext}: ${JSON.stringify(selectedItem)}
      
      Generate 5 interview questions that test:
      1. Technical understanding of the tech stack used
      2. Problem-solving approach and challenges faced
      3. Impact and results achieved
      4. Design decisions and trade-offs
      5. Lessons learned and future improvements
      
      For each question, also provide:
      - A suggested approach for answering
      - Key points the candidate should cover
      - What the interviewer is looking for
      
      Return as JSON array with this structure:
      [
        {
          "question": "The interview question",
          "suggestedApproach": "How to approach this question",
          "keyPoints": ["point1", "point2", "point3"],
          "interviewerLookingFor": "What the interviewer wants to assess"
        }
      ]
      
      Make questions specific to the technologies and context mentioned.
      Return only the JSON array, no additional text.
    `;

    const result = await chatSession.sendMessage(prompt);
    const response = result.response.text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(response);
  } catch (error) {
    console.error("Error generating context questions:", error);
    throw new Error("Failed to generate context-specific questions");
  }
};

/**
 * Generate overall resume-based questions
 */
export const generateOverallQuestions = async (resumeData) => {
  try {
    const prompt = `
      Based on this complete resume: ${JSON.stringify(resumeData)}
      
      Generate 5 comprehensive interview questions that cover:
      1. Career journey and motivations
      2. Technical skills alignment with job roles
      3. Leadership and teamwork experiences
      4. Problem-solving and adaptability
      5. Future goals and growth mindset
      
      For each question, provide:
      - A suggested approach for answering
      - Key points to cover
      - What interviewers typically look for
      
      Return as JSON array with this structure:
      [
        {
          "question": "The interview question",
          "suggestedApproach": "How to approach this question",
          "keyPoints": ["point1", "point2", "point3"],
          "interviewerLookingFor": "What the interviewer wants to assess"
        }
      ]
      
      Make questions relevant to the candidate's background and experience level.
      Return only the JSON array, no additional text.
    `;

    const result = await chatSession.sendMessage(prompt);
    const response = result.response.text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(response);
  } catch (error) {
    console.error("Error generating overall questions:", error);
    throw new Error("Failed to generate overall resume questions");
  }
};

/**
 * Evaluate user's answer using AI
 */
export const evaluateAnswer = async (question, userAnswer, resumeContext = null) => {
  try {
    const contextInfo = resumeContext ? `Resume Context: ${JSON.stringify(resumeContext)}` : '';
    
    const prompt = `
      ${contextInfo}
      
      Question: ${question}
      User Answer: ${userAnswer}
      
      Evaluate this answer on a scale of 1-10 for:
      1. Communication (clarity, structure, flow, articulation)
      2. Technical Clarity (accuracy, depth of understanding, use of proper terminology)
      3. Confidence (assertiveness, conviction, enthusiasm)
      
      Also provide:
      - Specific suggestions for improvement
      - What was done well
      - How to better approach this question
      - Missing key points that should have been covered
      
      Return as JSON with this structure:
      {
        "scores": {
          "communication": 8,
          "technical": 7,
          "confidence": 6
        },
        "overallScore": 7,
        "strengths": ["What was done well"],
        "suggestions": ["Specific improvement suggestions"],
        "approach": "Better way to approach this question",
        "missingPoints": ["Key points not covered"]
      }
      
      Be constructive and specific in feedback.
      Return only the JSON object, no additional text.
    `;

    const result = await chatSession.sendMessage(prompt);
    const response = result.response.text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(response);
  } catch (error) {
    console.error("Error evaluating answer:", error);
    throw new Error("Failed to evaluate the answer");
  }
};

/**
 * Validate resume data structure
 */
export const validateResumeData = (data) => {
  const required = ['personalInfo', 'projects', 'techStack'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  return true;
};

/**
 * Generate interview summary and analytics
 */
export const generateInterviewSummary = async (questions, answers, evaluations) => {
  try {
    const prompt = `
      Generate a comprehensive interview summary based on:
      
      Questions Asked: ${JSON.stringify(questions)}
      User Answers: ${JSON.stringify(answers)}
      Evaluations: ${JSON.stringify(evaluations)}
      
      Provide:
      1. Overall performance summary
      2. Strengths identified
      3. Areas for improvement
      4. Specific recommendations for growth
      5. Interview readiness level (1-10)
      6. Next steps for preparation
      
      Return as JSON:
      {
        "overallPerformance": "summary text",
        "readinessLevel": 7,
        "strengths": ["strength1", "strength2"],
        "improvementAreas": ["area1", "area2"],
        "recommendations": ["rec1", "rec2"],
        "nextSteps": ["step1", "step2"]
      }
    `;

    const result = await chatSession.sendMessage(prompt);
    const response = result.response.text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(response);
  } catch (error) {
    console.error("Error generating summary:", error);
    throw new Error("Failed to generate interview summary");
  }
};