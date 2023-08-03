import React, { useState, useEffect } from "react";
import {
  getProductsByCount,
  fetchProductsByFilter,
} from "../functions/product";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/cards/ProductsCard";
import { Menu, Slider, Checkbox, Radio } from "antd";
import {
  DollarOutlined,
  DownSquareOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { searchReducer } from "../features/searchReducer";
import { getCategories } from "../functions/category";
import { getsubCategories } from "../functions/subCategory";
import Star from "../components/forms/Star";

const { SubMenu, ItemGroup } = Menu;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [subs, setSubs] = useState([]);
  const [sub, setSub] = useState("");
  const [star, setStar] = useState("");
  const { user } = useSelector((state) => state.User);
  const { text } = useSelector((state) => state.Search);
  const [ok, setOk] = useState(false);
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const [categoriesId, setCategoriesId] = useState([]);
  const [brands, setBrands] = useState([
    "Apple",
    "Samsung",
    "Microsoft",
    "Lenovo",
    "ASUS",
  ]);
  const [brand, setBrand] = useState("");
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [color, setColor] = useState("");
  const [shipping, setShipping] = useState("");

  useEffect(() => {
    loadAllProducts();
    // fetch all categories
    getCategories().then((res) => {
      setLoading(false);
      setCategories(res.data);
    });
    getsubCategories().then((res) => {
      setLoading(false);
      setSubs(res.data);
    });
  }, []);

  // 1.load Products on shop page by default
  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(12, user.token).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  // load products on user search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      if (!text) {
        loadAllProducts();
      }
      loadFetchProducts({ query: text });
    }, 500);

    return () => clearTimeout(delayed);
  }, [text]);

  const loadFetchProducts = (arg) => {
    fetchProductsByFilter(arg).then((res) => {
      setProducts(res.data);
    });
  };

  // 3.load products based on the price range
  useEffect(() => {
    console.log("ok to request");
    loadFetchProducts({ price: price });
  }, [ok]);

  const handleSlider = (value) => {
    setPrice(value);
    setCategoriesId([]);
    dispatch(searchReducer(""));
    setTimeout(() => {
      setOk(!ok);
    }, 500);
  };

  // 4.load products based on categories

  const showCategories = () =>
    categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          onChange={handleCheck}
          className="pb-2 pl-4 pr-4"
          value={c._id}
          name="category"
          checked={categoriesId.includes(c._id)}
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ));

  const handleCheck = (e) => {
    dispatch(searchReducer(""));
    setPrice([0, 0]);
    // console.log(e.target.value);
    let inTheState = [...categoriesId];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked); // index or -1

    // indexOf method ?? if not found returns -1 else return index [1,2,3,4,5]
    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      // if found pull out one item from index
      inTheState.splice(foundInTheState, 1);
    }

    setCategoriesId(inTheState);
    // console.log(inTheState);
    loadFetchProducts({ category: inTheState });
  };

  // 5.search by star rating
  const showStars = () => (
    <div className="pr-4 pl-4 pb-2">
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );
  const handleStarClick = (num) => {
    // console.log(num);
    dispatch(searchReducer(""));
    setPrice([0, 0]);
    setCategoriesId([]);
    setStar(num);
    loadFetchProducts({ stars: num });
  };

  // 6.subs
  const showSubCategories = () =>
    subs.map((c) => (
      <div
        key={c._id}
        onClick={() => handleSub(c)}
        className="p-1 m-1 badge badge-secondary"
        style={{
          cursor: "pointer",
        }}
      >
        {c.name}
        <br />
      </div>
    ));

  const handleSub = (sub) => {
    setSub(sub);
    setPrice([0, 0]);
    setCategoriesId([]);
    dispatch(searchReducer(""));
    setStar("");
    loadFetchProducts({ subCategory: sub });
  };

  // brands
  const showBrands = () =>
    brands.map((b) => (
      <Radio
        value={b}
        name={b}
        checked={b === brand}
        onChange={handleBrand}
        className="pb-1 pl-4 pr-4"
      >
        {b}
      </Radio>
    ));

  const handleBrand = (e) => {
    setSub("");
    dispatch(searchReducer(""));
    setPrice([0, 0]);
    setCategoriesId([]);
    setStar("");
    setBrand(e.target.value);
    loadFetchProducts({ brand: e.target.value });
  };

  // 8. show products based on color
  const showColors = () =>
    colors.map((c) => (
      <Radio
        value={c}
        name={c}
        checked={c === color}
        onChange={handleColor}
        className="pb-1 pl-4 pr-4"
      >
        {c}
      </Radio>
    ));

  const handleColor = (e) => {
    setSub("");
    dispatch(searchReducer(""));
    setPrice([0, 0]);
    setCategoriesId([]);
    setStar("");
    setBrand("");
    setColor(e.target.value);
    setShipping("");
    loadFetchProducts({ color: e.target.value });
  };

  // 9. show products based on shipping yes/no
  const showShipping = () => (
    <>
      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingchange}
        value="Yes"
        checked={shipping === "Yes"}
      >
        Yes
      </Checkbox>

      <Checkbox
        className="pb-2 pl-4 pr-4"
        onChange={handleShippingchange}
        value="No"
        checked={shipping === "No"}
      >
        No
      </Checkbox>
    </>
  );

  const handleShippingchange = (e) => {
    setSub("");
    dispatch(searchReducer(""));
    setPrice([0, 0]);
    setCategoriesId([]);
    setStar("");
    setBrand("");
    setColor("");
    setShipping(e.target.value);
    loadFetchProducts({ shipping: e.target.value });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <h4>Search filters</h4>
          <hr />
          <Menu
            mode="inline"
            defaultOpenKeys={["1", "2", "3", "4", "5", "6", "7"]}
          >
            {/* price */}
            <SubMenu
              key={"1"}
              title={
                <span className="h6">
                  <DollarOutlined />
                  Price
                </span>
              }
            >
              <Slider
                className="ml-4 mr-4"
                tipFormatter={(v) => `$${v}`}
                value={price}
                range
                onChange={handleSlider}
                max={"499999"}
              />
            </SubMenu>

            {/* category */}
            <SubMenu
              key={"2"}
              title={
                <span className="h6">
                  <DownSquareOutlined />
                  Categories
                </span>
              }
            >
              <div>{showCategories()}</div>
            </SubMenu>

            {/* rating */}
            <SubMenu
              key={"3"}
              title={
                <span className="h6">
                  <StarOutlined />
                  Rating
                </span>
              }
            >
              <div>{showStars()}</div>
            </SubMenu>

            {/* subs */}
            <SubMenu
              key={"4"}
              title={
                <span className="h6">
                  <StarOutlined />
                  Sub-Category
                </span>
              }
            >
              <div>{showSubCategories()}</div>
            </SubMenu>
            <SubMenu
              key="5"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Brands
                </span>
              }
            >
              <div style={{ maringTop: "-10px" }} className="pr-5">
                {showBrands()}
              </div>
            </SubMenu>

            {/* colors */}
            <SubMenu
              key="6"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Colors
                </span>
              }
            >
              <div style={{ maringTop: "-10px" }} className="pr-5">
                {showColors()}
              </div>
            </SubMenu>

            {/* shipping */}
            <SubMenu
              key="7"
              title={
                <span className="h6">
                  <DownSquareOutlined /> Shipping
                </span>
              }
            >
              <div style={{ maringTop: "-10px" }} className="pr-5">
                {showShipping()}
              </div>
            </SubMenu>
          </Menu>
        </div>

        <div className="col-md-9 pt-3">
          {loading ? (
            <h4 className="text-danger">...Loading</h4>
          ) : (
            <h4 className="text-success">Shop products</h4>
          )}

          {products.length < 1 && <p>No products found</p>}
          <div className="row">
            {products.map((prod) => {
              return (
                <div key={prod._id} className="col-md-4">
                  <ProductCard product={prod} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
