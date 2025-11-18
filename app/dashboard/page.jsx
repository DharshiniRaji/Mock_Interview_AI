import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";

const Dashboard = () => {
  return (
    <div className="p-6 md:p-8 mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
      <p className="text-gray-500 mb-6 text-sm">
        Create and start your AI-powered mock interviews.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <AddNewInterview />
      </div>

      <section>
        <InterviewList />
      </section>
    </div>
  );
};

export default Dashboard;
