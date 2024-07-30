// src/components/Login.tsx
import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginWithEmail, loginWithPhone } from "../api/auth.service";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { setTokens } from "../api/authSlice";
import AlertPopover from "./Alert";
import bgImage from "../assets/bg2.png";

const Login: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<string>("email");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setAuthenticated } = useContext(AuthContext);

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        const nextSibling = document.getElementById(`otp-${index + 1}`);
        if (nextSibling) {
          nextSibling.focus();
        }
      }
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPhoneNumber(value);
      if (value.length !== 10) {
        setPhoneError("Phone number must be 10 digits");
      } else {
        setPhoneError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === "email") {
      try {
        const params = {
          email: email,
          password: password,
        };
        const response = await loginWithEmail(params, setAlertMessage);
        dispatch(
          setTokens({
            accessToken: response.access,
            refreshToken: response.refresh,
          })
        );
        setAuthenticated(true);
        navigate("/dashboard");
      } catch (error) {
        setErrorMessage(
          "Login failed. Please check your credentials and try again."
        );
        setShowError(true);
      }
    } else {
      try {
        const params = {
          phone_number: phoneNumber,
          otp: otp.join(""),
        };
        const response = await loginWithPhone(params, setAlertMessage);
        dispatch(
          setTokens({
            accessToken: response.access,
            refreshToken: response.refresh,
          })
        );
        setAuthenticated(true);
        navigate("/dashboard");
      } catch (error) {
        setErrorMessage(
          "Login failed. Please check your credentials and try again."
        );
        setShowError(true);
      }
    }
  };

  const verifyOtp = () => {
    const otpValue = otp.join("");
    if (otpValue === "123456") {
      setIsOtpVerified(true);
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        // backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md relative z-10">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <div className="mb-4">
          <button
            className={`${
              loginMethod === "email"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            } font-bold py-2 px-4 rounded mr-2`}
            onClick={() => setLoginMethod("email")}
          >
            Login with Email
          </button>
          <button
            className={`${
              loginMethod === "phone"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            } font-bold py-2 px-4 rounded`}
            onClick={() => setLoginMethod("phone")}
          >
            Login with Phone
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {loginMethod === "email" && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email<span className="text-red-700">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Password<span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>
            </>
          )}
          {loginMethod === "phone" && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="phoneNumber"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Phone Number<span className="text-red-700">*</span>
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  pattern="\d{10}"
                  title="Phone number must be 10 digits"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                {phoneError && (
                  <p className="text-red-500 text-xs italic">{phoneError}</p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="otp"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  OTP<span className="text-red-700">*</span>
                </label>
                <div className="flex justify-between w-full">
                  <div className="flex space-x-2 w-[60%]">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(e, index)}
                        className="shadow appearance-none border rounded py-2 px-3 text-gray-700 text-center leading-tight focus:outline-none focus:shadow-outline w-[2.25rem]"
                        maxLength={1}
                        required
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={verifyOtp}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            </>
          )}
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loginMethod === "phone" &&
              !isOtpVerified &&
              "opacity-50 cursor-not-allowed"
            }`}
            disabled={loginMethod === "phone" && !isOtpVerified}
          >
            Login
          </button>
        </form>
      </div>
      <AlertPopover
        isOpen={!!alertMessage}
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
    </div>
  );
};

export default Login;
