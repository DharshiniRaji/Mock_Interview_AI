"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import moment from "moment";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({
    jobPosition: "",
    jobDesc: "",
    jobExperience: "",
  });

  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);

  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience);
    const InputPrompt =
      "Job Position: " +
      jobPosition +
      "Job Description:" +
      jobDesc +
      "YearsOfExperience:" +
      jobExperience +
      ",Depends on this information please give me" +
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
      "Interview question with Answered in json Format, GiveQuestion and Answered as field in JSON";

    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResponse = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/\*\*Note\:\*\*(.|\n)*/, "")
      .trim();

    console.log("MockJsonResponse", MockJsonResponse);

    setJsonResponse(MockJsonResponse);

    if (!MockJsonResponse) {
      alert("Please Try Again");
      setLoading(false);
      return;
    }

    const resp = await db
      .insert(MockInterview)
      .values({
        mockId: uuidv4(),
        jsonMockResp: MockJsonResponse,
        jobPosition: jobPosition,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      })
      .returning({
        mockId: MockInterview.mockId,
      });

    console.log("inserted id:", resp);
    setForm({
      jobPosition: "",
      jobDesc: "",
      jobExperience: "",
    });
    setOpenDialog(false);
    router.push(`/dashboard/interview/${resp[0]?.mockId}`);
    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 border-2 border-dashed rounded-xl bg-white hover:bg-gray-100 hover:shadow-lg transition-all text-center cursor-pointer"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-medium text-gray-700">+ Add New Interview</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Plan Your Mock Interview
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Fill in the job role, tech stack, and experience to get
              AI-generated interview questions.
            </DialogDescription>
            <form onSubmit={onSubmit} className="space-y-6 mt-6">
              <div>
                <label className="block mb-2 font-medium">Job Role</label>
                <Input
                  placeholder="e.g., Frontend Developer"
                  onChange={(e) => setJobPosition(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Tech Stack</label>
                <Textarea
                  placeholder="e.g., React, TypeScript, TailwindCSS"
                  onChange={(e) => setJobDesc(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  Years of Experience
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 2"
                  max="50"
                  onChange={(e) => setJobExperience(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                      Generating...
                    </>
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
