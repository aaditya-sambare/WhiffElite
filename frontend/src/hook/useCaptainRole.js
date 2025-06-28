// hooks/useCaptainRole.js
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const useCaptainRole = () => {
  const { user } = useSelector((state) => state.auth);
  const [captain, setCaptain] = useState(null);

  useEffect(() => {
    const fetchCaptain = async () => {
      try {
        const res = await axios.get(`/api/captains/user/${user._id}`);
        if (res.data) {
          setCaptain(res.data);
        }
      } catch (err) {
        setCaptain(null); // Not a captain or error
      }
    };

    if (user?._id) {
      fetchCaptain();
    }
  }, [user]);

  return captain;
};

export default useCaptainRole;
