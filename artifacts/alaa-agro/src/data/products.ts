export interface ProductSpec {
  label: string;
  labelRu: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  nameRu: string;
  slug: string;
  category: "Grains" | "Pulses" | "Oilseeds" | "Seeds" | "Vegetable Oils";
  featured: boolean;
  image: string;
  descriptionEn: string;
  descriptionRu: string;
  applicationEn: string;
  applicationRu: string;
  highlights: string[];
  highlightsRu: string[];
  specs: ProductSpec[];
  packaging: string[];
  seoTitleEn: string;
  seoTitleRu: string;
  seoDescEn: string;
  seoDescRu: string;
}

export const products: Product[] = [
  // ── GRAINS ────────────────────────────────────────────────────────────────
  {
    id: "wheat", name: "Wheat", nameRu: "Пшеница", slug: "wheat", category: "Grains", featured: true,
    image: "products/wheat_2.jpg",
    descriptionEn: "Wheat is a major cereal crop and one of the most important sources of carbohydrates, protein, vitamins and minerals. Widely used in the food industry for the production of flour, cereals, pasta and other products.",
    descriptionRu: "Пшеница — основная зерновая культура и один из важнейших источников углеводов, белка, витаминов и минералов. Широко используется в пищевой промышленности для производства муки, круп, макаронных изделий.",
    applicationEn: "Flour production, bread and bakery, pasta manufacturing, breakfast cereals, animal feed.",
    applicationRu: "Производство муки, хлебобулочных изделий, макаронных изделий, завтраков из злаков, кормов.",
    highlights: ["Protein 11.5–14.0%", "Gluten 23–30%", "Falling number ≥220 sec", "Test weight ≥760 g/l"],
    highlightsRu: ["Белок 11,5–14,0%", "Клейковина 23–30%", "Число падения ≥220 сек", "Натура ≥760 г/л"],
    specs: [
      { label: "Moisture", labelRu: "Влажность", value: "max 12.5%" },
      { label: "Impurities", labelRu: "Примеси", value: "max 1.0%" },
      { label: "Damaged kernels", labelRu: "Повреждённые зёрна", value: "max 1.0%" },
      { label: "Protein content", labelRu: "Содержание белка", value: "11.5–14.0%" },
      { label: "Gluten content", labelRu: "Содержание клейковины", value: "23–30%" },
      { label: "Falling number", labelRu: "Число падения", value: "≥220 sec" },
      { label: "Test weight", labelRu: "Натурная масса", value: "≥760 g/l" },
    ],
    packaging: ["25 kg PP bags", "50 kg PP bags", "Big bags ~1000 kg", "On pallets", "Container loading"],
    seoTitleEn: "Wheat from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Пшеница из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian wheat supplier. Protein 11.5–14%, gluten 23–30%. Flexible packaging. Request a quote.",
    seoDescRu: "Поставщик российской пшеницы. Белок 11,5–14%, клейковина 23–30%. Запросить предложение."
  },
  {
    id: "corn", name: "Corn / Maize", nameRu: "Кукуруза", slug: "corn", category: "Grains", featured: true,
    image: "products/corn_2.jpg",
    descriptionEn: "Corn (maize) is a valuable cereal crop, rich in carbohydrates, protein, fiber, vitamins and minerals. Widely used in food industry, animal feed and for the manufacture of starch, grits and other products.",
    descriptionRu: "Кукуруза — ценная зерновая культура, богатая углеводами, белком, клетчаткой. Применяется в пищевой промышленности, кормопроизводстве и производстве крахмала.",
    applicationEn: "Animal feed, starch production, corn flour, snacks, brewing industry.",
    applicationRu: "Корма, крахмал, кукурузная мука, снеки, пивоварение.",
    highlights: ["Starch 70–72%", "Protein 8–10%", "Test weight ≥720 g/l", "Moisture max 14%"],
    highlightsRu: ["Крахмал 70–72%", "Белок 8–10%", "Натура ≥720 г/л", "Влажность макс. 14%"],
    specs: [
      { label: "Moisture", labelRu: "Влажность", value: "max 14.0%" },
      { label: "Impurities", labelRu: "Примеси", value: "max 1.0%" },
      { label: "Damaged kernels", labelRu: "Повреждённые зёрна", value: "max 1.5%" },
      { label: "Protein content", labelRu: "Содержание белка", value: "8–10%" },
      { label: "Starch content", labelRu: "Содержание крахмала", value: "70–72%" },
      { label: "Test weight", labelRu: "Натурная масса", value: "≥720 g/l" },
    ],
    packaging: ["25 kg PP bags", "50 kg PP bags", "Big bags ~1000 kg", "On pallets", "Container loading"],
    seoTitleEn: "Corn / Maize from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Кукуруза из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian corn/maize supplier. Starch 70–72%. Request quote from ALAA AGRO.",
    seoDescRu: "Поставщик российской кукурузы. Крахмал 70–72%. Запросить предложение."
  },
  {
    id: "barley", name: "Barley", nameRu: "Ячмень", slug: "barley", category: "Grains", featured: false,
    image: "products/barley_2.jpg",
    descriptionEn: "Barley is a valuable cereal crop rich in fiber, protein, B vitamins and minerals (phosphorus, magnesium, potassium, iron). Widely used in food production, animal feed and the brewing industry.",
    descriptionRu: "Ячмень — ценная зерновая культура, богатая клетчаткой, белком, витаминами B и минералами (фосфор, магний, калий, железо). Используется в пищевой промышленности, кормопроизводстве и пивоварении.",
    applicationEn: "Pearl barley, groats, flour, brewing industry, animal feed.",
    applicationRu: "Перловая крупа, мука, пивоварение, корма.",
    highlights: ["Protein 9–12%", "Fiber 5–7%", "Test weight ≥620 g/l", "Moisture max 13%"],
    highlightsRu: ["Белок 9–12%", "Клетчатка 5–7%", "Натура ≥620 г/л", "Влажность макс. 13%"],
    specs: [
      { label: "Moisture", labelRu: "Влажность", value: "max 13.0%" },
      { label: "Impurities", labelRu: "Примеси", value: "max 1.0%" },
      { label: "Damaged kernels", labelRu: "Повреждённые зёрна", value: "max 1.0%" },
      { label: "Protein content", labelRu: "Содержание белка", value: "9–12%" },
      { label: "Fiber content", labelRu: "Содержание клетчатки", value: "5–7%" },
      { label: "Test weight", labelRu: "Натурная масса", value: "≥620 g/l" },
    ],
    packaging: ["25 kg PP bags", "50 kg PP bags", "Big bags ~1000 kg", "On pallets", "Container loading"],
    seoTitleEn: "Barley from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Ячмень из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian barley supplier. Protein 9–12%. Request quote.",
    seoDescRu: "Поставщик российского ячменя. Белок 9–12%. Запросить предложение."
  },
  {
    id: "oats", name: "Oats", nameRu: "Овёс", slug: "oats", category: "Grains", featured: false,
    image: "products/oats_2.jpg",
    descriptionEn: "Oats are a nutritious cereal rich in fiber, protein, B vitamins and minerals. Used in the food industry for the production of oatmeal, flour, cereals, as well as in the feed industry.",
    descriptionRu: "Овёс — питательная зерновая культура, богатая клетчаткой, белком, витаминами B. Используется для производства хлопьев, муки, круп и кормов.",
    applicationEn: "Oatmeal, flour, breakfast cereals, health foods, animal feed.",
    applicationRu: "Овсяные хлопья, мука, завтраки, здоровое питание, корма.",
    highlights: ["Fiber 8–10%", "Protein 11–13%", "Test weight ≥450 g/l", "Beta-glucan rich"],
    highlightsRu: ["Клетчатка 8–10%", "Белок 11–13%", "Натура ≥450 г/л", "Богат бета-глюканом"],
    specs: [
      { label: "Moisture", labelRu: "Влажность", value: "max 12.0%" },
      { label: "Impurities", labelRu: "Примеси", value: "max 1.0%" },
      { label: "Damaged kernels", labelRu: "Повреждённые зёрна", value: "max 1.0%" },
      { label: "Protein content", labelRu: "Содержание белка", value: "11–13%" },
      { label: "Fiber content", labelRu: "Содержание клетчатки", value: "8–10%" },
      { label: "Test weight", labelRu: "Натурная масса", value: "≥450 g/l" },
    ],
    packaging: ["25 kg PP bags", "50 kg PP bags", "Big bags ~1000 kg", "On pallets", "Container loading"],
    seoTitleEn: "Oats from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Овёс из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian oats supplier. Fiber 8–10%. Request quote.",
    seoDescRu: "Поставщик российского овса. Клетчатка 8–10%. Запросить предложение."
  },
  {
    id: "buckwheat", name: "Buckwheat", nameRu: "Гречиха", slug: "buckwheat", category: "Grains", featured: false,
    image: "products/buckwheat_2.jpg",
    descriptionEn: "Buckwheat is a nutritious pseudocereal rich in protein, fiber, B vitamins, iron, magnesium and other minerals. Widely used for groats, flour, flakes and other healthy food products.",
    descriptionRu: "Гречиха — питательная культура, богатая белком, клетчаткой, витаминами B, железом и магнием. Используется для производства круп, муки, хлопьев и других продуктов здорового питания.",
    applicationEn: "Groats, flour, flakes, health foods, baby food.",
    applicationRu: "Крупа, мука, хлопья, здоровое питание, детское питание.",
    highlights: ["Protein 11–14%", "Fiber 6–8%", "Test weight ≥650 g/l", "Gluten-free"],
    highlightsRu: ["Белок 11–14%", "Клетчатка 6–8%", "Натура ≥650 г/л", "Без глютена"],
    specs: [
      { label: "Moisture", labelRu: "Влажность", value: "max 13.0%" },
      { label: "Impurities", labelRu: "Примеси", value: "max 1.0%" },
      { label: "Damaged kernels", labelRu: "Повреждённые зёрна", value: "max 1.0%" },
      { label: "Protein content", labelRu: "Содержание белка", value: "11–14%" },
      { label: "Fiber content", labelRu: "Содержание клетчатки", value: "6–8%" },
      { label: "Test weight", labelRu: "Натурная масса", value: "≥650 g/l" },
    ],
    packaging: ["25 kg PP bags", "50 kg PP bags", "Big bags ~1000 kg", "On pallets", "Container loading"],
    seoTitleEn: "Buckwheat from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Гречиха из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian buckwheat supplier. Protein 11–14%. Request quote.",
    seoDescRu: "Поставщик российской гречихи. Белок 11–14%. Запросить предложение."
  },
  {
    id: "millet", name: "Millet", nameRu: "Просо", slug: "millet", category: "Grains", featured: false,
    image: "products/millet_2.jpg",
    descriptionEn: "Millet is a valuable cereal crop rich in carbohydrates, protein, B vitamins, magnesium, phosphorus, iron and other minerals. Used for groats, flakes, baby food and animal feed.",
    descriptionRu: "Просо — ценная зерновая культура, богатая углеводами, белком, витаминами B, магнием, фосфором и железом. Используется для крупы, хлопьев, детского питания и кормов.",
    applicationEn: "Millet groats, flakes, baby food, animal feed.",
    applicationRu: "Пшённая крупа, хлопья, детское питание, корма.",
    highlights: ["Protein 10–12%", "Fiber 3–6%", "Test weight ≥650 g/l", "Moisture max 13%"],
    highlightsRu: ["Белок 10–12%", "Клетчатка 3–6%", "Натура ≥650 г/л", "Влажность макс. 13%"],
    specs: [
      { label: "Moisture", labelRu: "Влажность", value: "max 13.0%" },
      { label: "Impurities", labelRu: "Примеси", value: "max 1.0%" },
      { label: "Damaged seeds", labelRu: "Повреждённые семена", value: "max 1.0%" },
      { label: "Protein content", labelRu: "Содержание белка", value: "10–12%" },
      { label: "Fiber content", labelRu: "Содержание клетчатки", value: "3–6%" },
      { label: "Test weight", labelRu: "Натурная масса", value: "≥650 g/l" },
    ],
    packaging: ["25 kg PP bags", "50 kg PP bags", "Big bags ~1000 kg", "On pallets", "Container loading"],
    seoTitleEn: "Millet from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Просо из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian millet supplier. Protein 10–12%. Request quote.",
    seoDescRu: "Поставщик российского проса. Белок 10–12%. Запросить предложение."
  },
  {
    id: "sorghum", name: "Sorghum", nameRu: "Сорго", slug: "sorghum", category: "Grains", featured: false,
    image: "products/sorghum_2.jpg",
    descriptionEn: "Sorghum is a valuable cereal crop resistant to drought and high temperatures, rich in carbohydrates, protein, fiber, iron, phosphorus and magnesium. Used for groats, flour, flakes and animal feed.",
    descriptionRu: "Сорго — ценная зерновая культура, устойчивая к засухе и высоким температурам, богатая углеводами, белком, клетчаткой, железом, фосфором и магнием.",
    applicationEn: "Groats, flour, flakes, animal feed, brewing.",
    applicationRu: "Крупа, мука, хлопья, корма, пивоварение.",
    highlights: ["Protein 8–12%", "Fiber 2–5%", "Test weight ≥680 g/l", "Drought-resistant crop"],
    highlightsRu: ["Белок 8–12%", "Клетчатка 2–5%", "Натура ≥680 г/л", "Засухоустойчивая культура"],
    specs: [
      { label: "Moisture", labelRu: "Влажность", value: "max 13.0%" },
      { label: "Impurities", labelRu: "Примеси", value: "max 1.0%" },
      { label: "Damaged seeds", labelRu: "Повреждённые семена", value: "max 1.0%" },
      { label: "Protein content", labelRu: "Содержание белка", value: "8–12%" },
      { label: "Fiber content", labelRu: "Содержание клетчатки", value: "2–5%" },
      { label: "Test weight", labelRu: "Натурная масса", value: "≥680 g/l" },
    ],
    packaging: ["25 kg PP bags", "50 kg PP bags", "Big bags ~1000 kg", "On pallets", "Container loading"],
    seoTitleEn: "Sorghum from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Сорго из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian sorghum supplier. Protein 8–12%. Request quote.",
    seoDescRu: "Поставщик российского сорго. Белок 8–12%. Запросить предложение."
  },

  // ── PULSES ────────────────────────────────────────────────────────────────
  {
    id: "chickpeas", name: "Chickpeas", nameRu: "Нут", slug: "chickpeas", category: "Pulses", featured: true,
    image: "products/chickpeas_2.jpg",
    descriptionEn: "Chickpeas are a valuable source of vegetable protein, fiber, vitamins and minerals. Widely used in the food industry, animal feed production and healthy nutrition.",
    descriptionRu: "Нут — ценный источник растительного белка, клетчатки, витаминов и минералов. Широко используется в пищевой промышленности, кормопроизводстве и здоровом питании.",
    applicationEn: "Hummus, canned legumes, flour production, snacks, animal feed.",
    applicationRu: "Хумус, консервированные бобовые, производство муки, снеки, корма.",
    highlights: ["Protein 18–22%", "Seed size 6–10 mm", "Moisture max 12%", "Export quality"],
    highlightsRu: ["Белок 18–22%", "Размер семян 6–10 мм", "Влажность макс. 12%", "Экспортное качество"],
    specs: [
      { label: "Seed size", labelRu: "Размер семян", value: "6–10 mm" },
      { label: "Moisture", labelRu: "Влажность", value: "max 12.0%" },
      { label: "Impurities", labelRu: "Примеси", value: "max 1.0%" },
      { label: "Damaged seeds", labelRu: "Повреждённые семена", value: "max 1.0%" },
      { label: "Protein content", labelRu: "Содержание белка", value: "18–22%" },
    ],
    packaging: ["25 kg PP bags", "50 kg PP bags", "Big bags ~1000 kg", "On pallets", "Container loading"],
    seoTitleEn: "Chickpeas from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Нут из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian chickpeas supplier. Protein 18–22%, seed size 6–10 mm. Request quote.",
    seoDescRu: "Поставщик российского нута. Белок 18–22%, размер семян 6–10 мм. Запросить предложение."
  },
  {
    id: "lentils", name: "Lentils", nameRu: "Чечевица", slug: "lentils", category: "Pulses", featured: true,
    image: "products/lentils_2.jpg",
    descriptionEn: "Lentils are a nutritious and environmentally friendly pulse, rich in protein, iron, fiber and essential minerals. We carefully select the best varieties to ensure consistent quality and excellent taste.",
    descriptionRu: "Чечевица — питательная и экологически чистая бобовая культура, богатая белком, железом, клетчаткой и микроэлементами. Тщательно отбираем лучшие сорта для стабильного качества.",
    applicationEn: "Soups, canned food, flour production, health foods, ready meals.",
    applicationRu: "Супы, консервы, мука, продукты здорового питания, готовые блюда.",
    highlights: ["Protein 20–26%", "Seed size 3–8 mm", "Moisture max 12%", "Rich in iron"],
    highlightsRu: ["Белок 20–26%", "Размер семян 3–8 мм", "Влажность макс. 12%", "Богата железом"],
    specs: [
      { label: "Seed size", labelRu: "Размер семян", value: "3–8 mm" },
      { label: "Moisture", labelRu: "Влажность", value: "max 12.0%" },
      { label: "Impurities", labelRu: "Примеси", value: "max 1.0%" },
      { label: "Damaged seeds", labelRu: "Повреждённые семена", value: "max 1.0%" },
      { label: "Protein content", labelRu: "Содержание белка", value: "20–26%" },
    ],
    packaging: ["25 kg PP bags", "50 kg PP bags", "Big bags ~1000 kg", "On pallets", "Container loading"],
    seoTitleEn: "Lentils from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Чечевица из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian lentils supplier. Protein 20–26%. Request quote from ALAA AGRO.",
    seoDescRu: "Поставщик российской чечевицы. Белок 20–26%. Запросить предложение."
  },
  {
    id: "peas", name: "Green Peas", nameRu: "Горох зелёный", slug: "peas", category: "Pulses", featured: false,
    image: "products/peas_2.jpg",
    descriptionEn: "Peas are a valuable source of plant protein, fiber, vitamins and minerals. Widely used in the food industry, animal feed production and healthy nutrition.",
    descriptionRu: "Горох — ценный источник растительного белка, клетчатки, витаминов и минералов. Применяется в пищевой промышленности и кормопроизводстве.",
    applicationEn: "Canned peas, soups, flour, health foods, animal feed.",
    applicationRu: "Консервированный горох, супы, мука, здоровое питание, корма.",
    highlights: ["Protein 20–24%", "Seed size 4–10 mm", "Fiber 4–6%", "Moisture max 12%"],
    highlightsRu: ["Белок 20–24%", "Размер семян 4–10 мм", "Клетчатка 4–6%", "Влажность макс. 12%"],
    specs: [
      { label: "Seed size", labelRu: "Размер семян", value: "4–10 mm" },
      { label: "Moisture", labelRu: "Влажность", value: "max 12.0%" },
      { label: "Impurities", labelRu: "Примеси", value: "max 1.0%" },
      { label: "Damaged seeds", labelRu: "Повреждённые семена", value: "max 1.0%" },
      { label: "Protein content", labelRu: "Содержание белка", value: "20–24%" },
      { label: "Fiber content", labelRu: "Содержание клетчатки", value: "4–6%" },
    ],
    packaging: ["25 kg PP bags", "50 kg PP bags", "Big bags ~1000 kg", "On pallets", "Container loading"],
    seoTitleEn: "Green Peas from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Горох зелёный из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian green peas supplier. Protein 20–24%. Request quote.",
    seoDescRu: "Поставщик российского зелёного гороха. Белок 20–24%. Запросить предложение."
  },
  {
    id: "yellow-peas", name: "Yellow Peas", nameRu: "Горох жёлтый", slug: "yellow-peas", category: "Pulses", featured: false,
    image: "products/yellow-peas_2.jpg",
    descriptionEn: "Yellow peas are a valuable legume crop rich in plant protein, fiber, B vitamins, iron, phosphorus, potassium and other minerals. Widely used for groats, flour, puree, canned food and animal feed.",
    descriptionRu: "Горох жёлтый — ценная зернобобовая культура, богатая растительным белком, клетчаткой, витаминами B, железом, фосфором и калием.",
    applicationEn: "Groats, flour, puree, canned food, animal feed, healthy nutrition.",
    applicationRu: "Крупа, мука, пюре, консервы, корма, здоровое питание.",
    highlights: ["Protein 20–24%", "Fiber 4–6%", "Test weight ≥750 g/l", "Moisture max 13%"],
    highlightsRu: ["Белок 20–24%", "Клетчатка 4–6%", "Натура ≥750 г/л", "Влажность макс. 13%"],
    specs: [
      { label: "Moisture", labelRu: "Влажность", value: "max 13.0%" },
      { label: "Impurities", labelRu: "Примеси", value: "max 1.0%" },
      { label: "Damaged seeds", labelRu: "Повреждённые семена", value: "max 1.0%" },
      { label: "Protein content", labelRu: "Содержание белка", value: "20–24%" },
      { label: "Fiber content", labelRu: "Содержание клетчатки", value: "4–6%" },
      { label: "Test weight", labelRu: "Натурная масса", value: "≥750 g/l" },
    ],
    packaging: ["25 kg PP bags", "50 kg PP bags", "Big bags ~1000 kg", "On pallets", "Container loading"],
    seoTitleEn: "Yellow Peas from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Горох жёлтый из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian yellow peas supplier. Protein 20–24%. Request quote.",
    seoDescRu: "Поставщик российского жёлтого гороха. Белок 20–24%. Запросить предложение."
  },

  // ── OILSEEDS ──────────────────────────────────────────────────────────────
  {
    id: "brown-flaxseed", name: "Brown Flaxseed", nameRu: "Лён коричневый", slug: "brown-flaxseed", category: "Oilseeds", featured: true,
    image: "products/brown-flaxseed_2.jpg",
    descriptionEn: "Brown flaxseed is a valuable oilseed crop rich in omega-3 fatty acids, protein, fiber, lignans and vitamins B, E, K. Used for flaxseed oil, flour, bakery products, cereals and animal feed.",
    descriptionRu: "Лён коричневый — ценная масличная культура, богатая омега-3 жирными кислотами, белком, клетчаткой, лигнанами и витаминами B, E, K.",
    applicationEn: "Flaxseed oil production, bakery, health foods, cereals, animal feed.",
    applicationRu: "Льняное масло, хлебобулочные изделия, здоровое питание, каши, корма.",
    highlights: ["Oil content 38–45%", "Omega-3 rich", "Protein 18–25%", "Moisture max 10%"],
    highlightsRu: ["Масличность 38–45%", "Богато омега-3", "Белок 18–25%", "Влажность макс. 10%"],
    specs: [
      { label: "Moisture", labelRu: "Влажность", value: "max 10.0%" },
      { label: "Impurities", labelRu: "Примеси", value: "max 1.0%" },
      { label: "Damaged seeds", labelRu: "Повреждённые семена", value: "max 1.0%" },
      { label: "Oil content", labelRu: "Масличность", value: "38–45%" },
      { label: "Protein content", labelRu: "Содержание белка", value: "18–25%" },
      { label: "Fiber content", labelRu: "Содержание клетчатки", value: "22–28%" },
      { label: "Test weight", labelRu: "Натурная масса", value: "≥650 g/l" },
    ],
    packaging: ["25 kg PP bags", "50 kg PP bags", "Big bags ~1000 kg", "On pallets", "Container loading"],
    seoTitleEn: "Brown Flaxseed from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Лён коричневый из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian brown flaxseed supplier. Oil 38–45%, omega-3 rich. Request quote.",
    seoDescRu: "Поставщик коричневого льна. Масличность 38–45%, богат омега-3. Запросить предложение."
  },
  {
    id: "sunflower-seeds", name: "Sunflower Seeds", nameRu: "Семена подсолнечника", slug: "sunflower-seeds", category: "Oilseeds", featured: false,
    image: "products/sunflower-seeds_2.jpg",
    descriptionEn: "Sunflower seeds are a leading oilseed crop, rich in oil, protein, vitamin E and minerals. Used for oil extraction, confectionery and animal feed.",
    descriptionRu: "Семена подсолнечника — ведущая масличная культура, богатая маслом, белком, витамином E и минералами. Используется для производства масла, кондитерских изделий и кормов.",
    applicationEn: "Oil extraction, confectionery, snacks, animal feed, food industry.",
    applicationRu: "Производство масла, кондитерские изделия, снеки, корма, пищевая промышленность.",
    highlights: ["Oil content 40–50%", "Protein 16–20%", "Moisture max 8%", "Vitamin E rich"],
    highlightsRu: ["Масличность 40–50%", "Белок 16–20%", "Влажность макс. 8%", "Богато витамином E"],
    specs: [
      { label: "Moisture", labelRu: "Влажность", value: "max 8.0%" },
      { label: "Impurities", labelRu: "Примеси", value: "max 1.0%" },
      { label: "Damaged seeds", labelRu: "Повреждённые семена", value: "max 1.0%" },
      { label: "Oil content", labelRu: "Масличность", value: "40–50%" },
      { label: "Protein content", labelRu: "Содержание белка", value: "16–20%" },
    ],
    packaging: ["25 kg PP bags", "50 kg PP bags", "Big bags ~1000 kg", "On pallets", "Container loading"],
    seoTitleEn: "Sunflower Seeds from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Семена подсолнечника из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian sunflower seeds supplier. Oil 40–50%. Request quote.",
    seoDescRu: "Поставщик семян подсолнечника. Масличность 40–50%. Запросить предложение."
  },

  // ── SEEDS ─────────────────────────────────────────────────────────────────
  {
    id: "spring-vetch", name: "Spring Vetch", nameRu: "Вика яровая", slug: "spring-vetch", category: "Seeds", featured: false,
    image: "products/spring-vetch_2.jpg",
    descriptionEn: "Spring vetch seeds are a valuable legume crop rich in plant protein, fiber, B vitamins, calcium, phosphorus and iron. Used in the food industry for groats, flour, feed and as green manure for soil improvement.",
    descriptionRu: "Вика яровая — ценная зернобобовая культура, богатая растительным белком, клетчаткой, витаминами B, кальцием, фосфором и железом. Используется в кормопроизводстве и как сидерат.",
    applicationEn: "Animal feed, green manure, soil improvement, groats, flour.",
    applicationRu: "Корма, сидерат, улучшение почвы, крупа, мука.",
    highlights: ["Protein 24–30%", "Fiber 4–7%", "Test weight ≥700 g/l", "Moisture max 13%"],
    highlightsRu: ["Белок 24–30%", "Клетчатка 4–7%", "Натура ≥700 г/л", "Влажность макс. 13%"],
    specs: [
      { label: "Moisture", labelRu: "Влажность", value: "max 13.0%" },
      { label: "Impurities", labelRu: "Примеси", value: "max 1.0%" },
      { label: "Damaged seeds", labelRu: "Повреждённые семена", value: "max 1.0%" },
      { label: "Protein content", labelRu: "Содержание белка", value: "24–30%" },
      { label: "Fiber content", labelRu: "Содержание клетчатки", value: "4–7%" },
      { label: "Test weight", labelRu: "Натурная масса", value: "≥700 g/l" },
    ],
    packaging: ["25 kg PP bags", "50 kg PP bags", "Big bags ~1000 kg", "On pallets", "Container loading"],
    seoTitleEn: "Spring Vetch Seeds from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Вика яровая из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian spring vetch seeds supplier. Protein 24–30%. Request quote.",
    seoDescRu: "Поставщик вики яровой из России. Белок 24–30%. Запросить предложение."
  },
  {
    id: "coriander", name: "Coriander", nameRu: "Кориандр", slug: "coriander", category: "Seeds", featured: false,
    image: "products/coriander_2.jpg",
    descriptionEn: "Coriander seeds are an aromatic spice used in the food industry, perfumery and essential oil production. Supplied as whole seeds, carefully cleaned and sorted.",
    descriptionRu: "Кориандр — ароматное пряное семя, используемое в пищевой промышленности, парфюмерии и производстве эфирных масел. Поставляется целыми семенами.",
    applicationEn: "Spice industry, perfumery, essential oil production, food flavoring.",
    applicationRu: "Пряная промышленность, парфюмерия, производство эфирных масел, ароматизация пищи.",
    highlights: ["Essential oil 0.5–1.2%", "Moisture max 10%", "Whole seeds", "Export quality"],
    highlightsRu: ["Эфирное масло 0,5–1,2%", "Влажность макс. 10%", "Целые семена", "Экспортное качество"],
    specs: [
      { label: "Moisture", labelRu: "Влажность", value: "max 10.0%" },
      { label: "Impurities", labelRu: "Примеси", value: "max 1.5%" },
      { label: "Essential oil content", labelRu: "Содержание эфирного масла", value: "0.5–1.2%" },
    ],
    packaging: ["25 kg PP bags", "50 kg PP bags", "Big bags ~1000 kg", "On pallets", "Container loading"],
    seoTitleEn: "Coriander Seeds from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Кориандр из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian coriander supplier. Whole seeds, export quality. Request quote.",
    seoDescRu: "Поставщик российского кориандра. Целые семена. Запросить предложение."
  },

  // ── VEGETABLE OILS ────────────────────────────────────────────────────────
  {
    id: "sunflower-oil", name: "Sunflower Oil", nameRu: "Подсолнечное масло", slug: "sunflower-oil", category: "Vegetable Oils", featured: true,
    image: "products/sunflower-oil_2.jpg",
    descriptionEn: "Sunflower oil is a natural high-quality product made from selected sunflower seeds by pressing and refining. Rich in vitamin E, Omega-6 fatty acids and antioxidants. Widely used in the food industry, cooking and retail trade.",
    descriptionRu: "Подсолнечное масло — натуральный высококачественный продукт из отборных семян подсолнечника. Богато витамином E, омега-6 и антиоксидантами.",
    applicationEn: "Cooking oil, food industry, retail, food service, bulk export.",
    applicationRu: "Кулинарное масло, пищевая промышленность, розница, общепит, оптовый экспорт.",
    highlights: ["Acid value max 0.6 mg KOH/g", "Iodine value 110–145", "Multiple packaging formats", "100% natural product"],
    highlightsRu: ["Кислотное число макс. 0,6 мг КОН/г", "Иодное число 110–145", "Различные форматы упаковки", "100% натуральный продукт"],
    specs: [
      { label: "Acid value", labelRu: "Кислотное число", value: "max 0.6 mg KOH/g" },
      { label: "Peroxide value", labelRu: "Перекисное число", value: "max 10 meq O₂/kg" },
      { label: "Iodine value", labelRu: "Иодное число", value: "110–145 g I₂/100g" },
      { label: "Moisture & volatiles", labelRu: "Влага и летучие", value: "≤0.1%" },
      { label: "Insoluble impurities", labelRu: "Нерастворимые примеси", value: "≤0.05%" },
      { label: "Color (Lovibond)", labelRu: "Цвет (Ловибонд)", value: "≤2.0R 20Y" },
    ],
    packaging: ["1 L PET bottles", "5 L PET bottles", "3×5 L cartons", "4×5 L cartons", "10 L plastic cans", "20 L plastic cans", "1000 L IBC tanks"],
    seoTitleEn: "Sunflower Oil from Russia | ALAA AGRO TRADE LLC",
    seoTitleRu: "Подсолнечное масло из России | ALAA AGRO TRADE LLC",
    seoDescEn: "Russian sunflower oil supplier. Food-grade quality, multiple packaging. Request quote.",
    seoDescRu: "Поставщик российского подсолнечного масла. Пищевое качество, различная упаковка. Запросить предложение."
  },
];
