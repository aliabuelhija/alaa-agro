import type { Locale } from "../i18n";

export interface CategoryData {
  id: string;
  name: string;
  nameRu: string;
  nameAr: string;
  description: string;
  descriptionRu: string;
  descriptionAr: string;
}

export const categories: CategoryData[] = [
  {id:"Grains",name:"Grains",nameRu:"Зерновые",nameAr:"الحبوب",description:"Wheat, barley, oats, corn, buckwheat, millet, sorghum",descriptionRu:"Пшеница, ячмень, овёс, кукуруза, гречиха, просо, сорго",descriptionAr:"القمح، الشعير، الشوفان، الذرة، الحنطة السوداء، الدخن، الذرة الرفيعة"},
  {id:"Pulses",name:"Pulses",nameRu:"Бобовые",nameAr:"البقوليات",description:"Chickpeas, lentils, green peas, yellow peas, spring vetch",descriptionRu:"Нут, чечевица, зелёный горох, жёлтый горох, вика яровая",descriptionAr:"الحمص، العدس، البازلاء الخضراء، البازلاء الصفراء، البيقية الربيعية"},
  {id:"Oilseeds",name:"Oilseeds",nameRu:"Масличные",nameAr:"البذور الزيتية",description:"Brown flaxseed, sunflower seeds",descriptionRu:"Коричневый лён, семена подсолнечника",descriptionAr:"بذر الكتان البني، بذور دوار الشمس"},
  {id:"Seeds",name:"Seeds",nameRu:"Семена",nameAr:"البذور",description:"Spring vetch seeds, coriander",descriptionRu:"Вика яровая, кориандр",descriptionAr:"بذور البيقية الربيعية، الكزبرة"},
  {id:"Vegetable Oils",name:"Vegetable Oils",nameRu:"Растительные масла",nameAr:"الزيوت النباتية",description:"Refined sunflower oil in various packaging formats",descriptionRu:"Рафинированное подсолнечное масло в различных форматах упаковки",descriptionAr:"زيت دوار الشمس المكرر بصيغ تعبئة متعددة"}
];

export function categoryName(c: CategoryData, locale: Locale): string {
  if (locale === "ru") return c.nameRu;
  if (locale === "ar") return c.nameAr;
  return c.name;
}

export function categoryDescription(c: CategoryData, locale: Locale): string {
  if (locale === "ru") return c.descriptionRu;
  if (locale === "ar") return c.descriptionAr;
  return c.description;
}
