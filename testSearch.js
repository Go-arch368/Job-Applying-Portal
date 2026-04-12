import db from './Config/db.js';
import Job from './App/Models/jobmodel.js';

async function run() {
  await db();
  const jobs = await Job.find({ jobtitle: { $regex: 'Mean developer', $options: 'i' } });
  console.log("Found:", jobs.length);
  const all = await Job.find().select('jobtitle deadline recruiterId').populate({ path: 'recruiterId', select: 'subscriptionPlan' });
  console.log("All jobs:", JSON.stringify(all, null, 2));

  // let's simulate the exact route logic
  let query = { jobtitle: { $regex: 'Mean developer', $options: 'i' } };
  const filtering = await Job.find(query).populate({ path: 'recruiterId', select: 'subscriptionPlan ' });
  console.log("Filtering length:", filtering.length);
  
  const filteredJobs = filtering.filter((ele) => {
      if (!ele.deadline) return true; 
      const deadlineDate = new Date(ele.deadline);
      if (isNaN(deadlineDate.getTime())) return true; 
      return deadlineDate >= new Date();
  });
  console.log("After deadline filter:", filteredJobs.length);
  process.exit(0);
}
run();
