import React, { useEffect, useRef, useState } from "react";
import { addUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


//main component toh yaha hey
const Register__Login = () => {
  const dispatch = useDispatch();
  const [signUp, setSignUp] = useState(true);
  const [role, setRole] = useState("Client");
  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [showSection, setShowSection] = useState(false);
  const [error, setError] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [OTP, setOTP] = useState("");
  const [otpVerify, setOtpVerify] = useState("");
  const navigate = useNavigate();

  const registerUser = async (userData) => {
    // Check if OTP and verifyOTP are equal
    if (OTP != otpVerify) {
      alert("OTP verification failed");
      return;
    }

    try {
      const response = await fetch(
        "https://zummit-chandan.onrender.com/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();

      dispatch(addUser(data));
      console.log(data);

      //reload kee baad bhi data remain constant
      localStorage.setItem("token", data.token);
      navigate("/booking");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const loginUser = async (loginData) => {
    try {
      const response = await fetch(
        "https://zummit-chandan.onrender.com/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      dispatch(addUser(data));
      navigate("/booking");
      console.log(data);

      //reload kee baad bhi data remain constant
      localStorage.setItem("token", data.token);

      //jaao token leke aao
      const token = response.headers.get("Authorization");
      if (!token) {
        throw new Error("Token not found in response headers");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  //token check karo reload kee baad
  const checkForToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      // Dispatch an action to set the user state with the token
      dispatch(addUser({ token }));
    }
  };

  //re-render kee baad call karo
  useEffect(() => {
    checkForToken();
  }, []);

  const handleClick = () => {
    setSignUp(!signUp);
  };
  const handleClient = () => {
    setRole("Client");
    console.log("Client");
  };
  const handleTherapist = () => {
    setRole("Therapist");
    console.log("Thearipist");
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleReEnterPassword = (e) => {
    setReEnterPassword(e.target.value);
  };

  const handleOtpVerify = (e) => {
    setOtpVerify(e.target.value);
  };

  //OTP send karne ka handler
  const handleSendOtp = (e) => {
    OTPhandler();
    setShowSection(true);
  };

  //OTP Generator
  const OTPhandler = () => {
    const generatedOTP = Math.floor(Math.random() * 9000) + 1000;
    setOTP(generatedOTP);
    setShowOTP(true);
  };

  //OTP ka page ka Handler hey
  const handleSubmission = (e) => {
    //name filed blank hua toh show error set karo
    if (name.trim() === "") {
      setError("Name cannot be empty");
      return;
    }

    //email or number blank hua toh show error set karo
    if (input.trim() === "") {
      setError("Email/phone cannot be empty");
      return;
    }
    //Passowrd AUTHORIZE KARO
    if (!signUp && password !== reEnterPassword) {
      setError("password didn't match !! reEnter ");
      return;
    }

    //navigate karo
    if (!signUp) {
      handleSendOtp();
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (input.trim() === "") {
      setError("Input cannot be empty");
      return;
    }
    if (!signUp && password !== reEnterPassword) {
      setError("password didn't match !! reEnter ");
      return;
    }

    const userData = {
      name,
      input,
      password,
      role,
    };

    if (!signUp) {
      registerUser(userData);
    } else {
      const loginData = {
        input,
        password,
      };
      loginUser(loginData);
    }

    //cleanup toh karo ree
    setName("");
    setInput("");
    setPassword("");
    setReEnterPassword("");
    setRole("Client");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center mx-28 ml-48 my-16 items-center w-full"
      >
        {/* Left Container */}
        <div className="w-[50%]">
          {showOTP && (
            <div className="bg-cyan-600 text-white text-center font-semibold p-4 animate-bounce w-[50%] rounded-xl">
              <h1>Your OTP is {OTP} </h1>
            </div>
          )}
          <div className="w-[50%] flex flex-col gap-5 shadow-lg rounded-lg  bg-white p-5">
            <p className="text-center text-3xl font-medium font-semibold">
              {signUp ? "Login" : "Signup"}
            </p>
                <div className="flex justify-around gap-10 cursor-pointer">
                  <p
                    onClick={handleClient}
                    className={role === "Client" ? "active" : "inactive"}
                  >
                    Client
                  </p>
                  {
                    signUp && (
                      <p
                    onClick={handleTherapist}
                    className={role === "Therapist" ? "active" : "inactive"}
                  >
                    Therapist
                  </p>
                    )
                  }
                  
                </div>

            {!showSection ? (
              <div className="flex flex-col gap-3">
                {!signUp && (
                  <input
                    className="bg-cyan-100  p-2 w-[100%]  outline-none rounded-lg"
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Full Name"
                  />
                )}
                {
                  <input
                    className="bg-cyan-100  p-2 w-[100%]  outline-none rounded-lg"
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Email or Phone Number"
                  />
                }
                {
                  <input
                    className="bg-cyan-100  p-2 w-[100%]  outline-none rounded-lg"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Password"
                  />
                }
                {!signUp && (
                  <input
                    className="bg-cyan-100  p-2 w-[100%]  outline-none rounded-lg"
                    type="password"
                    value={reEnterPassword}
                    onChange={handleReEnterPassword}
                    placeholder="Re-Enter Passowrd"
                  />
                )}
                <p className="m-0 p-0 text-red-600"> {error} </p>
                <button
                  onClick={handleSubmission}
                  className="w-[40%] rounded-lg bg-yellow p-2 text-green-500 text-base"
                >
                  {signUp ? "Login" : "Send OTP"}
                </button>
                <p
                  onClick={handleClick}
                  className="text-cyan-500 cursor-pointer"
                >
                  {signUp
                    ? "Signup "
                    : "Already Registered ? Login Now"}
                </p>
                {signUp ? (
                  <Link to="/forgot-password">
                    <p className="text-cyan-500 cursor-pointer mt-[-10px]">
                      Forgot Password?
                    </p>
                  </Link>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* <input
                  className="bg-cyan-100  p-2 w-[100%]  outline-none rounded-lg"
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Email or Phone Number"
                /> */}
                <input
                  className="bg-cyan-100  p-2 w-[100%]  outline-none rounded-lg"
                  type="number"
                  value={otpVerify}
                  onChange={handleOtpVerify}
                  placeholder="Enter OTP"
                />
                <div className="flex justify-center items-center">
                  <button
                    type="submit"
                    className="w-[30%]  font-semibold rounded-lg bg-yellow p-2 text-green-500 text-base"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Right Container */}
        <div className="w-[50%]">
          <div className="bg-cyan-600 rounded-lg w-[306px]  flex items-center">
            <img
              src={require(`./images/aroundwithin-speed.gif`)}
              alt=""
              className="w-full rounded-md"
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default Register__Login;
