import React,{ useState }  from 'react'
import {Link,useNavigate} from 'react-router-dom';
import axios from "axios";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import toast from 'react-hot-toast';


function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const register=async()=>{
    try {
      dispatch(ShowLoading());
      const response = await axios.post("/api/users/register", user);
      dispatch(HideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      dispatch(HideLoading());
      console.log(error);
    }
    // console.log(user);
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-5 w-96 p-5  ">
        <h1 className="text-3xl font-bold text-white">Welcome to Melobeats</h1>
        <h1 />
        <input
          type="text"
          placeholder="Name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <button className="primary bg-secondary" onClick={register}>
          Register
        </button>
        <Link to="/login" className="text-active underline">
          Already Registered ? Click Here To Login
        </Link>
      </div>
      <div>
          <img
            className="h-[500px]"
            src="https://o.remove.bg/downloads/64e71fe9-fa75-470c-8f39-087e41ddf694/Untitled_design__3_-removebg-preview.png"
            alt=""
          />
        </div> 
    </div>
    
  )
}

export default Register;
