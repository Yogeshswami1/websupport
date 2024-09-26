// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import managerRoutes from "./routes/managerRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import dotenv from "dotenv";
// import bodyParser from "body-parser";
// import contactRoutes from "./routes/contactRoutes.js";
// // import uploadRoutes from "./routes/uploadRouter.js";
// import supportRoutes from "./routes/supportRoutes.js";
// import middleware from "./middleware/authMiddleware.js";

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(bodyParser.json());

// app.use("/test", middleware, (req, res) => {
//   
// });
// app.use("/api/managers", managerRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/contact", contactRoutes);
// // app.use("/api/upload", uploadRoutes);
// const PORT = process.env.PORT || 5000;

// app.use("/faiz", (req, res) => {
//   res.send("fdfdfdsf");
// });

// app.get("/data", middleware, async (req, res) => {
//   const user = req.user;
//   res.json({ user });
// });

// app.use("/api/support", supportRoutes);

// mongoose
//   .connect(process.env.MONGO_URI)

//   .then(() => {
//     

//     app.listen(PORT, () => {
//       
//     });
//   })
//   .catch((error) => {
//     
//   });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import managerRoutes from "./routes/managerRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import contactRoutes from "./routes/contactRoutes.js";
// import uploadRoutes from "./routes/uploadRouter.js";
import supportRoutes from "./routes/supportRoutes.js";
import middleware from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

// Define CORS options
const corsOptions = {
  // origin: "http://localhost:3000", // specify allowed origin (replace with actual URL)

  origin: 'https://websupport.saumiccraft.com', // specify allowed origin (replace with actual URL)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // specify allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // specify allowed headers
  credentials: true, // allow credentials
};

app.use(cors(corsOptions)); // Apply CORS middleware with options
app.use(express.json());
app.use(bodyParser.json());

app.use("/test", middleware, (req, res) => {
  
});
app.use("/api/managers", managerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
// app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;

app.use("/faiz", (req, res) => {
  res.send("fdfdfdsf");
});

app.get("/data", middleware, async (req, res) => {
  const user = req.user;
  res.json({ user });
});

app.use("/api/support", supportRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    

    app.listen(PORT, () => {
      
    });
  })
  .catch((error) => {
    
  });
