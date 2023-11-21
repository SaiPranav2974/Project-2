import React,{ useState }  from 'react'
import {Link,useNavigate} from 'react-router-dom';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { ShowLoading,HideLoading } from '../redux/alertsSlice';
import toast from "react-hot-toast";
function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [user, setUser] = useState({
      email: "",
      password: "",
    });
    const login=async()=>{
      try {
        dispatch(ShowLoading());
        const response = await axios.post("/api/users/login", user);
        dispatch(HideLoading());
        if (response.data.success) {
          toast.success(response.data.message);
          localStorage.setItem("token", response.data.data);
          navigate("/");
        } else {
          toast.error(response.data.message);
          // alert(response.data.message);
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
        { <div>
          <img
            className="h-[500px]"
            src="https://o.remove.bg/downloads/64e71fe9-fa75-470c-8f39-087e41ddf694/Untitled_design__3_-removebg-preview.png"
            alt=""
          />
        </div> }
        <div className="flex flex-col gap-5 w-96 p-5  ">
          <h1 className="text-3xl font-bold text-white">Welcome to login Page </h1>
          <hr />
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
          <button className="primary bg-secondary" onClick={login}>
            Login
          </button>
          <Link to="/register" className="text-active underline">
            Not yet Registered ?Click Here
          </Link>
        </div>
      </div>
      
    )
  }
  
  export default Login;
  