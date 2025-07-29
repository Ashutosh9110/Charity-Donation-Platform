const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection").sequelize;

const charityModel = sequelize.define("charityModel", {
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.ENUM("urgent", "animal", "children", "elderly", "disaster-relief", "hunger", "education"), allowNull: false },
  mission: { type: DataTypes.TEXT },
  goals: { type: DataTypes.TEXT },
  projects: { type: DataTypes.TEXT },
  imageUrl: { type: DataTypes.STRING }

});


module.exports = charityModel;
