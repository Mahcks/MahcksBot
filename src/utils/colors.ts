import { fetchAPI } from ".";

export async function getColorName(hex: string) {
  hex = hex.replace("#", "");
  let res = await fetchAPI("https://api.color.pizza/v1/"+hex);
  return res.colors[0].name
}