import axios from "axios";

export const getProductsByCount = async (count, authtoken) => {
  return await axios.get(
    `http://localhost:8000/api/products/${count}`,
    {},
    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};

export const updateProduct = async (slug, product, authtoken) =>
  await axios.put(`http://localhost:8000/api/product/${slug}`, product, {
    headers: {
      authtoken,
    },
  });

export const removeProduct = async (authtoken, slug) => {
  return await axios.delete(
    "http://localhost:8000/api/product/" + slug,

    {
      headers: {
        authtoken: authtoken,
      },
    }
  );
};

export const getProduct = async (slug) => {
  return await axios.get("http://localhost:8000/api/product/" + slug);
};

export const createProduct = async (product, authtoken) =>
  await axios.post(`http://localhost:8000/api/product`, product, {
    headers: {
      authtoken,
    },
  });

export const getProducts = async (sort, order, page) =>
  await axios.post(`http://localhost:8000/api/products`, {
    sort,
    order,
    page,
  });

export const getProductsCount = async () => {
  return await axios.get("http://localhost:8000/api/products/total");
};

export const setProductStar = async (productId, star, authtoken) => {
  return await axios.put(
    `http://localhost:8000/api/product/star/${productId}`,
    { star },
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getProductStar = async (productId, authtoken) => {
  return await axios.put(
    `http://localhost:8000/api/product/getStar/${productId}`,
    {},
    {
      headers: {
        authtoken,
      },
    }
  );
};

export const getRelated = async (productId) => {
  return await axios.get(
    `http://localhost:8000/api/product/related/${productId}`,
    {}
  );
};

export const fetchProductsByFilter = async (arg) => {
  return await axios.post(`http://localhost:8000/api/search/filters`, arg);
};
