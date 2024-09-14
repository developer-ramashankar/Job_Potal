import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { State } from "country-state-city";
import useFetch from "@/hooks/use-fetch";
import { getCompanies } from "@/api/apiCompanies";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Navigate, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { addNewJob } from "@/api/apiJobs";
import { CopyPlus } from "lucide-react";
import AddCompanyDrawer from "@/components/add-company";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  company_id: z.string().min(1, { message: "Select or Add Company" }),
  requirements: z.string().min(1, { message: "Requirements is required" }),
});
const PostJobPage = () => {
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies,
  } = useFetch(getCompanies);
  const {
    fn: fnAddNewJob,
    data: dataNewJob,
    error: errorAddNewJob,
    loading: loadingAddNewJob,
  } = useFetch(addNewJob);
  const { isLoaded, user } = useUser();

  useEffect(() => {
    if (isLoaded) fnCompanies();
  }, [isLoaded]);

  useEffect(() => {
    if (dataNewJob?.length > 0) navigate("/jobs");
  }, [loadingAddNewJob]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  });
  const onSubmit = (data) => {
    fnAddNewJob({
      ...data,
      recruiter_id: user.id,
      isOpen: true,
    });
  };
  if (!isLoaded || loadingCompanies)
    return <BarLoader className="mb-4" color="#36d7b7" width={"100%"} />;

  if (user?.unsafeMetadata?.role !== "recruiter") {
    return <Navigate to="/jobs" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        <Input
          type="text"
          placeholder="Job Title"
          {...register("title")}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Textarea {...register("description")} placeholder="Job Description" />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
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
            )}
          />
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select by Company">
                    {field.value
                      ? companies?.find((com) => com.id === Number(field.value))
                          ?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => (
                      <SelectItem key={name} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
         <AddCompanyDrawer fetchCompanies={fnCompanies}/>
        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}
        {errorAddNewJob?.message && (
          <p className="text-red-500">{errorAddNewJob?.message}</p>
        )}
        {loadingAddNewJob && <BarLoader color="#36d7b7" width={"100%"} />}
        <Button type="submit" size="lg" className="mt-2" variant="blue">
          Post Job
        </Button>
      </form>
    </div>
  );
};

export default PostJobPage;
