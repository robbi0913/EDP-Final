const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    res.json({ success: true, data: await User.all() });
  } catch (er) {
    res.status(500).json({ success: false, error: er.message})
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.find(req.params.id);
    if(!user) {
      return res.status(404).json({success: false, error: "User not found"});
    }
    res.json({ success: true, data: user });
  } catch (er) {
    res.status(500).json({ success: false, error: er.message})
  }
}

exports.createUser = async (req, res) => {
  try {
    const { fld_firstname, fld_lastname, fld_email } = req.body;
    if (!fld_firstname || !fld_lastname || !fld_email) {
      return res.status(400).json({ success: false, error: "Required fields should not be empty"})
    }
    const id = await User.create(req.body);
    res.status(201).json({ success: true, data: await User.find(id)});
  } catch (er) {
    res.status(500).json({ success: false, error: er.message})
  }
}

exports.updateUser = async (req, res) => {
  try {
    const affected = await User.update(req.params.id, req.body);
    if (affected===null) {
      return res.status(400).json({ success: false, error: "No valid fields to update"})
    }
    if (!affected) {
      return res.status(404).json({ success: false, error: "User not found"})
    }
    res.status(201).json({ success: true, data: await User.find(req.params.id)});
  } catch (er) {
    res.status(500).json({ success: false, error: er.message})
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const affected = await User.remove(req.params.id);
    if (!affected) {
      return res.status(404).json({ success: false, error: "User not found"})
    }
    res.status(200).json({ success: true, message: "User deleted"});
  } catch (er) {
    res.status(500).json({ success: false, error: er.message})
  }
}
