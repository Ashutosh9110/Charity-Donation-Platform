
const { users } = require("./userModel")
const { donations } = require("./donationModel")
const { charityModel } = require("./charityModel")

users.hasMany(donations);
donations.belongsTo(users);



donations.belongsTo(users, { foreignKey: "userId" });
users.hasMany(donations, { foreignKey: "userId" });


donations.belongsTo(charityModel, { foreignKey: "charityId" });
charityModel.hasMany(donations, { foreignKey: "charityId" });
