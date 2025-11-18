// First, install the required package:
// npm install pdfjs-dist

// Add this at the top of your component file, after other imports:
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker (add this after the imports, before the component)
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

// Replace your existing handleFileUpload function with this:
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.type !== "application/pdf") {
    setError("Please upload a PDF file only");
    return;
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    setError("File size should be less than 10MB");
    return;
  }

  setLoading(true);
  setError("");
  setResumeFile(file);

  try {
    // Extract text from PDF
    const extractedText = await extractTextFromPDF(file);
    
    if (!extractedText.trim()) {
      throw new Error("Could not extract text from PDF. The file might be image-based or corrupted.");
    }

    setRawText(extractedText);
    
    // Extract structured data using AI
    const structuredData = await extractResumeData(extractedText);
    
    if (!structuredData.personalInfo && !structuredData.techStack && !structuredData.projects) {
      throw new Error("Could not extract meaningful information from resume");
    }

    setExtractedData(structuredData);
    setActiveTab("review");
    
  } catch (error) {
    console.error("Error processing PDF:", error);
    if (error.message.includes("Could not extract text")) {
      setError("Could not extract text from PDF. Please try the manual input option instead.");
      setActiveTab("manual-input");
    } else {
      setError(error.message || "Failed to process PDF. Please try manual input.");
    }
  } finally {
    setLoading(false);
  }
};

// Add this new function to extract text from PDF:
const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ 
      data: arrayBuffer,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
    }).promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items with proper spacing
      const pageText = textContent.items
        .map(item => {
          // Handle spacing between text items
          if (item.str.trim()) {
            return item.str;
          }
          return '';
        })
        .filter(text => text.length > 0)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    // Clean up the extracted text
    return cleanExtractedText(fullText);
    
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF file');
  }
};

// Add this helper function to clean extracted text:
const cleanExtractedText = (text) => {
  return text
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove multiple line breaks
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Remove leading/trailing whitespace
    .trim()
    // Ensure proper line breaks for sections
    .replace(/([.!?])\s*([A-Z][a-z])/g, '$1\n$2')
    // Fix common PDF extraction issues
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/(\d+)([A-Za-z])/g, '$1 $2');
};

// Update your Upload tab content in the JSX to remove the error message:
<TabsContent value="upload" className="mt-6">
  <Card className="max-w-2xl mx-auto">
    <CardHeader className="text-center">
      <CardTitle className="flex items-center justify-center gap-2">
        <Upload className="h-6 w-6" />
        Upload Your Resume
      </CardTitle>
      <CardDescription>
        Upload your PDF resume to get started with personalized interview preparation
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
          <span>Extracting text from PDF...</span>
        </div>
      )}
      <div className="text-center">
        <Button 
          onClick={() => setActiveTab("manual-input")}
          variant="outline"
          className="mt-4"
        >
          Or paste resume content manually
        </Button>
      </div>
    </CardContent>
  </Card>
</TabsContent>