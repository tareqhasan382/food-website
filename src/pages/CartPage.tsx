import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { FaMinus, FaPlus, FaShoppingCart, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  addToCart,
  clearCart,
  removeFromCart,
  removeOne,
} from "../redux/cardSlice";
import EmptyState from "../components/ui/EmptyState";
import type { ICartItem } from "../types/food";

interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
}

const DELIVERY_FEE = 2.99;
const FREE_DELIVERY_THRESHOLD = 25;

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const items = useAppSelector((state) => state.cart.items);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee =
    subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  const onSubmit: SubmitHandler<CheckoutForm> = (data) => {
    toast.success(
      `Thank you ${data.name}! Your order of $${total.toFixed(2)} is confirmed.`,
      { autoClose: 4000 }
    );
    dispatch(clearCart());
    navigate("/");
  };

  if (items.length === 0) {
    return (
      <section className="container-app py-16">
        <EmptyState
          icon={<FaShoppingCart />}
          title="Your cart is empty"
          message="Looks like you haven't added anything yet. Explore our menu and find something delicious."
          action={
            <Link to="/menu" className="btn-primary">
              Browse menu
            </Link>
          }
        />
      </section>
    );
  }

  return (
    <section className="container-app py-10">
      <h1 className="mb-8 font-display text-3xl font-bold text-gray-900">
        Your Cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item: ICartItem) => (
            <div
              key={item.id}
              className="card flex items-center gap-4 p-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-semibold text-gray-900">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500">
                  ${item.price.toFixed(2)} each
                </p>
                <p className="mt-1 text-sm font-bold text-brand">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
                <div className="flex items-center rounded-full bg-gray-100">
                  <button
                    onClick={() => dispatch(removeOne(item))}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:text-brand"
                    aria-label="Decrease quantity"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => dispatch(addToCart(item))}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:text-brand"
                    aria-label="Increase quantity"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item))}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
                  aria-label="Remove item"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary + Checkout */}
        <div className="card h-fit p-6">
          <h2 className="mb-4 font-display text-xl font-bold text-gray-900">
            Order Summary
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Subtotal</dt>
              <dd className="font-semibold">${subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Delivery fee</dt>
              <dd className="font-semibold">
                {deliveryFee === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  `$${deliveryFee.toFixed(2)}`
                )}
              </dd>
            </div>
            {deliveryFee > 0 && (
              <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
                Add ${(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)} more for
                free delivery.
              </p>
            )}
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base">
              <dt className="font-bold">Total</dt>
              <dd className="font-extrabold">${total.toFixed(2)}</dd>
            </div>
          </dl>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3">
            <div>
              <label htmlFor="name" className="label">
                Full name
              </label>
              <input
                id="name"
                className="input"
                placeholder="John Doe"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name is too short" },
                })}
              />
              {errors.name && (
                <p className="field-error">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="label">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                className="input"
                placeholder="+1 234 567 890"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[+0-9()\-\s]{7,}$/,
                    message: "Enter a valid phone number",
                  },
                })}
              />
              {errors.phone && (
                <p className="field-error">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="address" className="label">
                Delivery address
              </label>
              <textarea
                id="address"
                rows={2}
                className="input resize-none"
                placeholder="123 Flavor Street, Food City"
                {...register("address", {
                  required: "Delivery address is required",
                })}
              />
              {errors.address && (
                <p className="field-error">{errors.address.message}</p>
              )}
            </div>
            <button type="submit" className="btn-primary w-full">
              Place order · ${total.toFixed(2)}
            </button>
            <Link
              to="/menu"
              className="block text-center text-sm font-semibold text-gray-500 hover:text-brand"
            >
              Continue shopping
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
