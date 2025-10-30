import app from "./app";
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`☕ coffee_test backend running on port ${PORT}`));
