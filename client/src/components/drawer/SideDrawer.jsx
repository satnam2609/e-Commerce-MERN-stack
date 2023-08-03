import React from "react";
import { Drawer, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { stateChange } from "../../features/drawer_state/drawerReducer";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { drawer } = useSelector((state) => state.Drawer);
  const { cart } = useSelector((state) => state.Cart);

  return (
    <Drawer
      className="text-center"
      title={`Cart/${cart.length}`}
      visible={drawer}
      closable={true}
      onClose={() => {
        dispatch(stateChange());
      }}
    >
      {cart.map((c) => {
        return (
          <div className="row" key={c._id}>
            <div className="col">
              {c.images[0].url && (
                <>
                  <img
                    src={c.images[0].url}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100px",
                      objectFit: "contain",
                    }}
                  />
                  <p className="text-center bg-secondary text-light">
                    {c.title} x{c.count}
                  </p>
                </>
              )}
            </div>
          </div>
        );
      })}

      <Button
        className="btn btn-primary text-center btn-raised btn-block"
        onClick={() => {
          navigate("/cart");
          dispatch(stateChange());
        }}
      >
        Go to cart
      </Button>
    </Drawer>
  );
};

export default SideDrawer;
