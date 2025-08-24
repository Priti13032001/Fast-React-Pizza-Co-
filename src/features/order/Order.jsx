
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../Utils/helpers";
import { useFetcher, useLoaderData } from "react-router-dom";
import { getOrder } from "../../Services/apiRestaurant";
import OrderItem from "./OrderItem";
import { useEffect } from "react";
import UpdateOrder from "./UpdateOrder";

function Order() {
  const order = useLoaderData();

  const fetcher = useFetcher();

  useEffect(function(){
if(!fetcher.data && fetcher.state === 'idle')
    fetcher.load('/menu');

  },[fetcher]);

//console.log(fetcher.data);


  // Everyone can serach for all orders, so for privacy
  // reasons we're gonna exclude names or 
  // address , these are only for restaurant staff

  if (!order) {
    return (
      <div className="px-4 py-6 text-red-500">
        Failed to load order. Please try again later.
      </div>
    );
  }

  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;

  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="space-y-8 px-4 py-6">
      {/* Header with status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">
          Order #{id} — {status ?? "Unknown"}
        </h2>

        <div className="space-x-2">
          {priority && (
            <span className="bg-red-500 rounded-full py-1 px-3 text-sm font-semibold uppercase tracking-wide text-red-50">
              Priority
            </span>
          )}
          {status && (
            <span className="bg-green-500 rounded-full py-1 px-3 text-sm font-semibold uppercase tracking-wide text-green-50">
              {status} order
            </span>
          )}
        </div>
      </div>

      {/* Delivery info */}
      <div className="flex items-center justify-between flex-wrap gap-2 bg-stone-200 px-5 py-6">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${deliveryIn} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-xs text-stone-500">
          (Estimated delivery: {formatDate(estimatedDelivery)})
        </p>
      </div>

      {/* Order items */}
      <ul className="dive-stone-200 divide-y border-b border-t">
        {cart.map((item) => (
          <OrderItem item={item} 
          key={item.pizzaId} 

          isLoadingIngredients={fetcher.state === 'loading'}
          ingredients={fetcher?.data?.find(el => el.id === item.pizzaId)?.ingredients ?? []}
          />
        ))}
      </ul>

      {/* Price details */}
      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">
          Price pizza: {formatCurrency(orderPrice)}
        </p>
        {priority && (
          <p className="text-sm font-medium text-stone-600">
            Price priority: {formatCurrency(priorityPrice)}
          </p>
        )}
        <p className="font-bold">
          To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}
        </p>
      </div>

      {!priority && <UpdateOrder order = {order}/>
 }



    </div>
  );
}

export async function loader({ params }) {
  try {
    const order = await getOrder(params.orderId);
    return order;
  } catch {
    return null;
  }
}

export default Order;
