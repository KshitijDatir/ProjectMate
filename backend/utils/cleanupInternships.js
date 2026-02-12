const cron = require("node-cron");
const Internship = require("../models/Internship");

const cleanupExpiredInternships = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await Internship.deleteMany({
        deadline: { $lt: new Date() },
      });

      console.log(
        `[CRON] Deleted expired internships: ${result.deletedCount}`
      );
    } catch (error) {
      console.error("[CRON] Internship cleanup error:", error);
    }
  });
};

module.exports = cleanupExpiredInternships;
