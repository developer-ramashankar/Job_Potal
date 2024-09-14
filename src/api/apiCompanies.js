import supabaseClient, { supabaseUrl } from "@/utils/suberbase";

export async function getCompanies(token) {
  const supabase = await supabaseClient(token);

  let query = supabase.from("companies").select("*");

  const { data, error } = await query;
  if (error) {
    console.error(`Error fetching companies ... ${error}`);
    return null;
  }
  return data;
}
export async function createNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token);

  const randomData = Math.floor(Math.random() * 90000);
  const fileName = `company_logo-${randomData}-${companyData.name}`;

  const { error: storageError } = await supabase.storage
    .from("company-logos")
    .upload(fileName, companyData.logo);
  if (storageError) {
    console.error(`Error while uploading the company logo ... ${storageError}`);
    return null;
  }

  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logos/${fileName}`;

  let query = supabase
    .from("companies")
    .insert([{ name: companyData.name, logo_url }])
    .select();

  const { data, error } = await query;
  if (error) {
    console.error(`Error submit company creation ... ${error}`);
    return null;
  }
  return data;
}
