// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updateCaptainProfile } from "../../redux/slice/authSlice";

// const EditCaptainProfile = ({ onClose }) => {
//   const dispatch = useDispatch();
//   const captain = useSelector((state) => state.auth.captain);

//   const [formData, setFormData] = useState({
//     firstname: captain.firstname,
//     lastname: captain.lastname,
//     address: captain.address,
//     profileImage: null, // for image upload
//     vehicle: captain.vehicle,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (files && files[0]) {
//       setFormData({ ...formData, [name]: files[0] });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Dispatch the action to update profile
//     const data = new FormData();
//     Object.keys(formData).forEach((key) => {
//       data.append(key, formData[key]);
//     });
//     dispatch(updateCaptainProfile(data));
//     onClose(); // Close the modal or edit form
//   };

//   return (
//     <div className="edit-form-container">
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>First Name:</label>
//           <input
//             type="text"
//             name="firstname"
//             value={formData.firstname}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Last Name:</label>
//           <input
//             type="text"
//             name="lastname"
//             value={formData.lastname}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Address:</label>
//           <input
//             type="text"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <label>Profile Image:</label>
//           <input type="file" name="profileImage" onChange={handleFileChange} />
//         </div>
//         <div>
//           <label>Vehicle Type:</label>
//           <input
//             type="text"
//             name="vehicle.vehicleType"
//             value={formData.vehicle.vehicleType}
//             onChange={handleChange}
//           />
//         </div>
//         <div>
//           <button type="submit">Save Changes</button>
//         </div>
//       </form>
//       <button onClick={onClose}>Cancel</button>
//     </div>
//   );
// };

// export default EditCaptainProfile;
