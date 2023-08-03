import axios from "axios";

export const getsubCategories = async () => {
  return await axios.get("http://localhost:8000/api/subCategories");
};

export const getsubCategory = async (slug) => {
  return await axios.get("http://localhost:8000/api/subCategory/" + slug, {});
};

export const updatesubCategory = async (sub, authtoken, slug) => {
  return await axios.put("http://localhost:8000/api/subCategory/" + slug, sub, {
    headers: {
      authtoken: authtoken,
    },
  });
};

export const removesubCategory = async (authtoken, slug) => {
  return await axios.delete(
    "http://localhost:8000/api/subCategory/" + slug,

    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};

export const createsubCategory = async (authtoken, sub) => {
  return await axios.post("http://localhost:8000/api/subCategory", sub, {
    headers: {
      authtoken: authtoken,
    },
  });
};
