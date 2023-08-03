import React, { useState, useEffect } from "react";
import { auth, googleAuthProvider } from "../../firebase";
import { toast } from "react-toastify";
import { Button } from "antd";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { UserReducerFunc } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import Link from "antd/es/typography/Link";
import axios from "axios";
import { createOrUpdateUser } from "../../functions/auth";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.User);

  useEffect(() => {
    if (user && user.token) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/history");
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      const roleBasedRedirect = (res) => {
        // check if intended

        {
          if (res.data.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/user/history");
          }
        }
      };

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
          roleBasedRedirect(res);
        })
        .catch((err) => console.log(err));

      // history.push("/");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    await auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();

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
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };
  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type={"email"}
          className="form-control"
          value={email}
          placeholder="Enter your email address"
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
      </div>

      <div className="form-group">
        <input
          type={"password"}
          className="form-control"
          value={password}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        block
        shape="round"
        icon={<MailOutlined />}
        size="large"
        disabled={!email || !password || password.length < 6}
      >
        Login with email password
      </Button>
    </form>
  );

  return (
    <div className="container p-5 ">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {loading ? (
            <h4 className="text-danger">...Loading</h4>
          ) : (
            <h4>Sign in</h4>
          )}

          {loginForm()}
          <Button
            onClick={googleLogin}
            danger
            className="mb-3"
            block
            shape="round"
            icon={<GoogleOutlined />}
            size="large"
          >
            Login with Google
          </Button>
          <Link
            onClick={() => navigate("/forgot/password")}
            className="float-right text-danger "
          >
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
