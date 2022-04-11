import { fetchAPI } from ".";

export async function getColorName(hex: string) {
  hex = hex.replace("#", "");
  let res = await fetchAPI("https://api.color.pizza/v1/"+hex);
  if (res.error) return ""
  return res.data.colors[0].name
}