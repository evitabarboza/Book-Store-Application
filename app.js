const express = require("express");
const app = express();
require("dotenv").config();
require("./connection/conn");
const user = require("./routes/user");

app.use(express.json());

//routes
app.use("/api/v1", user);

 app.get("/", (req,res) =>{
    res.send("Hello from backend side");
});

//creating port
app.listen(process.env.PORT, () => {
    console.log(`Server Started at port ${process.env.PORT}`);
});