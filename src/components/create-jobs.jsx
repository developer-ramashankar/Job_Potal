import { getCreatedJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";
import JobElement from "./Job-Element";

const CreatedJobs = () => {
  const { user, isLoaded } = useUser();
  const {
    fn: fnGetmyJobs,
    data: myJobs,
    loading: loadingGetmyJobs,
  } = useFetch(getCreatedJobs, { requiter_id: user?.id });

  useEffect(() => {
    fnGetmyJobs();
  }, []);

  if (!isLoaded || loadingGetmyJobs) {
    return <BarLoader className="mb-4" color="#36d7b7" width={"100%"} />;
  }
  return (
    <div>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myJobs?.length ? (
          myJobs.map((job) => {
            return (
              <JobElement
                key={job.id}
                job={job}
                onJobSaved={fnGetmyJobs}
                isMyJob
              />
            );
          })
        ) : (
          <div>No Jobs Found 😥</div>
        )}
      </div>
    </div>
  );
};

export default CreatedJobs;
