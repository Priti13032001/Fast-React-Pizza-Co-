
import { formatCurrency } from "../../Utils/helpers";
import DeleteItem from "./DeleteItem";
import UpdateItemQuantity from "./UpdateItemQuantity";
import { useSelector } from "react-redux";

import { getCurrentQuantityById } from "./cartSlice";

function CartItem({ item }) {
  const { pizzaId, name, quantity, totalPrice } = item;

  const currentQuantity = useSelector(getCurrentQuantityById((pizzaId)));

console.log(currentQuantity);


  return (
    <li className="py-3 sm:flex sm:items-center
    sm:justify-between">
      <p className="mb-1 sm:mb-0">
        {quantity}× {name}
      </p>
      <div className="flex items-center justify-between sm:gap-6">
        <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
    {/* <Button type = "small">Delete</Button> */}
      

      <UpdateItemQuantity pizzaId={pizzaId}
      currentQuantity={currentQuantity}
      />
      <DeleteItem pizzaId={pizzaId}/>
      
      </div>
    </li>
  );
}

export default CartItem;
