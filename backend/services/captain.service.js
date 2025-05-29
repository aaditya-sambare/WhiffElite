const CaptainModel = require("../models/captain"); 

module.exports.createCaptain = async ({
  user,
  firstname,
  lastname,
  email,
  password,
  contact,
  vehicle,
}) => {
  if (
    !user ||
    !firstname ||
    !email ||
    !password ||
    !contact ||
    !vehicle?.color ||
    !vehicle?.plate ||
    !vehicle?.capacity ||
    !vehicle?.vehicleType
  ) {
    throw new Error("All fields are required");
  }

  const captain = await CaptainModel.create({
    user,
    firstname,
    lastname,
    email,
    password,
    contact,
    vehicle,
  });

  return captain;
};
