const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db-connection");

const donations = sequelize.define("donations", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
  },
  charityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
  
});



module.exports = {
  donations,
};
