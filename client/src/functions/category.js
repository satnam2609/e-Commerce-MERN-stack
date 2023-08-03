import axios from "axios";

export const getCategories = async () => {
  return await axios.get("http://localhost:8000/api/categories");
};

export const getCategory = async (slug, authtoken) => {
  return await axios.get(
    "http://localhost:8000/api/category/" + slug,
    {},
    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};

export const updateCategory = async (name, authtoken, slug) => {
  return await axios.put("http://localhost:8000/api/category/" + slug, name, {
    headers: {
      authtoken: authtoken,
    },
  });
};

export const removeCategory = async (authtoken, slug) => {
  return await axios.delete(
    "http://localhost:8000/api/category/" + slug,

    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};

export const createCategory = async (authtoken, category) => {
  return await axios.post("http://localhost:8000/api/category", category, {
    headers: {
      authtoken: authtoken,
    },
  });
};

export const getCategorySubs = async (_id) =>
  await axios.get(`http://localhost:8000/api/category/subs/${_id}`);
