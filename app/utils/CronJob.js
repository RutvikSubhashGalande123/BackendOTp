const { CronJob } = require("cron");

const scheduleJob = async () => {

};

const startCronJob = () => {
  const job = new CronJob(
    "00 00 00 * * 0-6",
    scheduleJob,
    null,
    true,
    "Asia/Kolkata"
  );

  job.start();
};

module.exports = startCronJob;
