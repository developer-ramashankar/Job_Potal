import { updateApplicationStatus } from "@/api/apiApplications";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import useFetch from "@/hooks/use-fetch";
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import { BarLoader } from "react-spinners";

const ApplicationElement = ({ application, isCandidate = false }) => {
  

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };
  const { fn: fnHiringStatus, loading: loadingHiringStatus } = useFetch(
    updateApplicationStatus,
    { job_id: application?.job_id }
  );
  console.log(application);
  const handleStatusChange = (status) => {
    fnHiringStatus(status).then(() => fnHiringStatus());
  };
  return (
    <Card>
      {loadingHiringStatus && (
        <BarLoader className="mb-4" color="#36d7b7" width={"100%"} />
      )}
      <CardHeader>
        <CardTitle>
          {isCandidate
            ? `${application?.job?.title} at ${application?.job?.company?.name}`
            : application?.name}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={18} />
            {application?.experience} year of experience
          </div>
          <div className="flex gap-2 items-center">
            <School size={18} />
            {application?.education}
          </div>
          <div className="flex gap-2 items-center">
            <Boxes size={18} />
            Skills: {application?.skills}
          </div>
        </div>
        <hr />
      </CardContent>
      <CardFooter className="flex justify-between">
        <span>{new Date(application?.created_at).toLocaleString()}</span>
        {isCandidate ? (
          <span className=" capitalize font-bold">
            Status: {application?.status}
          </span>
        ) : (
          <Select
            onValueChange={handleStatusChange}
            defaultValue={application?.status}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Application Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interviewing">Interviewing</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationElement;
