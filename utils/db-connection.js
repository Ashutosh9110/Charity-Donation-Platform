const { Sequelize } = require("sequelize");


const sequelize = new Sequelize("charity_donation_platform", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
  logging: false
})


const connectDb = async () => {
  try {
    await sequelize.authenticate()
  console.log("Connection has been established");
  } catch (error) {
    console.log("Unable to make a connection", error.message);
  }
}

module.exports = {
  sequelize,
  connectDb
}