import type { ICartItem, IFood } from "../types/food";

export const FOOD_IMAGE_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'>
      <defs>
        <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
          <stop offset='0%' stop-color='#fff7ed'/>
          <stop offset='100%' stop-color='#ffedd5'/>
        </linearGradient>
      </defs>
      <rect width='400' height='300' fill='url(#g)'/>
      <text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle'
        font-family='system-ui,Arial' font-size='48' fill='#ea580c'>🍽️</text>
    </svg>`
  );

export const foodImage = (
  food: Pick<IFood, "images"> | Pick<ICartItem, "images"> | undefined,
  index = 0
): string => {
  if (!food) return FOOD_IMAGE_FALLBACK;
  const images = (food as { images?: string[] }).images;
  if (Array.isArray(images) && typeof images[index] === "string" && images[index].length > 0) {
    return images[index];
  }
  return FOOD_IMAGE_FALLBACK;
};
