import { getCompanies } from "@/api/apiCompanies";
import { getJobs } from "@/api/apiJobs";
import JobElement from "@/components/Job-Element";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import { State } from "country-state-city";
import { useEffect, useState } from "react";
import { BarLoader, SyncLoader } from "react-spinners";

const JobListing = () => {
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { isLoaded } = useUser();
  const {
    fn: fnJobs,
    data: Jobs,
    loading: loadingJobs,
  } = useFetch(getJobs, { location, company_id, searchQuery });

  const { fn: fnCompanies, data: companies } = useFetch(getCompanies);
  

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) fnJobs();
  }, [isLoaded, location, company_id, searchQuery]);

  const handleFormSearch = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    const query = formData.get("searchQuery");
    if (query) setSearchQuery(query);
  };
  const handleClearFilter = () => {
    setLocation("");
    setCompany_id("");
    setSearchQuery("");
  };
  if (!isLoaded) {
    return <BarLoader className="mb-4" color="#36d7b7" width={"100%"} />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Latest Jobs
      </h1>

      <form
        onSubmit={handleFormSearch}
        className="flex items-center justify-center gap-3"
      >
        <Input
          type="text"
          placeholder="Search Jobs"
          name="searchQuery"
          className="w-full px-4 flex-1"
        />
        <Button variant="blue" type="submit">
          Search
        </Button>
      </form>

      <div className="mt-4 flex gap-3 flex-col sm:flex-row">
        <Select value={location} onValueChange={(val) => setLocation(val)}>
          <SelectTrigger className="">
            <SelectValue placeholder="Select by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State?.getStatesOfCountry("IN")?.map(({ name }) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select   value={company_id} onValueChange={(val) => setCompany_id(val)}>
          <SelectTrigger className="">
            <SelectValue placeholder="Select by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name,id }) => (
                <SelectItem key={name} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
       <Button variant="destructive" onClick={handleClearFilter}>Clear Filter</Button>
      </div>

      <div className="text-center">
        {loadingJobs && (
          <SyncLoader className="mt-4" color="#36d7b7" width={"100%"} />
        )}
      </div>
      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Jobs?.length ? (
            Jobs.map((job) => {
              return (
                <JobElement
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div>No Jobs Found 😥</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
