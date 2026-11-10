export type CoffeeOrigin = {
  id: "colombia" | "ethiopia" | "kenya" | "brazil" | "peru" | "nicaragua";
  lat: number;
  lng: number;
  nameKey: "originColombia" | "originEthiopia" | "originKenya" | "originBrazil" | "originPeru" | "originNicaragua";
};

export type GlobeFocusId = CoffeeOrigin["id"] | "jordan";

export const HOUSE_DESTINATION = {
  id: "jordan" as const,
  lat: 31.9454,
  lng: 35.9284,
};

export const COFFEE_ORIGINS: CoffeeOrigin[] = [
  { id: "colombia", lat: 5.03, lng: -75.48, nameKey: "originColombia" },
  { id: "ethiopia", lat: 6.16, lng: 38.2, nameKey: "originEthiopia" },
  { id: "kenya", lat: -0.42, lng: 36.95, nameKey: "originKenya" },
  { id: "brazil", lat: -18.91, lng: -46.52, nameKey: "originBrazil" },
  { id: "peru", lat: -7.16, lng: -78.51, nameKey: "originPeru" },
  { id: "nicaragua", lat: 12.93, lng: -85.92, nameKey: "originNicaragua" },
];
