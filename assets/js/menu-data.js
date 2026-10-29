const RESTAURANT_CONFIG = {
  name: "mimosa brunch and drunch",
  whatsappNumber: "213562163900", // Target Algerian WhatsApp line
  currency: "دج",
};

const TRANSLATIONS = {
  fr: {
    heroBadge: "Expérience Gourmande & Conviviale",
    heroTitle: "L'Art du Brunch & du Drunch",
    heroSubtitle: "Savourez nos créations fraîches, nos assiettes signatures sucrées-salées et nos cocktails d'exception. Commandez en direct à table ou à emporter.",
    allCategories: "Tout le Menu",
    orderLabel: "Commande",
    cartTitle: "Votre Commande",
    searchPlaceholder: "Rechercher un plat, ingrédient...",
    showingAll: "Plats disponibles au menu",
    emptyCart: "Votre panier est vide. Choisissez vos douceurs !",
    extrasHeading: "Suppléments & Personnalisation :",
    notesLabel: "Instructions spéciales (allergies, cuisson...):",
    addToCart: "Ajouter au panier",
    dineIn: "À table (Sur place)",
    takeaway: "À Emporter / Livraison",
    namePlaceholder: "Votre Nom / Prénom *",
    tablePlaceholder: "N° de Table *",
    phonePlaceholder: "N° Téléphone ou Adresse *",
    subtotal: "Sous-total",
    taxIncluded: "Service Inclus",
    total: "Total à régler",
    btnWhatsApp: "Commander via WhatsApp",
    btnPlatform: "Transmettre à la Cuisine / Plateforme",
    addedToast: "Ajouté avec succès au panier!",
    validationError: "Veuillez renseigner votre nom et votre numéro de table / téléphone."
  },
  ar: {
    heroBadge: "تجربة برانش ودورنش راقية ولذيذة",
    heroTitle: "فن البرانش والدورنش الراقي",
    heroSubtitle: "استمتع بتشكيلتنا الطازجة من الأطباق المميزة، الفطور المتأخر، والحلويات الفاخرة والمشروبات المنعشة. اطلب مباشرة لطاولتك أو للطلب الخارجي.",
    allCategories: "كامل القائمة",
    orderLabel: "الطلبية",
    cartTitle: "سلة الطلبات",
    searchPlaceholder: "ابحث عن طبق، مكونات...",
    showingAll: "أطباق متوفرة في القائمة",
    emptyCart: "سلتك فارغة حالياً. اختر ما تشتهيه من القائمة!",
    extrasHeading: "إضافات وتخصيص حسب الرغبة:",
    notesLabel: "ملاحظات التحضير (حساسية، تفضيلات...):",
    addToCart: "إضافة للطلبية",
    dineIn: "في المطعم (طاولة)",
    takeaway: "سفري / توصيل",
    namePlaceholder: "الاسم واللقب *",
    tablePlaceholder: "رقم الطاولة *",
    phonePlaceholder: "رقم الهاتف أو العنوان *",
    subtotal: "المجموع الفرعي",
    taxIncluded: "الخدمة مشمولة",
    total: "المجموع الإجمالي",
    btnWhatsApp: "تأكيد وإرسال الطلب عبر الواتساب",
    btnPlatform: "إرسال الطلب مباشرة لمنصة المطبخ",
    addedToast: "تمت إضافة الطلب للسلة بنجاح!",
    validationError: "يرجى كتابة اسمك ورقم الطاولة أو الهاتف لمتابعة الطلب."
  },
  en: {
    heroBadge: "Luxury Gourmet & Cozy Ambience",
    heroTitle: "The Art of Brunch & Drunch",
    heroSubtitle: "Savor our freshly crafted signature dishes, savory sliders, fluffy pancakes, and artisanal mocktails. Order directly for dine-in or takeaway.",
    allCategories: "Full Menu",
    orderLabel: "Order",
    cartTitle: "Your Order",
    searchPlaceholder: "Search dishes, ingredients...",
    showingAll: "Available dishes on menu",
    emptyCart: "Your cart is currently empty. Explore our tasty menu!",
    extrasHeading: "Customization & Extras:",
    notesLabel: "Preparation instructions (allergies, requests...):",
    addToCart: "Add to order",
    dineIn: "Dine-in (Table)",
    takeaway: "Takeaway / Delivery",
    namePlaceholder: "Your Full Name *",
    tablePlaceholder: "Table Number *",
    phonePlaceholder: "Phone Number or Address *",
    subtotal: "Subtotal",
    taxIncluded: "Service Included",
    total: "Total Amount",
    btnWhatsApp: "Order via WhatsApp",
    btnPlatform: "Send directly to Kitchen / POS",
    addedToast: "Successfully added to your cart!",
    validationError: "Please enter your name and table number / phone."
  }
};

const MENU_CATEGORIES = [
  { id: 'all', icon: 'utensils', name: { fr: 'Tout le Menu', ar: 'الكل', en: 'All' } },
  { id: 'brunch_classics', icon: 'egg', name: { fr: 'Brunch Classics', ar: 'كلاسيكيات البرانش', en: 'Brunch Classics' } },
  { id: 'drunch_savory', icon: 'beef', name: { fr: 'Drunch & Savory', ar: 'أطباق مالحة ودورنش', en: 'Drunch & Savory' } },
  { id: 'sweets_pancakes', icon: 'cake', name: { fr: 'Sweets & Pancakes', ar: 'حلويات وبانكيك', en: 'Sweets & Pancakes' } },
  { id: 'drinks_cocktails', icon: 'glass-water', name: { fr: 'Boissons & Cocktails', ar: 'مشروبات وموكتيلات', en: 'Drinks & Mocktails' } },
];

const MENU_ITEMS = [
  {
    id: 'brunch-1',
    categoryId: 'brunch_classics',
    title: { fr: 'Avocado Toast Prestige', ar: 'أفوكادو توست برستيج', en: 'Prestige Avocado Toast' },
    description: {
      fr: 'Pain au levain toasté, écrasé d’avocat frais au citron vert, œuf poché coulant, graines de grenade et feta émiettée.',
      ar: 'خبز الحبوب المقرمش، هريس الأفوكادو والليمون، بيضة بوشيه، حب الرمان وجبنة الفيتا اليونانية.',
      en: 'Sourdough toast, seasoned mashed avocado with lime, runny poached egg, pomegranate seeds, and feta.'
    },
    price: 1100,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700&auto=format&fit=crop&q=80',
    badge: { fr: 'Best Seller', ar: 'الأكثر طلباً', en: 'Best Seller' },
    extras: [
      { name: { fr: 'Saumon fumé extra', ar: 'سلمون مدخن إضافي', en: 'Extra Smoked Salmon' }, price: 450 },
      { name: { fr: 'Œuf poché supplémentaire', ar: 'بيضة بوشيه إضافية', en: 'Extra Poached Egg' }, price: 150 },
      { name: { fr: 'Champignons rôtis à l’ail', ar: 'فطر بري مشوي', en: 'Roasted Garlic Mushrooms' }, price: 200 }
    ]
  },
  {
    id: 'brunch-2',
    categoryId: 'brunch_classics',
    title: { fr: 'Eggs Benedict Royale', ar: 'إيغز بينيديكت رويال', en: 'Royal Eggs Benedict' },
    description: {
      fr: 'Muffins anglais croustillants, dinde fumée artisanale ou saumon, deux œufs pochés et onctueuse sauce hollandaise dorée.',
      ar: 'مافن إنجليزي محمص، سلمون أو تركي مدخن، بيضتين بوشيه مع صلصة الهولنديز المخملية الفاخرة.',
      en: 'Toasted English muffin, smoked turkey or salmon, two organic poached eggs, silky golden hollandaise.'
    },
    price: 1350,
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=700&auto=format&fit=crop&q=80',
    badge: { fr: 'Signature', ar: 'توقيع ميموزا', en: 'Signature' },
    extras: [
      { name: { fr: 'Sauce hollandaise extra', ar: 'صلصة هولنديز إضافية', en: 'Extra Hollandaise' }, price: 150 },
      { name: { fr: 'Bacon de bœuf croustillant', ar: 'بيكون لحم مقرمش', en: 'Crispy Beef Bacon' }, price: 300 }
    ]
  },
  {
    id: 'brunch-3',
    categoryId: 'brunch_classics',
    title: { fr: 'Shakshuka Orientale Gourmande', ar: 'شكشوكة شرقية فاخرة', en: 'Gourmet Shakshuka' },
    description: {
      fr: 'Mijoté traditionnel de tomates confites, poivrons doux, épices douces, œufs fermiers au plat et féta marinée.',
      ar: 'طماطم متبلة ومطهوة ببطء مع الفلفل الحلو، بهارات عطرية، بيض عيون، وجبن الماعز مع خبز دافئ.',
      en: 'Slow-cooked spiced tomato sauce, sweet peppers, baked organic eggs, fresh herbs, and crumbled feta.'
    },
    price: 950,
    image: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=700&auto=format&fit=crop&q=80',
    extras: [
      { name: { fr: 'Merguez artisanale grillée', ar: 'مرقاز محلي مشوي', en: 'Grilled Merguez' }, price: 350 },
      { name: { fr: 'Fromage de chèvre fondant', ar: 'جبن ماعز ذائب', en: 'Melted Goat Cheese' }, price: 250 }
    ]
  },
  {
    id: 'drunch-1',
    categoryId: 'drunch_savory',
    title: { fr: 'Truffle Angus Sliders (Trio)', ar: 'ميني برغر ترافل أنغوس (3 قطع)', en: 'Truffle Angus Sliders (Trio)' },
    description: {
      fr: 'Trois mini-burgers briochés, bœuf Angus Black, crème de truffe noire, cheddar affiné et oignons caramélisés.',
      ar: 'ثلاث قطع برغر بخبز البريوش، لحم أنغوس عالي الجودة، صوص الترافل الأسود، شيدر معتق وبصل مكرمل.',
      en: 'Trio of soft brioche mini-burgers, Black Angus beef, black truffle aioli, aged cheddar, caramelized onion.'
    },
    price: 1850,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=700&auto=format&fit=crop&q=80',
    badge: { fr: 'Chef Choice', ar: 'اختيار الشيف', en: 'Chef Choice' },
    extras: [
      { name: { fr: 'Frites fraîches au parmesan & truffe', ar: 'بطاطس مقرمشة ببارميزان وترفل', en: 'Truffle Parmesan Fries' }, price: 450 },
      { name: { fr: 'Double cheddar fondu', ar: 'جبن شيدر مضاعف', en: 'Double Melted Cheddar' }, price: 200 }
    ]
  },
  {
    id: 'drunch-2',
    categoryId: 'drunch_savory',
    title: { fr: 'Crispy Korean Chicken Bao', ar: 'باو الدجاج المقرمش الكوري', en: 'Crispy Korean Chicken Bao' },
    description: {
      fr: 'Deux pains bao vapeur ultra moelleux, poulet pané extra croustillant, sauce coréenne sucrée-épicée et pickles.',
      ar: 'خبز الباو الآسيوي المطهو عالبخار، قطع دجاج كرانشي، صوص كوري مميز مع المخلل والخضار المقرمشة.',
      en: 'Steamed fluffy bao buns, crispy buttermilk fried chicken, sweet-spicy glaze, house pickles & sesame.'
    },
    price: 1400,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=700&auto=format&fit=crop&q=80',
    extras: [
      { name: { fr: 'Bao supplémentaire (1 pièce)', ar: 'قطعة باو إضافية', en: 'Extra Bao Bun' }, price: 500 },
      { name: { fr: 'Sauce piquante maison', ar: 'صلصة حارة خاصة', en: 'Spicy House Dip' }, price: 100 }
    ]
  },
  {
    id: 'drunch-3',
    categoryId: 'drunch_savory',
    title: { fr: 'Burrata Crémeuse aux Pêches Grillées', ar: 'سلطة بوراتا إيطالية مع الخوخ المشوي', en: 'Creamy Burrata & Grilled Peaches' },
    description: {
      fr: 'Burrata entière 150g, pêches caramélisées, tomates cerises confites, pistaches torréfiées et réduction balsamique.',
      ar: 'جبنة بوراتا الإيطالية الطازجة، شرائح خوخ مكرمل، طماطم كرزية، فستق محمص ورذاذ خل البلسمك.',
      en: 'Whole fresh burrata, caramelized peaches, heirloom cherry tomatoes, toasted pistachios, balsamic glaze.'
    },
    price: 1650,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a56?w=700&auto=format&fit=crop&q=80',
    extras: [
      { name: { fr: 'Focaccia tiède au romarin', ar: 'خبز فوكاشيا بالأعشاب', en: 'Warm Rosemary Focaccia' }, price: 250 }
    ]
  },
  {
    id: 'sweet-1',
    categoryId: 'sweets_pancakes',
    title: { fr: 'Brioche French Toast Caramel Salé', ar: 'فرنش توست بريوش بالكراميل المملح', en: 'Salted Caramel French Toast' },
    description: {
      fr: 'Pain brioché artisanal doré au beurre doux, caramel beurre salé fait maison, éclats de noisettes et glace vanille Bourbon.',
      ar: 'خبز بريوش محمص بالزبدة، كراميل مملح محضر منزلياً، مكسرات البندق المحمصة وكرة آيسكريم فانيليا.',
      en: 'Golden thick-cut brioche, homemade salted butter caramel, roasted hazelnut crumbs, Bourbon vanilla gelato.'
    },
    price: 1200,
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=700&auto=format&fit=crop&q=80',
    badge: { fr: 'Incontournable', ar: 'الأعلى تقييماً', en: 'Must Try' },
    extras: [
      { name: { fr: 'Boule de glace vanille', ar: 'كرة آيسكريم إضافية', en: 'Extra Ice Cream Scoop' }, price: 200 },
      { name: { fr: 'Fruits rouges frais', ar: 'فواكه غابية طازجة', en: 'Fresh Red Berries' }, price: 300 }
    ]
  },
  {
    id: 'sweet-2',
    categoryId: 'sweets_pancakes',
    title: { fr: 'Fluffy Soufflé Pancakes', ar: 'بانكيك سوفليه ياباني منفوش', en: 'Fluffy Japanese Pancakes' },
    description: {
      fr: 'Pancakes japonais ultra légers et nuageux, sirop d’érable pur du Canada, chantilly vanillée et myrtilles fraîches.',
      ar: 'بانكيك ياباني خفيف وهش، شراب القيقب الكندي النقي، كريمة شانتيه غنية وحبات التوت الأزرق.',
      en: 'Ultra-light soufflé pancakes, pure Canadian maple syrup, whipped vanilla cream, fresh wild blueberries.'
    },
    price: 1300,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=700&auto=format&fit=crop&q=80',
    extras: [
      { name: { fr: 'Chocolat Nutella fondant', ar: 'شوكولاتة نوتيلا دافئة', en: 'Warm Nutella drizzle' }, price: 250 },
      { name: { fr: 'Pâte de pistache pure', ar: 'صوص فستق نقي', en: 'Pure Pistachio paste' }, price: 350 }
    ]
  },
  {
    id: 'sweet-3',
    categoryId: 'sweets_pancakes',
    title: { fr: 'Açaí Bowl Énergétique & Tropical', ar: 'أساي بول استوائي منعش', en: 'Tropical Acai Energy Bowl' },
    description: {
      fr: 'Sorbet d’açaí biologique d’Amazonie, granola croquant, banane, graines de chia, beurre de cacahuète et noix de coco.',
      ar: 'سموذي الأساي العضوي المثلج، غرانولا مقرمشة، موز، بذور الشيا، زبدة الفول السوداني ومبشور جوز الهند.',
      en: 'Organic Amazonian acai smoothie bowl, artisanal granola, banana slices, chia seeds, and peanut butter swirl.'
    },
    price: 1150,
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=700&auto=format&fit=crop&q=80',
    extras: [
      { name: { fr: 'Beurre d’amande bio', ar: 'زبدة لوز عضوية', en: 'Organic Almond Butter' }, price: 250 }
    ]
  },
  {
    id: 'drink-1',
    categoryId: 'drinks_cocktails',
    title: { fr: 'Mimosa Signature (Sans Alcool)', ar: 'موكتيل ميموزا المنعش (بدون كحول)', en: 'Mimosa Signature Mocktail' },
    description: {
      fr: 'Jus d’orange fraîchement pressé, purée de pêche blanche, eau pétillante infusée et romarin frais.',
      ar: 'عصير برتقال طبيعي معصور على البارد، بيوريه الخوخ الأبيض، صودا فوارة مع لمسة إكليل الجبل العطرة.',
      en: 'Fresh squeezed orange juice, white peach purée, sparkling water, garnished with fresh rosemary.'
    },
    price: 650,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=700&auto=format&fit=crop&q=80',
    badge: { fr: 'Iconic', ar: 'الأيقوني', en: 'Iconic' },
    extras: [
      { name: { fr: 'Sirop de framboise sauvage', ar: 'سيروب توت بري', en: 'Wild Raspberry Syrup' }, price: 100 }
    ]
  },
  {
    id: 'drink-2',
    categoryId: 'drinks_cocktails',
    title: { fr: 'Iced Ceremonial Matcha Latte', ar: 'ماتشا لاتيه مثلج درجة احتفالية', en: 'Iced Ceremonial Matcha Latte' },
    description: {
      fr: 'Matcha Uji de première récolte du Japon, lait d’avoine velouté, touche de vanille de Madagascar.',
      ar: 'ماتشا أوجي اليابانية الفاخرة، حليب الشوفان الكريمي، مع نفحات فانيليا مدغشقر المنعشة.',
      en: 'First harvest Japanese ceremonial matcha, silky oat milk, sweetened lightly with Madagascar vanilla.'
    },
    price: 750,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=700&auto=format&fit=crop&q=80',
    extras: [
      { name: { fr: 'Cold Foam Fraise maison', ar: 'رغوة فراولة باردة', en: 'Strawberry Cold Foam' }, price: 200 }
    ]
  },
  {
    id: 'drink-3',
    categoryId: 'drinks_cocktails',
    title: { fr: 'Cold Brew Éthiopien Yirgacheffe', ar: 'كولد برو إثيوبي مقطر ببطء', en: 'Ethiopian Cold Brew' },
    description: {
      fr: 'Café de spécialité infusé à froid pendant 18 heures. Notes florales de jasmin et bergamote.',
      ar: 'قهوة مختصة مقطرة على البارد لمدة 18 ساعة، بطعم الزهور وفاكهة البرغموت الطبيعية.',
      en: 'Specialty coffee steep-brewed for 18 hours. Crisp floral jasmine notes and bright citrus finish.'
    },
    price: 600,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=700&auto=format&fit=crop&q=80',
    extras: [
      { name: { fr: 'Sirop noisette grillée', ar: 'سيروب بندق محمص', en: 'Roasted Hazelnut Syrup' }, price: 100 }
    ]
  }
];