import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getCategory, updateCategory } from "../../../functions/category";
import { useParams, useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";

const CategoryUpdate = ({ match }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.User);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    laodCategories();
  }, [loading]);

  const laodCategories = async () => {
    getCategory(slug, user.token)
      .then((c) => setName(c.data.name))
      .catch();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user.token);
    setLoading(true);
    updateCategory({ name }, user.token, slug)
      .then((res) => {
        setLoading(false);
        toast.success(`${res.data.name} is created!`);
        setName("");
        navigate("/admin/category");
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Something went wrong!");
        console.log(err);
      });
  };

  // const handleDelete = async (slug) => {
  //   setLoading(true);
  //   if (window.confirm("Are your sure you want to delete")) {
  //     removeCategory(user.token, slug)
  //       .then((res) => {
  //         setLoading(false);
  //         toast.success(`${res.data.name} is deleted!`);
  //         console.log(res.data);
  //       })
  //       .catch((err) => {
  //         toast.error("Cannot delete category,something went wrong!");
  //         console.log(err);
  //       });
  //   }
  // };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="colmd-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? <h4>Loading...</h4> : <h4>Update Category</h4>}
          <CategoryForm
            name={name}
            handleSubmit={handleSubmit}
            setName={setName}
          />

          <hr />
          {/* {categories.map((cat) => {
            return (
              <div className="alert alert-primary" key={cat._id}>
                {cat.name}
                <span
                  className="btn btn-sm float-right"
                  onClick={() => handleDelete(cat.slug)}
                >
                  <DeleteOutlined className="text-danger" />
                </span>{" "}
                <Link
                  className="btn btn-sm float-right"
                  to={"/admin/category/" + cat.slug}
                >
                  <EditOutlined className="text-warning" />
                </Link>
              </div>
            );
          })} */}
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdate;
