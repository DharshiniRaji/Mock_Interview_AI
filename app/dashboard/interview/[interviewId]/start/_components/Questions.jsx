import { Lightbulb, Volume2 } from "lucide-react";

const Questions = ({ mockInterviewQns, activeQnIndex }) => {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, your browser does not support text to speech!");
    }
  };

  return (
    mockInterviewQns && (
      <div className="p-5 border rounded-lg my-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {mockInterviewQns &&
            mockInterviewQns.map((qn, index) => (
              <h2
                key={index}
                className={`p-2  rounded-full text-xs md:text-sm text-center cursor-pointer ${
                  activeQnIndex === index
                    ? "bg-primary text-white"
                    : "bg-secondary"
                }`}
              >
                Question #{index + 1}
              </h2>
            ))}
        </div>
        <h2 className="my-5 md:text-lg">
          {mockInterviewQns[activeQnIndex]?.Question}
        </h2>
        <Volume2
          className="cursor-pointer text-green-500"
          onClick={() =>
            textToSpeech(mockInterviewQns[activeQnIndex]?.Question)
          }
        />

        <div className="border rounded-lg p-5 bg-blue-100 mt-20">
          <h2 className="flex gap-2 items-center text-primary">
            <Lightbulb />
            <strong>Note :</strong>
          </h2>
          <h2 className="text-sm text-primary my-2">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
      </div>
    )
  );
};

export default Questions;
