
import HackathonCalendar from "@/components/HackathonCalendar";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Header />
      <HackathonCalendar />
    </div>
  );
};

export default Index;
