import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../../utils/Constants";
import authAxios from "../../utils/authAxios";
import { toast } from "react-toastify";

const Cart = () => {

  const [cart, setCart] = useState([]);

  const getCart = async () => {
    try {
      const res = await authAxios.get(`${apiUrl}/cart`);
      setCart(res.data.Data); // Directly set favorites to the array of favorites
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        toast.error('Cart is Empty');
      } else {
        toast.error(error.response?.data?.message || 'An error occurred');
      }
    }
  };

  const removeCart = async (itemId) => {
    try {
        const result = await authAxios.delete(`${apiUrl}/cart/${itemId}`);
        if (result) {
          toast.success("Removed");
          getCart();
        }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const total = cart.reduce((total, item) => {
    return total + item.itemId.price * item.quantity;
  }, 0);


  return (
    <div>
      <div class="h-screen bg-gray-100 ">
        <h1 className="mb-6 text-4xl font-semibold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-gray-700 text-center">Cart Items</h1>
        <div class="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
          {cart.length === 0 ? (
            <div class="text-center">
              <p class="text-xl text-gray-700">Cart is empty</p>
            </div>
          ) : (
            <div class="rounded-lg md:w-2/3">
              {cart.map((item, index) => {
                return (
                  <div class="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                    <img src={item.itemId.img} className="box-content h-32 w-32 border-0" />
                    <div class="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                      <div class="mt-5 sm:mt-0">
                        <h2 class="text-lg font-bold text-gray-900">{item.itemId.itemName}</h2>
                        {/* <p class="mt-1 text-xs text-gray-700">36EU - 4US</p> */}
                      </div>
                      <div class="mt-4 flex justify-between im sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                        <div class="flex items-center border-gray-100">
                          <span class="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
                            onClick={() => {
                              if (item.quantity > 1) {
                                dispatch({ type: "DECREASE", payload: item });
                              } else {
                                dispatch({ type: "REMOVE", payload: item });
                              }
                            }}> - </span>
                          <input class="h-8 w-8 border bg-white text-center text-xs outline-none" type="number"
                            value={item.quantity} // Use the actual item quantity here
                            min="1"
                            disabled />
                          <span class="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
                            onClick={() => dispatch({ type: "INCREASE", payload: item }
                            )}> + </span>
                        </div>
                        <div class="flex items-center space-x-4">
                          <p class="text-sm">Rs. {item.quantity * item.itemId.price}</p>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                            onClick={() => removeCart(item._id)}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {cart.length > 0 && (
            <div class="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
              <>
                <div class="mb-2 flex justify-between">
                  <p class="text-gray-700">Subtotal</p>
                  <p class="text-gray-700">Rs. {total}</p>
                </div>
                <div class="mb-2 flex justify-between">
                  <p class="text-gray-700">Discount</p>
                  <p class="text-gray-700">Rs. 0.00</p>
                </div>
                <div class="flex justify-between">
                  <p class="text-gray-700">Shipping</p>
                  <p class="text-gray-700">Free</p>
                </div>
                <hr class="my-4" />
                <div class="flex justify-between">
                  <p class="text-lg font-bold">Total</p>
                  <div class="">
                    <p class="mb-1 text-lg font-bold">Rs. {total}</p>
                    <p class="text-sm text-gray-700">including VAT</p>
                  </div>
                </div>

                <Link to="/customer/checkout">
                  <button className="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600">
                    Check out
                  </button>
                </Link>
              </>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
