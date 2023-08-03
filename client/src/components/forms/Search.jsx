import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { searchReducer } from "../../features/searchReducer";

const Search = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { text } = useSelector((state) => state.Search);

  const handleChange = (e) => {
    // ..
    dispatch(searchReducer(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/shop?${text}`);
  };
  return (
    <form className="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        type="search"
        placeholder="Search here..."
        value={text}
        className="form-control mr-sm-2"
      />
      <SearchOutlined
        onClick={handleSubmit}
        style={{
          cursor: "pointer",
        }}
      />
    </form>
  );
};

export default Search;
