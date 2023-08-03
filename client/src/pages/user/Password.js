import React, { useState } from "react";
import { toast } from "react-toastify";
import UserNav from "../../components/nav/UserNav";
import { auth } from "../../firebase";

const Password = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await auth.currentUser
      .updatePassword(password)
      .then(() => {
        setLoading(true);
        toast.success("Your password has been changed");
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err);
      });
  };

  const passewordUpdateForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Password</label>
          <input
            type={"password"}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter new password"
            className="form-control"
            disabled={loading}
          />

          <button className="btn btn-primary" disabled={!password || loading}>
            Submit
          </button>
        </div>
      </form>
    );
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="colmd-2">
          <UserNav />
        </div>

        <div className="col">
          {loading ? <h4>Loading...</h4> : <h4>Password Update</h4>}
          {passewordUpdateForm()}
        </div>
      </div>
    </div>
  );
};

export default Password;
