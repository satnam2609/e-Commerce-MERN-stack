import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { UserReducerFunc } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import Link from "antd/es/typography/Link";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.User);
  const navigate = useNavigate();
  useEffect(() => {
    if (user && user.token) {
      navigate("/");
    }
  }, [user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const config = {
      url: "http://localhost:3000/login",
      handleCodeInApp: true,
    };
    await auth
      .sendPasswordResetEmail(email, config)
      .then((result) => {
        setEmail("");
        setLoading(false);
        toast.success("check your email for password reset link!");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        toast.error(error.message);
      });
  };

  return (
    <div className="container col-mid-6 offset-mid-3 p-5">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <h4>Forgot Password</h4>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
        <br />
        <button className="btn btn-raised" disabled={!email}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
