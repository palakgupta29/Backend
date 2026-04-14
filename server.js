const express = require ("express");
const dotenv = require ("dotenv");
const cors = require ("cors");
const  connectDB = require ("./config/db");
const authRoutes = require('./routes/authRoutes');

dotenv.config ();
connectDB();

const app = express ();
app .use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.send("API is runing.......");

});

app.use("/api/auth",authRoutes);
const PORT = process.env.PORT || 5001;

app.listen (PORT, ()=> {
    console.log(`server started at http://localhost:${PORT}`);
});