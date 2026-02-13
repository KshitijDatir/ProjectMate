const cron = require("node-cron");
const Internship = require("../models/Internship");

const cleanupExpiredInternships = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await Internship.updateMany(
        {
          deadline: { $lt: new Date() },
          isDeleted: false,
        },
        {
          isDeleted: true,
        }
      );

      console.log(
        `[CRON] Soft-deleted expired internships: ${result.modifiedCount}`
      );
    } catch (error) {
      console.error("[CRON] Internship cleanup error:", error);
    }
  });
};

module.exports = cleanupExpiredInternships;
