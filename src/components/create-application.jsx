import { getMyApplication } from "@/api/apiApplications";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import ApplicationElement from "./application-element";

const CreatedApplication = () => {
  const { user, isLoaded } = useUser();
  const {
    fn: fnGetMyApplication,
    data: myApplication,
    loading: loadingGetMyApplication,
  } = useFetch(getMyApplication, { user_id: user?.id });

  useEffect(() => {
    fnGetMyApplication();
  }, [isLoaded]);

  if (!isLoaded || loadingGetMyApplication) {
    return <BarLoader className="mb-4" color="#36d7b7" width={"100%"} />;
  }
  return (
    <div className="flex flex-col gap-4">
      {myApplication?.map((application) => (
        <ApplicationElement
          key={application.id}
          application={application}
          isCandidate={true}
        />
      ))}
    </div>
  );
};

export default CreatedApplication;
