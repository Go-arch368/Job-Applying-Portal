import db from './Config/db.js';
import Job from './App/Models/jobmodel.js';

async function run() {
  try {
    await db();
    const rx = new RegExp('developer', 'i');
    const filtering = await Job.find({ jobtitle: rx }).populate({ path: 'recruiterId', select: 'subscriptionPlan ' });
    console.log('DB found:', filtering.length);
    if(filtering.length > 0) {
      console.log('Sample job:', filtering[0]);
    }
  } catch(e) {
    console.error('ERROR:', e);
  }
  process.exit(0);
}
run();
