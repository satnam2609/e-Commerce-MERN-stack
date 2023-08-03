// const user = require("../models/user");
const User = require("../models/user");

exports.createOrUpdateUser = async (req, res) => {
  const { name, picture, email } = req.user;

  const user = await User.findOneAndUpdate(
    { email: email },
    {
      name: email.split("@")[0],
      picture,
    },
    {
      new: true,
    }
  );

  if (user) {
    console.log("User updated", user);
    res.json(user);
  } else {
    const newUser = await User.create({
      name: email.split("@")[0],
      email,
      picture,
    });
    console.log("User created", newUser);
    res.json(newUser);
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
};
