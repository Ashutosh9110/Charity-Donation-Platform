const path = require("path");
const { donations } = require("../dbModels/donationModel");
const { users } = require("../dbModels/userModel");
const Stripe = require("stripe");
const PDFDocument = require("pdfkit")
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// console.log("Stripe key:", process.env.STRIPE_SECRET_KEY);
const { sendDonationConfirmationEmail } = require("../utils/sendEmail");

const createDonation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount, message, charityId } = req.body;
    const donation = await donations.create({ amount, message, userId, charityId });
    res.status(201).json({ msg: "Donation successful", donation });
  } catch (error) {
    res.status(500).json({ msg: "Unable to create donation" });
  }
};

const getUserDonations = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Fetching donations for userId:", req.user.userId);
    const userDonations = await donations.findAll({ where: { userId } });
    // console.log("Donations found:", userDonations);
    res.json({ donations: userDonations });
  } catch (error) {
    console.error("Donation fetch error:", error);  // ← Add this

    res.status(500).json({ msg: "Failed to fetch donations" });
  }
};

const getAllDonations = async (req, res) => {
  try {
    const allDonations = await donations.findAll({
      include: { model: users, attributes: ["id", "name", "email"] },
    });
    res.json({ donations: allDonations });
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch all donations" });
  }
};


const getDonationsByCharity = async (req, res) => {
  const charityId = req.params.id;
  const charityDonations = await donations.findAll({ where: { charityId } });
  res.json({ donations: charityDonations });
};

const createOrder = async (req, res) => {
  try {
    const { amount, charityId, message } = req.body;
    const userId = req.user.userId;

    const user = await users.findByPk(userId);

    // 1. Create Stripe Customer with name and address
    const customer = await stripe.customers.create({
      name: user.name,
      email: user.email,
      address: {
        line1: "123 Test Street",
        city: "Mumbai",
        postal_code: "400001",
        country: "IN",
      },
    });

    // 2. Create Checkout session using the customer
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "inr",
          product_data: {
            name: "Charity Donation",
            description: message || "Donation to charity",
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: "payment",

      // ✅ Set the customer created above
      customer: customer.id,

      // ✅ Enforce billing address collection
      billing_address_collection: 'required',

      success_url: `http://localhost:3000/donations/success?charityId=${charityId}&amount=${amount}&message=${message}&userId=${userId}`,
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ msg: "Failed to create Stripe session" });
  }
};



const downloadReceipt = async (req, res) => {
  try {
    const userId = req.user.userId;
    const donationId = req.params.id;

    const donation = await donations.findOne({ where: { id: donationId, userId } });

    if (!donation) {
      return res.status(404).json({ msg: "Donation not found." });
    }

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=receipt-${donation.id}.pdf`);

    doc.fontSize(20).text("Charity Donation Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Donation ID: ${donation.id}`);
    doc.text(`Amount: ₹${donation.amount}`);
    doc.text(`Message: ${donation.message || "N/A"}`);
    doc.text(`Date: ${new Date(donation.createdAt).toLocaleString()}`);
    doc.end();

    doc.pipe(res);
  } catch (error) {
    console.error("Download receipt error:", error);
    res.status(500).json({ msg: "Failed to download receipt" });
  }
};


const handleSuccess = async (req, res) => {
  console.log("Inside handleSuccess, about to send email...");

  const { charityId, amount, message, userId } = req.query;

  try {
    const donation = await donations.create({
      amount,
      message,
      userId,
      charityId
    });

    const user = await users.findByPk(userId);
    if (user) {
      await sendDonationConfirmationEmail({
        to: user.email,
        name: user.name,
        amount,
        message
      });
    }

    console.log("Sending email to:", user.email);
    await sendDonationConfirmationEmail({
      to: "adhikari.ashutosh28@gmail.com", // <- hardcoded
      name: user.name,
      amount,
      message
    });

    res.sendFile(path.join(__dirname, "..", "public", "success.html"));
  } catch (error) {
    console.error("Error saving donation:", error);
    res.status(500).send("Failed to record donation.");
  }
};



module.exports = {
  createDonation,
  getUserDonations,
  getAllDonations,
  getDonationsByCharity,
  createOrder,
  downloadReceipt,
  handleSuccess
}
