

import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../Services/apiRestaurant";

import { useSelector } from "react-redux";
import Button from "../../Ui/Button";
import { clearCart, getCart, getTotalCartPrice } from "../Cart1/cartSlice";
import EmptyCart from "../Cart1/EmptyCart"; // ✅ fixed path

import store from '../../store'
//import { getTotalCartPrice } from './../Cart1/cartSlice';
import { formatCurrency } from "../../Utils/helpers";
import { useState } from "react";
import { fetchAddress } from "../User/userSlice";

import { useDispatch } from "react-redux";
// Phone validation regex
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(str);

function CreateOrder() {

const [withPriority,setWithPriority] = useState(false);


  const {username,
    status:addressStatus,
    position,
    address,
   error:errorAddress,
    
  } = useSelector((state) => state.user);

  const isLoadingAddress = addressStatus === 'loading';


  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();

  const dispatch = useDispatch();


  const cart = useSelector(getCart);
  console.log(cart);


// const priorityPrice = 0 ; 

//   const totalPrice = totalCartPrice + priorityPrice 



//   const totalCartPrice = useSelector(getTotalCartPrice)

const totalCartPrice = useSelector(getTotalCartPrice);
const priorityPrice = withPriority ? totalCartPrice
* 0.2 :0;
// later you can calculate real priority fee
const totalPrice = totalCartPrice + priorityPrice;


  if (!cart.length) return <EmptyCart />;

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>






      <Form method="POST">
        {/* Customer Name */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">First Name</label>
          <input
            className="w-full grow rounded-full border border-stone-200 
                         px-4 py-2 text-sm transition-all duration-300
                         placeholder:text-stone-400 focus:outline-none
                         focus:ring focus:ring-yellow-400 md:px-6 md:py-3"
            type="text"
            name="customer"
            defaultValue={username}
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Phone number</label>
          <div className="grow">
            <input
              className="w-full grow rounded-full border border-stone-200 
                         px-4 py-2 text-sm transition-all duration-300
                         placeholder:text-stone-400 focus:outline-none
                         focus:ring focus:ring-yellow-400 md:px-6 md:py-3"
              type="tel"
              name="phone"
              required
            />
          </div>
          {formErrors?.phone && (
            <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
              {formErrors.phone}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="sm:basis-40">Address</label>
          <div className="grow">
            <input
              className="w-full grow rounded-full border border-stone-200 
                         px-4 py-2 text-sm transition-all duration-300
                         placeholder:text-stone-400 focus:outline-none
                         focus:ring focus:ring-yellow-400 md:px-6 md:py-3"
              type="text"
              name="address"
              disabled = {isLoadingAddress}
              defaultValue = {address}
              required
            />
           {addressStatus ==='error' &&(
            <p className="mt-2 rounded-md bg-red-100
            p-2 text-xs text-red-700">
              {errorAddress}
            </p>
           )}



          </div>


{
  
  !position.latitude && !position.longitude && 
  (
  <span className="absolute right-[3px] top-[3px] z-50
  sm:right-[5px] md:top-[5px]
  ">
<Button
disabled={isLoadingAddress}
 type = "small" 
 onClick = {(e)=>{
  e.preventDefault();
  dispatch(fetchAddress())}}>

  Get position
</Button>

</span> )}
        </div>

        {/* Priority Option */}
        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none
                       focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={(e) =>setWithPriority(e.target.checked)}



          />
          <label htmlFor="priority" className="font-medium">
            Want to give your order priority?
          </label>
        </div>

        {/* Hidden cart data (✅ now uses real Redux cart, not fakeCart) */}
        <input type="hidden" name="cart" value={JSON.stringify(cart)} />


        <input type="hidden" name="position" 
        value = {position.longitude && position.latitude
          ? `${position.latitude},${position.longitude}`
          :''
      
 }/>



        {/* Submit Button */}
        <Button disabled={isSubmitting || isLoadingAddress} type="primary">
          {isSubmitting ? "Placing order..." : `Order now from ${formatCurrency(totalPrice)}`}
        </Button>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };


  console.log(order);

  // Validation
  const errors = {};
  if (!isValidPhone(order.phone)) {
    errors.phone =
      "Please give me your correct phone number. We might need it to contact you.";
  }

  if (Object.keys(errors).length > 0) return errors;

  const newOrder = await createOrder(order);

// Do not overuse
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);

//return null;


}

export default CreateOrder;
