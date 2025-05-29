const userModel = require("../models/user");


module.exports.createUser = async ({firstname,lastname,email,password,contact}) => {
if(!firstname || !email || !password || !contact) {
    throw new Error("All fields are required");
  }

try {
  const user = await userModel.create({
    firstname,
    lastname,
    email,
    password,
    contact,
  });
  return user;
} catch (err) {
  if (err.code === 11000) {
    throw new Error("Email or contact already exists");
  }
  throw err;
}

}
