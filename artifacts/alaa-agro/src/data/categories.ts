export interface CategoryData {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  descriptionRu: string;
}

export const categories: CategoryData[] = [
  {id:"Grains",name:"Grains",nameRu:"Зерновые",description:"Wheat, barley, oats, corn, buckwheat, millet, sorghum",descriptionRu:"Пшеница, ячмень, овёс, кукуруза, гречиха, просо, сорго"},
  {id:"Pulses",name:"Pulses",nameRu:"Бобовые",description:"Chickpeas, lentils, green peas, yellow peas, spring vetch",descriptionRu:"Нут, чечевица, зелёный горох, жёлтый горох, вика яровая"},
  {id:"Oilseeds",name:"Oilseeds",nameRu:"Масличные",description:"Brown flaxseed, sunflower seeds",descriptionRu:"Коричневый лён, семена подсолнечника"},
  {id:"Seeds",name:"Seeds",nameRu:"Семена",description:"Spring vetch seeds, coriander",descriptionRu:"Вика яровая, кориандр"},
  {id:"Vegetable Oils",name:"Vegetable Oils",nameRu:"Растительные масла",description:"Refined sunflower oil in various packaging formats",descriptionRu:"Рафинированное подсолнечное масло в различных форматах упаковки"}
];
