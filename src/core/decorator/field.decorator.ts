import { Property, PropertyOptions } from "@mikro-orm/core";

export function TextProperty(options: PropertyOptions<{}> = {}) {
  return Property({ type: "text", ...options });
}
