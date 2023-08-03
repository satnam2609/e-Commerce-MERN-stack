import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../functions/category";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";

const CategoryCreate = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.User);
  // add state for keyword search filter
  const [search, setSearch] = useState("");

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    laodCategories();
  }, [loading]);

  const laodCategories = async () => {
    getCategories()
      .then((c) => setCategories(c.data))
      .catch();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user.token);
    setLoading(true);
    createCategory(user.token, { name })
      .then((res) => {
        setLoading(false);
        toast.success(`${res.data.name} is created!`);
        console.log(res);
        setName("");
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Something went wrong!");
        console.log(err);
      });
    console.log(name);
  };

  const handleDelete = async (slug) => {
    setLoading(true);
    if (window.confirm("Are your sure you want to delete")) {
      removeCategory(user.token, slug)
        .then((res) => {
          setLoading(false);
          toast.success(`${res.data.name} is deleted!`);
          console.log(res.data);
        })
        .catch((err) => {
          toast.error("Cannot delete category,something went wrong!");
          console.log(err);
        });
    }
  };

  const searched = (search) => (c) => c.name.toLowerCase().includes(search);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="colmd-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? <h4>Loading...</h4> : <h4>Create new Category</h4>}
          <CategoryForm
            name={name}
            handleSubmit={handleSubmit}
            setName={setName}
          />

          {/* input search */}
          <LocalSearch search={search} setSearch={setSearch} />

          <hr />
          {categories.filter(searched(search)).map((cat) => {
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
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
