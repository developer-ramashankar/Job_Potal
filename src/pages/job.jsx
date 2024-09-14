import { getJobSingle, updateHiringStatus } from "@/api/apiJobs";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import {
  Briefcase,
  DoorClosed,
  DoorOpen,
  MapPinCheckIcon,
  MapPinIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ApplyJobDrawer from "@/components/apply-job";
import ApplicationElement from "@/components/application-element";

const JobPage = () => {
  const { isLoaded, user } = useUser();

  const { id } = useParams();
  const handleChangeStatus = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnSingleJob());
  };

  const {
    fn: fnSingleJob,
    data: singleJob,
    loading: loadingSingleJob,
  } = useFetch(getJobSingle, { job_id: id });
  const {
    fn: fnHiringStatus,
    data: hiringStatus,
    loading: loadingHiringStatus,
  } = useFetch(updateHiringStatus, { job_id: id });

  useEffect(() => {
    if (isLoaded) fnSingleJob();
  }, [isLoaded]);

  
  if (!isLoaded || loadingSingleJob) {
    return <BarLoader className="mb-4" color="#36d7b7" width={"100%"} />;
  }
  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold text-4xl sm:6xl pb-3">
          {singleJob?.title}
        </h1>
        <img
          src={singleJob?.company?.logo_url}
          className="h-12"
          alt={singleJob?.company?.name}
        />
      </div>
      <div className="flex justify-between ">
        <div className="flex gap-2">
          <MapPinIcon /> {singleJob?.location}
        </div>
        <div className="flex gap-2">
          <Briefcase /> {singleJob?.applications?.length} Applicants
        </div>
        <div className="flex gap-2">
          {singleJob?.isOpen ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>
      {loadingHiringStatus && <BarLoader color="#36d7b7" width={"100%"} />}
      {singleJob?.recruiter_id === user?.id && (
        <Select onValueChange={handleChangeStatus}>
          <SelectTrigger
            className={`w-full ${
              singleJob?.isOpen ? "bg-green-950" : "bg-red-950"
            }`}
          >
            <SelectValue
              placeholder={
                "Hiring Status " +
                (singleJob?.isOpen ? "( Open )" : "( Closed )")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{singleJob?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={singleJob?.requirements}
        className="bg-transparent"
      />
      {/* rendeing application */}
      <div className="w-full flex justify-center items-center">
        {singleJob?.recruiter_id !== user?.id && (
          <ApplyJobDrawer
            job={singleJob}
            user={user}
            fetchJob={fnSingleJob}
            applied={singleJob?.application?.find(
              (app) => app.candidate_id === user?.id
            )}
          />
        )}
      </div>

      {singleJob?.application?.length > 0 &&
        singleJob?.recruiter_id === user?.id && (
          <div className="flex flex-col gap-2 ">
            <h2 className="text-2xl sm:text-3xl font-bold">Application</h2>
            {singleJob?.application?.map((application) => (
              <ApplicationElement
                key={application.id}
                application={application}
              />
            ))}
          </div>
        )}
    </div>
  );
};

export default JobPage;
