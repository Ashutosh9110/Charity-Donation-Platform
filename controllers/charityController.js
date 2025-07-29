const charityModel = require("../dbModels/charityModel");




const registerCharity = async (req, res) => {
  try {
    const { name, mission, goals, projects, category } = req.body;

    // Check if required fields are present
    if (!name || !category) {
      return res.status(400).json({ message: "Name and category are required." });
    }

    const charity = await charityModel.create({
      name,
      mission,
      goals,
      projects,
      category,
    });

    res.status(201).json({ message: "Charity registered successfully!", charity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering charity." });
  }
};



const getAllCharities = async (req, res) => {
  try {
    const charities = await charityModel.findAll();
    res.json({ charities });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch charities" });
  }
}

const getCharityById = async (req, res) => {
  try {
    const charity = await charityModel.findByPk(req.params.id);
    if (!charity) return res.status(404).json({ message: "Charity not found" });
    res.json({ charity });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch charity" });
  }
}


const getCharitiesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const charities = await charityModel.findAll({ where: { category } });
    res.status(200).json({ charities });
  } catch (err) {
    console.error("Error fetching charities by category:", err);
    res.status(500).json({ error: "Failed to fetch charities by category" });  }
};


module.exports = {
  registerCharity,
  getAllCharities,
  getCharityById,
  getCharitiesByCategory
  
};



