import db from './Config/db.js';
import Job from './App/Models/jobmodel.js';

async function run() {
  await db();
  const rx = new RegExp('developer', 'i');
  
  const filtering = await Job.find({ jobtitle: rx }).populate({ path: 'recruiterId', select: 'subscriptionPlan ' });
  console.log('DB found:', filtering.length);
  
  const jobs = filtering.filter((ele) => {
      if (!ele.deadline) return true;
      const deadlineDate = new Date(ele.deadline);
      if (isNaN(deadlineDate.getTime())) return true;
      return deadlineDate >= new Date();
  });
  console.log('After deadline filter:', jobs.length);
  
  if (jobs.length === 0 && filtering.length > 0) {
      console.log('Sample dropped deadline:', filtering[0].deadline);
  }
  process.exit(0);
}
run();
