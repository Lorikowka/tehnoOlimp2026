export interface ConcreteClass {
  id: string;
  label: string;
  strengthMPa: number;
  description: string;
  application: string;
  watermark: string;
  frostResistance: string;
  curingTime: string;
  strengthGainTime: string;
  standardCuringConditions: string;
  fireResistance: string;
  comparisonData: ComparisonItem[];
  cardInfo: string;
  detailedInfo: string;
  composition: string;
  recommendedUse: string;
  limitations: string;
}

export interface ComparisonItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  value: number;
  unit: string;
  calculation: string;
}

import concretePhysicsData from './concretePhysics.json';

export interface ConcretePhysics {
  densityKgM3: number;
  elasticityGPa: number;
  fractureSensitivity: number;
  fragmentCount: number;
  velocityFactor: number;
  internalColor: number;
}

export const concretePhysics: Record<string, ConcretePhysics> = concretePhysicsData;

export const concreteClasses: ConcreteClass[] = [
  {
    id: "b7.5",
    label: "B7.5",
    strengthMPa: 9.8,
    description: "Подготовительные работы, подбетонка",
    application: "Подготовка основания под фундаменты, устройство подбетонок, дорожек в саду",
    watermark: "W2",
    frostResistance: "F50",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 60",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 6.5, unit: "шт", calculation: "9.8*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 1000, unit: "м", calculation: "9.8*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Легкий бетон для подготовительных работ. Не несет конструктивной нагрузки.",
    detailedInfo: "Бетон класса B7.5 - самый низкий класс прочности. Применяется исключительно для подготовительных работ: устройство подбетонки под основные фундаменты, выравнивание основания, создание несущих подушек. Не рекомендуется для несущих конструкций.",
    composition: "Цемент М200, песок, щебень фракции 20-40мм. Вода-цементное отношение 0.7-0.8.",
    recommendedUse: "Подбетонка, выравнивание оснований, временные дорожки",
    limitations: "Запрещено использование в несущих конструкциях и фундаментах зданий"
  },
  {
    id: "b10",
    label: "B10",
    strengthMPa: 13.1,
    description: "Подушки под фундаменты, стяжки полов",
    application: "Ненесущие конструкции, подушки под фундаменты, стяжки полов",
    watermark: "W2",
    frostResistance: "F50",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 60",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 8.7, unit: "шт", calculation: "13.1*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 1337, unit: "м", calculation: "13.1*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Бетон для подготовительных работ и ненесущих конструкций.",
    detailedInfo: "Бетон B10 используется для устройства подготовительных слоев под основные фундаменты, стяжек полов в помещениях с небольшой нагрузкой. Допускается применение для дорожек и площадок без интенсивного движения транспорта.",
    composition: "Цемент М300, песок, щебень. Вода-цементное отношение 0.65-0.75.",
    recommendedUse: "Стяжки полов, подбетонка, отмостки, садовые дорожки",
    limitations: "Не подходит для фундаментов жилых зданий"
  },
  {
    id: "b12.5",
    label: "B12.5",
    strengthMPa: 16.4,
    description: "Стяжки полов, мелкие фундаменты",
    application: "Стяжки полов, мелкие фундаменты, дорожки, отмостки",
    watermark: "W2-W4",
    frostResistance: "F50-F75",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 60",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 10.9, unit: "шт", calculation: "16.4*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 1673, unit: "м", calculation: "16.4*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Подходит для стяжек полов и мелких фундаментов.",
    detailedInfo: "Универсальный бетон для малонагруженных конструкций. Подходит для индивидуальных застройщиков при строительстве небольших хозяйственных построек, беседок, заборов. Может использоваться для фундаментов одноэтажных легких строений.",
    composition: "Цемент М400, песок, щебень фракции 5-20мм. Вода-цементное отношение 0.6-0.7.",
    recommendedUse: "Фундаменты хозпостроек, стяжки, отмостки, небольшие площадки",
    limitations: "Ограниченное применение для жилых зданий высотой более 1 этажа"
  },
  {
    id: "b15",
    label: "B15",
    strengthMPa: 19.6,
    description: "Фундаменты малоэтажных зданий, стяжки",
    application: "Фундаменты малоэтажных зданий, стяжки полов, лестничные ступени",
    watermark: "W2-W4",
    frostResistance: "F75-F100",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 90",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 13.1, unit: "шт", calculation: "19.6*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 2000, unit: "м", calculation: "19.6*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Самый распространенный класс для частного строительства.",
    detailedInfo: "Наиболее востребованный класс бетона для индивидуального строительства. Подходит для фундаментов домов до 3 этажей, полов, лестниц. Обеспечивает достаточную прочность при разумной стоимости.",
    composition: "Цемент М400-М500, песок, щебень. Вода-цементное отношение 0.55-0.65.",
    recommendedUse: "Фундаменты домов до 3 этажей, полы, лестницы, стены подвалов",
    limitations: "Для высотного строительства требуется более высокий класс"
  },
  {
    id: "b20",
    label: "B20",
    strengthMPa: 26.2,
    description: "Фундаменты, колонны, балки",
    application: "Фундаменты, колонны, балки, плиты перекрытия многоэтажных зданий",
    watermark: "W4-W6",
    frostResistance: "F100-F150",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 90",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 17.5, unit: "шт", calculation: "26.2*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 2673, unit: "м", calculation: "26.2*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Для фундаментов, колонн и балок в многоэтажном строительстве.",
    detailedInfo: "Бетон для ответственных несущих конструкций. Применяется в многоэтажном жилищном строительстве, промышленном строительстве. Подходит для фундаментов, колонн, балок, ригелей, плит перекрытия.",
    composition: "Цемент М500, песок, щебень фракции 5-20мм. Вода-цементное отношение 0.5-0.6.",
    recommendedUse: "Фундаменты, колонны, балки, плиты перекрытия до 5 этажей",
    limitations: "Для агрессивных сред требуется повышение водонепроницаемости"
  },
  {
    id: "b22.5",
    label: "B22.5",
    strengthMPa: 29.5,
    description: "Фундаменты, несущие конструкции",
    application: "Фундаменты, несущие конструкции, плиты перекрытия, дорожные покрытия",
    watermark: "W4-W6",
    frostResistance: "F100-F150",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 90",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 19.7, unit: "шт", calculation: "29.5*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 3010, unit: "м", calculation: "29.5*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Универсальный бетон для несущих конструкций.",
    detailedInfo: "Переходный класс между обычным и высокопрочным бетоном. Используется для ответственных конструкций с повышенными требованиями к прочности: фундаменты под оборудование, дорожные покрытия промышленного назначения.",
    composition: "Цемент М500, песок, щебень фракции 5-20мм. Вода-цементное отношение 0.45-0.55.",
    recommendedUse: "Фундаменты под оборудование, дорожные плиты, несущие стены",
    limitations: "При высокой влажности среды требуется гидроизоляция"
  },
  {
    id: "b25",
    label: "B25",
    strengthMPa: 32.9,
    description: "Фундаменты малоэтажных зданий",
    application: "Фундаменты малоэтажных зданий, плиты перекрытия, лестничные марши, колонны",
    watermark: "W4-W8",
    frostResistance: "F150-F200",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 120",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 21.9, unit: "шт", calculation: "32.9*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 3357, unit: "м", calculation: "32.9*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Оптимальный выбор для фундаментов и перекрытий.",
    detailedInfo: "Один из самых популярных классов бетона. Идеально подходит для строительства фундаментов, колонн, балок и плит перекрытия в жилищном и коммерческом строительстве. Обеспечивает хороший баланс между прочностью и стоимостью.",
    composition: "Цемент М500, песок, щебень фракции 5-20мм. Вода-цементное отношение 0.4-0.5. Возможно добавление пластификаторов.",
    recommendedUse: "Фундаменты, колонны, балки, плиты перекрытия, лестничные марши",
    limitations: "Для гидротехнических сооружений требуется дополнительная защита"
  },
  {
    id: "b27.5",
    label: "B27.5",
    strengthMPa: 36.2,
    description: "Несущие конструкции, мосты",
    application: "Несущие конструкции, мосты, плиты перекрытия, дорожные плиты",
    watermark: "W6-W8",
    frostResistance: "F150-F200",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 120",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 24.1, unit: "шт", calculation: "36.2*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 3694, unit: "м", calculation: "36.2*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Для мостов и ответственных несущих конструкций.",
    detailedInfo: "Высококачественный бетон для мостовых конструкций, дорожных плит с интенсивной нагрузкой. Применяется в инфраструктурном строительстве: мосты, путепроводы, эстакады.",
    composition: "Цемент М500-М600, песок, щебень фракции 5-20мм. Вода-цементное отношение 0.4-0.5. Пластификаторы обязательны.",
    recommendedUse: "Мосты, путепроводы, дорожные плиты, эстакады",
    limitations: "Требует квалифицированного контроля качества при производстве"
  },
  {
    id: "b30",
    label: "B30",
    strengthMPa: 39.3,
    description: "Мосты, гидротехнические сооружения",
    application: "Мосты, гидротехнические сооружения, колонны, ригели, плиты перекрытия",
    watermark: "W6-W10",
    frostResistance: "F200-F300",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 120",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 26.2, unit: "шт", calculation: "39.3*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 4010, unit: "м", calculation: "39.3*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Высокопрочный бетон для мостов и ГТС.",
    detailedInfo: "Бетон для ответственных инженерных сооружений с высокими требованиями к прочности, водонепроницаемости и морозостойкости. Применяется при строительстве мостов, плотин, гидротехнических сооружений.",
    composition: "Цемент М600, песок, щебень высокопрочный. Вода-цементное отношение 0.35-0.45. Обязательны пластификаторы и добавки.",
    recommendedUse: "Мосты, плотины, ГТС, колонны высотных зданий",
    limitations: "Сложная рецептура, требуется лабораторный контроль"
  },
  {
    id: "b35",
    label: "B35",
    strengthMPa: 45.9,
    description: "Мосты, метро, бассейны",
    application: "Мосты, метрополитен, бассейны, фундаменты высотных зданий",
    watermark: "W8-W12",
    frostResistance: "F200-F300",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 150",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 30.6, unit: "шт", calculation: "45.9*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 4684, unit: "м", calculation: "45.9*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Для метрополитена, бассейнов и высотных зданий.",
    detailedInfo: "Высокопрочный бетон для сложных условий эксплуатации. Метрополитен, бассейны, фундаменты высотных зданий. Отличается высокой водонепроницаемостью и морозостойкостью.",
    composition: "Цемент М600, высокопрочный щебень, песок. Вода-цементное отношение 0.35-0.4. Пластификаторы и воздухововлекающие добавки.",
    recommendedUse: "Метро, бассейны, фундаменты высотных зданий, тоннели",
    limitations: "Обязателен лабораторный контроль на каждом этапе"
  },
  {
    id: "b40",
    label: "B40",
    strengthMPa: 52.4,
    description: "Высотные здания, мосты",
    application: "Высотные здания, мосты, колонны, ригели больших пролетов",
    watermark: "W10-W14",
    frostResistance: "F300-F400",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 150",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 34.9, unit: "шт", calculation: "52.4*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 5347, unit: "м", calculation: "52.4*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Высокопрочный бетон для высотного строительства.",
    detailedInfo: "Бетон для высотных зданий и мостов больших пролетов. Обеспечивает высокую несущую способность при уменьшении сечения конструкций, что позволяет экономить пространство.",
    composition: "Цемент М600, гранитный щебень, песок. Вода-цементное отношение 0.3-0.4. Комплекс добавок: пластификаторы, микрокремнезем.",
    recommendedUse: "Высотные здания, мосты больших пролетов, ядра жесткости",
    limitations: "Требуется специальное оборудование для укладки"
  },
  {
    id: "b45",
    label: "B45",
    strengthMPa: 58.9,
    description: "Высотные здания, ГЭС",
    application: "Высотные здания, ГЭС, мосты больших пролетов, специальные сооружения",
    watermark: "W12-W16",
    frostResistance: "F300-F400",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 180",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 39.3, unit: "шт", calculation: "58.9*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 6010, unit: "м", calculation: "58.9*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Для ГЭС и мостов больших пролетов.",
    detailedInfo: "Бетон для уникальных сооружений и гидротехнического строительства. Применяется при строительстве ГЭС, мостов с большими пролетами, фундаментов под тяжелое промышленное оборудование.",
    composition: "Цемент М600, гранитный щебень, песок. Вода-цементное отношение 0.3-0.35. Микрокремнезем, суперпластификаторы.",
    recommendedUse: "ГЭС, мосты больших пролетов, промышленные фундаменты",
    limitations: "Специальные требования к производству и укладке"
  },
  {
    id: "b50",
    label: "B50",
    strengthMPa: 65.5,
    description: "Метро, тоннели, специальные сооружения",
    application: "Метрополитен, тоннели, специальные сооружения, фундаменты под тяжелое оборудование",
    watermark: "W14-W18",
    frostResistance: "F400-F500",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 180",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 43.7, unit: "шт", calculation: "65.5*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 6684, unit: "м", calculation: "65.5*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Для метро, тоннелей и спецсооружений.",
    detailedInfo: "Высокопрочный бетон для тоннельного строительства и подземных сооружений. Обеспечивает высокую несущую способность в условиях горного давления и агрессивной среды.",
    composition: "Цемент М600, гранитный щебень, песок. Вода-цементное отношение 0.28-0.35. Микрокремнезем, суперпластификаторы, фибра.",
    recommendedUse: "Тоннели, метро, подземные сооружения, спецобъекты",
    limitations: "Только заводское производство с лабораторным контролем"
  },
  {
    id: "b55",
    label: "B55",
    strengthMPa: 72.1,
    description: "Специальные сооружения, мосты",
    application: "Специальные сооружения, мосты, фундаменты высотных зданий",
    watermark: "W16-W20",
    frostResistance: "F400-F500",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 240",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 48.1, unit: "шт", calculation: "72.1*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 7357, unit: "м", calculation: "72.1*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Высокопрочный бетон для спецсооружений.",
    detailedInfo: "Бетон для уникальных сооружений с экстремальными нагрузками. Применяется в строительстве небоскребов, мостов с рекордными пролетами, объектов специального назначения.",
    composition: "Цемент М600-М700, гранитный щебень высокой прочности. Вода-цементное отношение 0.25-0.32. Микрокремнезем, суперпластификаторы, фибра.",
    recommendedUse: "Небоскребы, уникальные мосты, спецобъекты",
    limitations: "Требуется специализированная бригада для укладки"
  },
  {
    id: "b60",
    label: "B60",
    strengthMPa: 78.6,
    description: "Высотные здания, специальные конструкции",
    application: "Высотные здания, специальные конструкции, мосты, ядра жесткости",
    watermark: "W18-W20",
    frostResistance: "F500-F600",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 240",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 52.4, unit: "шт", calculation: "78.6*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 8020, unit: "м", calculation: "78.6*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Для высотных зданий и ответственных конструкций.",
    detailedInfo: "Бетон для высотных зданий свыше 100 метров. Ядра жесткости, несущие колонны, фундаментные плиты. Обеспечивает максимальную несущую способность при минимальном сечении.",
    composition: "Цемент М700, гранитный щебень, кварцевый песок. Вода-цементное отношение 0.22-0.3. Микрокремнезем, суперпластификаторы последнего поколения.",
    recommendedUse: "Небоскребы 100м+, ядра жесткости, уникальные фундаменты",
    limitations: "Только специализированные заводы с автоматическим контролем"
  },
  {
    id: "b70",
    label: "B70",
    strengthMPa: 91.6,
    description: "Сверхвысотные здания, специальные сооружения",
    application: "Сверхвысотные здания, специальные сооружения, мосты больших пролетов",
    watermark: "W20",
    frostResistance: "F600-F800",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 300",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 61.1, unit: "шт", calculation: "91.6*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 9347, unit: "м", calculation: "91.6*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Сверхвысокопрочный бетон для уникальных сооружений.",
    detailedInfo: "Бетон класса B70 - сверхвысокопрочный материал для уникальных строительных проектов. Применяется в строительстве сверхвысотных зданий (свыше 200м), мостов с экстремальными пролетами.",
    composition: "Цемент М700, гранитный и базальтовый щебень. Вода-цементное отношение 0.2-0.28. Микрокремнезем, нанодобавки, суперпластификаторы.",
    recommendedUse: "Небоскребы 200м+, уникальные мосты, спецобъекты",
    limitations: "Эксклюзивное производство, индивидуальный проект рецептуры"
  },
  {
    id: "b80",
    label: "B80",
    strengthMPa: 104.7,
    description: "Уникальные сооружения, мосты",
    application: "Уникальные сооружения, мосты сверхбольших пролетов, ядра жесткости небоскребов",
    watermark: "W20",
    frostResistance: "F800-F1000",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 360",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 69.8, unit: "шт", calculation: "104.7*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 10684, unit: "м", calculation: "104.7*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Для уникальных сооружений и небоскребов.",
    detailedInfo: "Экстремально прочный бетон для проектов мирового уровня. Применяется в строительстве рекордных по высоте зданий и мостов. Обеспечивает беспрецедентную несущую способность.",
    composition: "Цемент М700-М800, специальные заполнители. Вода-цементное отношение 0.18-0.25. Нанодобавки, микрокремнезем, фибра, суперпластификаторы.",
    recommendedUse: "Небоскребы-рекордсмены, мосты-гиганты, спецобъекты",
    limitations: "Индивидуальная разработка рецептуры под проект"
  },
  {
    id: "b90",
    label: "B90",
    strengthMPa: 117.7,
    description: "Небоскребы, специальные сооружения",
    application: "Небоскребы, специальные сооружения, мосты, фундаменты под уникальное оборудование",
    watermark: "W20",
    frostResistance: "F1000",
    curingTime: "2-4 часа",
    strengthGainTime: "28 дней",
    standardCuringConditions: "Температура 20 плюс-минус 2 градуса Цельсия, влажность 90-100%",
    fireResistance: "REI 360",
    comparisonData: [
      { id: "cars", name: "Легковые автомобили", icon: "", description: "Вес автомобилей на площади 10x10 см", value: 78.5, unit: "шт", calculation: "117.7*10^6*0.01 / 1500" },
      { id: "water", name: "Давление воды", icon: "", description: "Глубина погружения в воду", value: 12010, unit: "м", calculation: "117.7*10^6 / (1000*9.8)" },
    ],
    cardInfo: "Максимальная прочность для небоскребов и спецобъектов.",
    detailedInfo: "Максимальный класс прочности бетона. Применяется в самых амбициозных строительных проектах: небоскребы свыше 300 метров, уникальные мосты, объекты специального назначения. Предел прочности превышает 117 МПа.",
    composition: "Цемент специального состава, высокопрочные заполнители. Вода-цементное отношение 0.15-0.22. Нанотехнологии, фибра, комплекс добавок.",
    recommendedUse: "Сверхвысотные небоскребы 300м+, уникальные проекты",
    limitations: "Индивидуальный проект, только специализированное производство"
  },
];

export const getConcreteById = (id: string): ConcreteClass | undefined => {
  return concreteClasses.find(c => c.id === id);
};

export const constructionTypes = [
  {
    id: "foundation",
    name: "Фундамент",
    description: "Основание здания, передает нагрузку на грунт",
    minClass: "b15",
    recommendedClasses: ["b20", "b25", "b30"],
    loads: ["compressive", "bending", "ground-water"]
  },
  {
    id: "balcony",
    name: "Балкон",
    description: "Консольная плита, выступает за фасад здания",
    minClass: "b20",
    recommendedClasses: ["b25", "b30", "b35"],
    loads: ["bending", "torsion", "wind"]
  },
  {
    id: "column",
    name: "Колонна",
    description: "Вертикальная несущая конструкция, воспринимает сжатие",
    minClass: "b20",
    recommendedClasses: ["b25", "b30", "b35", "b40"],
    loads: ["compressive", "bending", "shear"]
  },
  {
    id: "floor-slab",
    name: "Плита перекрытия",
    description: "Горизонтальная несущая конструкция, разделяет этажи",
    minClass: "b15",
    recommendedClasses: ["b20", "b25", "b30"],
    loads: ["bending", "shear", "distributed"]
  },
  {
    id: "beam",
    name: "Балка (ригель)",
    description: "Горизонтальная несущая конструкция, поддерживает перекрытия",
    minClass: "b20",
    recommendedClasses: ["b25", "b30", "b35"],
    loads: ["bending", "shear", "torsion"]
  },
  {
    id: "wall",
    name: "Несущая стена",
    description: "Вертикальная ограждающая и несущая конструкция",
    minClass: "b12.5",
    recommendedClasses: ["b15", "b20", "b25"],
    loads: ["compressive", "wind", "thermal"]
  },
  {
    id: "stairs",
    name: "Лестничный марш",
    description: "Лестничная конструкция для перехода между этажами",
    minClass: "b15",
    recommendedClasses: ["b20", "b25"],
    loads: ["bending", "shear", "dynamic"]
  },
  {
    id: "bridge",
    name: "Мост",
    description: "Мостовое сооружение для преодоления препятствий",
    minClass: "b30",
    recommendedClasses: ["b35", "b40", "b45", "b50"],
    loads: ["compressive", "bending", "shear", "dynamic", "wind", "thermal"]
  },
  {
    id: "pool",
    name: "Бассейн",
    description: "Гидротехническое сооружение для воды",
    minClass: "b25",
    recommendedClasses: ["b30", "b35", "b40"],
    loads: ["hydrostatic", "bending", "thermal"]
  },
  {
    id: "dam",
    name: "Плотина",
    description: "Гидротехническое сооружение для удержания воды",
    minClass: "b30",
    recommendedClasses: ["b35", "b40", "b45"],
    loads: ["hydrostatic", "compressive", "uplift", "thermal"]
  },
  {
    id: "tunnel",
    name: "Тоннель",
    description: "Подземное сооружение для транспорта или коммуникаций",
    minClass: "b35",
    recommendedClasses: ["b40", "b45", "b50"],
    loads: ["ground-pressure", "bending", "shear", "thermal"]
  },
  {
    id: "road",
    name: "Дорожное покрытие",
    description: "Дорожная плита для транспортных нагрузок",
    minClass: "b22.5",
    recommendedClasses: ["b25", "b30", "b35"],
    loads: ["compressive", "abrasion", "dynamic", "thermal"]
  },
  {
    id: "retaining-wall",
    name: "Подпорная стенка",
    description: "Стена для удержания грунта от обрушения",
    minClass: "b20",
    recommendedClasses: ["b25", "b30"],
    loads: ["lateral-earth", "bending", "shear", "hydrostatic"]
  },
  {
    id: "skyscraper",
    name: "Небоскреб",
    description: "Высотное здание более 100 метров",
    minClass: "b40",
    recommendedClasses: ["b50", "b60", "b70", "b80", "b90"],
    loads: ["compressive", "wind", "seismic", "thermal", "bending"]
  },
];

export const loadTypes = [
  {
    id: "compressive",
    name: "Сжатие",
    description: "Давление сверху вниз, основная нагрузка на бетон"
  },
  {
    id: "bending",
    name: "Изгиб",
    description: "Нагрузка, вызывающая изгиб конструкции"
  },
  {
    id: "shear",
    name: "Сдвиг",
    description: "Сдвиг слоев бетона относительно друг друга"
  },
  {
    id: "torsion",
    name: "Кручение",
    description: "Закручивание конструкции вокруг оси"
  },
  {
    id: "tensile",
    name: "Растяжение",
    description: "Растяжение бетона (бетон плохо работает на растяжение)"
  },
  {
    id: "dynamic",
    name: "Динамическая",
    description: "Вибрация, удары, движение транспорта"
  },
  {
    id: "wind",
    name: "Ветровая",
    description: "Давление ветра на конструкцию"
  },
  {
    id: "thermal",
    name: "Температурная",
    description: "Расширение и сжатие при изменении температуры"
  },
  {
    id: "hydrostatic",
    name: "Гидростатическая",
    description: "Давление воды на конструкцию"
  },
  {
    id: "ground-water",
    name: "Грунтовые воды",
    description: "Давление и агрессивное воздействие грунтовых вод"
  },
  {
    id: "distributed",
    name: "Распределенная",
    description: "Равномерно распределенная нагрузка по поверхности"
  },
  {
    id: "lateral-earth",
    name: "Давление грунта",
    description: "Боковое давление грунта на подпорную стенку"
  },
  {
    id: "uplift",
    name: "Взвешивающее давление",
    description: "Давление воды снизу на плотину"
  },
  {
    id: "abrasion",
    name: "Истирание",
    description: "Механическое истирание поверхности"
  },
  {
    id: "seismic",
    name: "Сейсмическая",
    description: "Нагрузка от землетрясения"
  },
];

export const everydayForces = [
  {
    id: "human",
    name: "Человек",
    force: 80,
    description: "Средний вес взрослого человека 80 кг",
    category: "people"
  },
  {
    id: "piano",
    name: "Рояль",
    force: 500,
    description: "Концертный рояль весит около 500 кг",
    category: "objects"
  },
  {
    id: "car",
    name: "Легковой автомобиль",
    force: 1500,
    description: "Средний легковой автомобиль 1.5 тонны",
    category: "transport"
  },
  {
    id: "truck",
    name: "Грузовик",
    force: 20000,
    description: "Полностью загруженный грузовик 20 тонн",
    category: "transport"
  },
  {
    id: "elephant",
    name: "Слон",
    force: 6000,
    description: "Крупный африканский слон до 6 тонн",
    category: "animals"
  },
  {
    id: "bus",
    name: "Автобус",
    force: 12000,
    description: "Городской автобус около 12 тонн",
    category: "transport"
  },
  {
    id: "locomotive",
    name: "Тепловоз",
    force: 120000,
    description: "Тепловоз серии 2ТЭ116 - 120 тонн",
    category: "transport"
  },
  {
    id: "water-pressure",
    name: "Давление воды 10м",
    force: 10000,
    description: "Давление столба воды на глубине 10 метров",
    category: "nature"
  },
  {
    id: "airplane",
    name: "Boeing 737",
    force: 79000,
    description: "Максимальная взлетная масса Boeing 737-800",
    category: "transport"
  },
  {
    id: "blue-whale",
    name: "Синий кит",
    force: 150000,
    description: "Самое большое животное на Земле - до 150 тонн",
    category: "animals"
  },
  {
    id: "tank",
    name: "Танк Т-90",
    force: 46000,
    description: "Боевая масса танка Т-90 - 46 тонн",
    category: "military"
  },
];

export const mapObjects = [
  {
    id: "lakhta-center",
    name: "Лахта Центр",
    coordinates: [59.9717, 30.2344],
    concreteClass: "b60",
    type: "skyscraper",
    description: "Небоскреб высотой 462м. Использован бетон B60 для ядра жесткости"
  },
  {
    id: "bridge-blagoveschensky",
    name: "Благовещенский мост",
    coordinates: [59.9339, 30.2886],
    concreteClass: "b35",
    type: "bridge",
    description: "Мост через Неву. Использован бетон B35 для опор и пролетов"
  },
  {
    id: "metro-avtovo",
    name: "Станция метро Автово",
    coordinates: [59.8597, 30.2651],
    concreteClass: "b40",
    type: "tunnel",
    description: "Станция метро глубокого заложения. Бетон B40 для тоннелей"
  },
  {
    id: "stadium-gazprom",
    name: "Газпром Арена",
    coordinates: [59.9653, 30.2294],
    concreteClass: "b30",
    type: "floor-slab",
    description: "Стадион. Бетон B30 для фундаментов и перекрытий"
  },
  {
    id: "dam-spb",
    name: "Кольцевая дамба (КАД)",
    coordinates: [59.9956, 29.8431],
    concreteClass: "b35",
    type: "dam",
    description: "Защитное сооружение от наводнений. Бетон B35-B40"
  },
  {
    id: "bridge-bolshoj-obukhovsky",
    name: "Большой Обуховский мост",
    coordinates: [59.8708, 30.5019],
    concreteClass: "b40",
    type: "bridge",
    description: "Вантовый мост. Бетон B40 для пилонов и балки жесткости"
  },
  {
    id: "hermitage",
    name: "Эрмитаж (реконструкция)",
    coordinates: [59.9398, 30.3146],
    concreteClass: "b20",
    type: "foundation",
    description: "Фундаменты при реконструкции. Бетон B20"
  },
  {
    id: "port-morskoy-vokzal",
    name: "Морской вокзал",
    coordinates: [59.9434, 30.2498],
    concreteClass: "b30",
    type: "foundation",
    description: "Фундаменты и набережная. Бетон B30"
  },
];
