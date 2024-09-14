import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import useFetch from "@/hooks/use-fetch";
import { createNewCompany } from "@/api/apiCompanies";
import { SyncLoader } from "react-spinners";
import { useEffect } from "react";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      { message: "Only images are allowed" }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const {
    fn: fnCreateNewCompany,
    error: errorCreateNewCompany,
    data: dataNewCompany,
    loading: loadingCreateNewCompany,
  } = useFetch(createNewCompany);

  const onSubmit = (data) => {
    fnCreateNewCompany({
        ...data,
        logo: data.logo[0],
    })
  };
  useEffect(() => {
   if(dataNewCompany?.length > 0 ) fetchCompanies();
  }, [loadingCreateNewCompany])
  
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Add Company</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add New Company</DrawerTitle>
        </DrawerHeader>
        <form className="flex gap-1 p-0 pr-4 pl-4">
          <Input
            type="text"
            placeholder="Company Name"
            {...register("name")}
            className="flex-1"
          />
          <Input
            type="file"
            accept="image/*"
            placeholder="Company logo"
            {...register("logo")}
            className="flex-1 file:text-gray-500"
          />
          <Button
            type="button"
            className="w-40"
            variant="destructive"
            onClick={handleSubmit(onSubmit)}
          >
            {" "}
            Add{" "}
          </Button>
        </form>
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
        {errorCreateNewCompany?.message && <p className="text-red-500">{errorCreateNewCompany?.message}</p>}
        {loadingCreateNewCompany && <SyncLoader color="#36d7b7" />}
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;
