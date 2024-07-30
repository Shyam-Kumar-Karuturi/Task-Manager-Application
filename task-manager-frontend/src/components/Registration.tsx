// src/components/Registration.tsx
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register } from "../api/auth.service";
import { useDispatch } from "react-redux";
import { setTokens } from "../api/authSlice";
import AlertPopover from "./Alert";
import bgImage from "../assets/bg.png";
import { useNavigate } from "react-router-dom";

const Registration: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for touched fields
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phoneNumber: false,
    otp: false,
    password: false,
  });

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = { name, email, phone_number: phoneNumber, password };
      const response = await register(userData, setAlertMessage);
      console.log("Registration successful", response);
      dispatch(
        setTokens({
          accessToken: response.access,
          refreshToken: response.refresh,
        })
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error", error);
    }
  };

  const verifyOtp = () => {
    const otpValue = otp.join("");
    if (otpValue === "123456") {
      // Example OTP verification logic
      setIsOtpVerified(true);
    } else {
      alert("Invalid OTP");
    }
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input field if a digit is entered
      if (value && index < otp.length - 1) {
        const nextSibling = document.getElementById(`otp-${index + 1}`);
        if (nextSibling) {
          nextSibling.focus();
        }
      }
    }
  };

  const isFieldEmpty = (field: string) => {
    return field.trim() === "";
  };

  const isValidPassword = (password: string) => {
    const minLength = 5;
    const maxLength = 12;
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,12}$/;
    return (
      regex.test(password) &&
      password.length >= minLength &&
      password.length <= maxLength
    );
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
        <h2 className="text-2xl font-bold mb-6">Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Name<span className="text-red-700">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur("name")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            {touched.name && isFieldEmpty(name) && (
              <p className="text-red-500 text-xs italic">Name is required.</p>
            )}
          </div>
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
              onBlur={() => handleBlur("email")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            {touched.email && isFieldEmpty(email) && (
              <p className="text-red-500 text-xs italic">Email is required.</p>
            )}
          </div>
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
              onChange={(e) => setPhoneNumber(e.target.value)}
              onBlur={() => handleBlur("phoneNumber")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            {touched.phoneNumber && isFieldEmpty(phoneNumber) && (
              <p className="text-red-500 text-xs italic">
                Phone number is required.
              </p>
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
            {touched.otp && isFieldEmpty(otp.join("")) && (
              <p className="text-red-500 text-xs italic">OTP is required.</p>
            )}
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
                onBlur={() => handleBlur("password")}
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
            {touched.password && (
              <>
                {isFieldEmpty(password) && (
                  <p className="text-red-500 text-xs italic">
                    Password is required.
                  </p>
                )}
                {!isValidPassword(password) && (
                  <p className="text-red-500 text-xs italic">
                    Password must be 5-12 characters long, contain at least one
                    letter, one number, and one special character.
                  </p>
                )}
              </>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                !isOtpVerified && "opacity-50 cursor-not-allowed"
              }`}
              disabled={!isOtpVerified}
            >
              Register
            </button>
          </div>
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

export default Registration;
