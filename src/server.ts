import app from "./app";
import { startCron } from "./jobs/cron";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`☕ coffee_test backend running on port ${PORT}`);
  startCron();
});