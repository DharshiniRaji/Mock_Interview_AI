import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
        Welcome to <span className="text-blue-600"> AI Interview Mocker</span>
      </h1>
      <p className="text-gray-600 mb-10 max-w-md">
        Practice job interviews with AI, get instant feedback, and improve your
        performance — anytime, anywhere.
      </p>
      <div className="flex gap-4">
        <Link href="/sign-in">
          <Button className="px-6 py-2">Login</Button>
        </Link>
        <Link href="/sign-up">
          <Button variant="outline" className="px-6 py-2">
            Register
          </Button>
        </Link>
      </div>
    </main>
  );
}
