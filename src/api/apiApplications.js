import supabaseClient, { supabaseUrl } from "@/utils/suberbase";

export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const randomData = Math.floor(Math.random() * 90000);
  const fileName = `resume-${randomData}-${jobData.candidate_id}`;

  const { error: resumeError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);
  if (resumeError) {
    console.error(`Error while uploading the resume ... ${resumeError}`);
    return null;
  }

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  let query = supabase
    .from("application")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select();

  const { data, error } = await query;
  if (error) {
    console.error(`Error appling the job ${error}`);
    return null;
  }
  return data;
}

export async function updateApplicationStatus(token, { job_id }, status) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("application")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  console.log(data);

  if (error || data.length === 0) {
    console.error(`Error updating applications 5 stauts ... ${error}`);
    return null;
  }
  return data;
}
export async function getMyApplication(token, { user_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("application")
    .select("*,job:jobs(title,company:companies(name))")
    .eq("candidate_id", user_id);

  console.log(data);

  if (error) {
    console.error(`Error fetching my applications ... ${error}`);
    return null;
  }
  return data;
}
