require("dotenv").config()
const express = require("express")
const path = require("path")
const { sequelize } = require("./utils/db-connection")
const userRoutes = require("./routes/userRoutes")
const donationRoutes = require("./routes/donationRoutes")
const charityRoutes = require("./routes/charityRoutes")


const app = express()

app.use(express.json())
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"));

app.use("/users", userRoutes)
app.use("/donations", donationRoutes)
app.use("/charities", charityRoutes)

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "success.html")); // Adjust path if needed
});

sequelize.sync({alter:true}).then(() => {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
