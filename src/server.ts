import app from "./app";
import dotenv from 'dotenv';

dotenv.config();

const PORT: Number = Number(process.env.PORT);

// Server setup
app.listen(PORT, () => {
  console.log(
    "The application is listening " + "on port http://localhost:" + PORT
  );
});
