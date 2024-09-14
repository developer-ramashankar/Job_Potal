import supabaseClient from "@/utils/suberbase";

export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select("*, company:companies(name,logo_url)");

  if (location) {
    query = query.eq("location", location);
  }
  if (company_id) {
    query = query.eq("company_id", company_id);
  }
  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }
  const { data, error } = await query;
  if (error) {
    console.error(`Error fetching jobs ... ${error}`);
    return null;
  }
  return data;
}
export async function savedJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);
  console.log(saveData);
  console.log(alreadySaved);
  if (alreadySaved) {
    const { data, error: deleteError } = supabase
      .from("saved_job")
      .delete()
      .eq("job_id", saveData?.job_id);
    console.log(data);

    if (deleteError || data.length === 0 || undefined) {
      console.error(`Error while unsave the jobs ... ${deleteError}`);
      return null;
    }
    return data;
  } else {
    const { data, error: insertError } = supabase
      .from("saved_job")
      .insert([saveData])
      .select();

    if (insertError || data.length === 0) {
      console.error(`Error while saving the jobs ... ${insertError}`);
      return null;
    }
    console.log(data.job_id);
    return data;
  }
}

export async function getJobSingle(token, { job_id }) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select("*, company:companies(name,logo_url),application:application(*)")
    .eq("id", job_id)
    .single();

  const { data, error } = await query;
  if (error) {
    console.error(`Error fetching single Job Page ... ${error}`);
    return null;
  }
  return data;
}
export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  const { data, error } = await query;
  if (error) {
    console.error(`Error updating  Job Page ... ${error}`);
    return null;
  }
  return data;
}
export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  let query = supabase.from("jobs").insert([jobData]).select();

  const { data, error } = await query;
  if (error) {
    console.error(`Error creating new Jobs ... ${error}`);
    return null;
  }
  return data;
}
export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("saved_job")
    .select("*,job:jobs(*,company:companies(name,logo_url))");

  const { data, error } = await query;
  if (error) {
    console.error(`Error fetching saved jobs... ${error}`);
    return null;
  }
  return data;
}
export async function getCreatedJobs(token, { requiter_id }) {
  const supabase = await supabaseClient(token);

  let query = supabase
    .from("jobs")
    .select("*,company:companies(name,logo_url)")
    .eq("recruiter_id", requiter_id);

  const { data, error } = await query;
  if (error) {
    console.error(`Error fetching my jobs... ${error}`);
    return null;
  }
  return data;
}
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  let query = supabase.from("jobs").delete().eq("id", job_id).select();

  const { data, error } = await query;
  if (error) {
    console.error(`Error deleting my jobs... ${error}`);
    return null;
  }
  return data;
}
