import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useGetCartQuery } from "../../redux/api/cartApi";
import { useGetWishlistQuery } from "../../redux/api/wishlistApi";
import { hydrateCartFromServer } from "../../redux/cardSlice";
import { hydrateWishlistFromServer } from "../../redux/wishlistSlice";

const ServerCartWishlistSync: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = !!useAppSelector((state) => state.auth.user);

  const { data: serverCart } = useGetCartQuery(void 0, { skip: !isLoggedIn });
  const { data: serverWishlist } = useGetWishlistQuery(void 0, {
    skip: !isLoggedIn,
  });

  useEffect(() => {
    if (isLoggedIn && serverCart) {
      dispatch(
        hydrateCartFromServer({
          items: serverCart.items.map((ci) => ({
            ...ci.foodId,
            quantity: ci.quantity,
          })),
          couponCode: serverCart.couponCode,
          couponDiscount: serverCart.couponDiscount,
        })
      );
    }
  }, [isLoggedIn, serverCart, dispatch]);

  useEffect(() => {
    if (isLoggedIn && serverWishlist) {
      dispatch(hydrateWishlistFromServer({ foods: serverWishlist.foods }));
    }
  }, [isLoggedIn, serverWishlist, dispatch]);

  return null;
};

export default ServerCartWishlistSync;
