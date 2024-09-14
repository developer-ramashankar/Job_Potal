import CreatedApplication from "@/components/create-application";
import CreatedJobs from "@/components/create-jobs";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";

const MyJob = () => {
  const { user, isLoaded } = useUser();
  if (!isLoaded) {
    return <BarLoader className="mb-4" color="#36d7b7" width={"100%"} />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        {user?.unsafeMetadata?.role === "candidate"
          ? "My Application"
          : "My Jobs"}
      </h1>

          {user?.unsafeMetadata?.role === "candidate" ? <CreatedApplication/>:<CreatedJobs/>}
    </div>
  );
};

export default MyJob;
