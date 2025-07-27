require("dotenv").config()
const express = require("express")
const path = require("path")
const { sequelize } = require("./utils/db-connection")
const userRoutes = require("./routes/userRoutes")


const app = express()

app.use(express.json())
app.use(express.static("public"))

app.use("/users", userRoutes)


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})



sequelize.sync().then(() => {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});