import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserReducerFunc } from "../../features/user/userSlice";
import axios from "axios";
import { createOrUpdateUser } from "../../functions/auth";

const RegisterComplete = ({ history }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useSelector((state) => state.User);

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegistration"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be atleast 6 letters long");
      return;
    }
    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );

      if (result.user.emailVerified) {
        // remove the email from localStorage
        window.localStorage.removeItem("emailForRegistration");
        // get user id token
        let user = auth.currentUser;
        await user.updatePassword(password);
        const idTokenResult = await user.getIdTokenResult();
        // redux store
        // redirect
        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            dispatch(
              UserReducerFunc({
                name: res.data.email.split("@")[0],
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              })
            );
            navigate("/");
          })
          .catch((error) => console.log(error));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const completeRegisterForm = () => (
    <form onSubmit={handleSubmit}>
      <input type={"email"} className="form-control" value={email} disabled />

      <input
        type={"password"}
        className="form-control my-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        autoFocus
      />

      <br />

      <button type="submit" className="btn btn-raised my-3">
        Complete Registration
      </button>
    </form>
  );

  return (
    <div className="container p-5 ">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Complete Registration</h4>

          {completeRegisterForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
