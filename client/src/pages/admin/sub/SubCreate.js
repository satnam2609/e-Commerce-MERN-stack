import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createsubCategory,
  getsubCategories,
  getsubCategory,
  removesubCategory,
} from "../../../functions/subCategory";
import { getCategories } from "../../../functions/category";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";

const SubCreate = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.User);
  // add state for keyword search filter
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setsubCategories] = useState([]);
  const [selectcategories, setselectCategories] = useState([]);
  useEffect(() => {
    loadsubCategories();
    loadCategories();
  }, [loading]);

  const loadsubCategories = async () => {
    getsubCategories()
      .then((c) => setsubCategories(c.data))
      .catch();
  };

  const loadCategories = async () => {
    getCategories().then((c) => setCategories(c.data));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user.token);
    setLoading(true);
    createsubCategory(user.token, { name, parent: selectcategories })
      .then((res) => {
        setLoading(false);
        toast.success(`${res.data.name} is created!`);

        setName("");
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Something went wrong!");
        console.log(err);
      });
  };

  const handleDelete = async (slug) => {
    setLoading(true);
    if (window.confirm("Are your sure you want to delete")) {
      removesubCategory(user.token, slug)
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
          {loading ? <h4>Loading...</h4> : <h4>Create new Sub-category</h4>}

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setselectCategories(e.target.value)}
            >
              <option>Please select</option>
              {categories.length > 0 &&
                categories.map((cat) => {
                  return (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <CategoryForm
            name={name}
            handleSubmit={handleSubmit}
            setName={setName}
          />

          {/* input search */}
          <LocalSearch search={search} setSearch={setSearch} />

          <hr />
          {subcategories.filter(searched(search)).map((s) => {
            return (
              <div className="alert alert-primary" key={s._id}>
                {s.name}
                <span
                  className="btn btn-sm float-right"
                  onClick={() => handleDelete(s.slug)}
                >
                  <DeleteOutlined className="text-danger" />
                </span>{" "}
                <Link
                  className="btn btn-sm float-right"
                  to={"/admin/sub-category/" + s.slug}
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

export default SubCreate;
