import React from "react";

const CategoryForm = ({ name, handleSubmit, setName }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          placeholder="Enter category"
          onChange={(e) => setName(e.target.value)}
          autoFocus
          required
        />
        <button className="btn btn-outline-primary mt-4">Save</button>
      </div>
    </form>
  );
};

export default CategoryForm;
