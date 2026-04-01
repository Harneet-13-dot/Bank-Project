const userModel = require("../models/user.model");
const accountModel = require("../models/account.model");

// 🔍 get account from username/email
const getUserAccount = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        message: "Query is required"
      });
    }

    // find user
    const user = await userModel.findOne({
      $or: [
        { email: query.toLowerCase() },
        { name: query }
      ]
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // find account
    const account = await accountModel.findOne({
      user: user._id,
      status: "ACTIVE"
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    return res.json({
      accountId: account._id,
      name: user.name
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  getUserAccount
};