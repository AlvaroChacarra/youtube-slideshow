export const chapters = [
  { title: "El contrato", full: "Qué es un bono", range: "1–2", slide: 2 },
  { title: "El valor", full: "Cómo se valora un bono", range: "3–4", slide: 4 },
  { title: "El rendimiento", full: "YTM vs CAGR", range: "5–6", slide: 6 },
  {
    title: "El mercado",
    full: "Del bono a la curva de tipos",
    range: "7–9",
    slide: 8,
  },
];

export type Slide = {
  slug: string;
  title: string;
  eyebrow: string;
  chapter: number;
  steps: string[];
  captions: string[];
  note: string;
  question: string;
  answer: string;
};
export const slides: Slide[] = [
  {
    slug: "01-block-cover",
    title: "Fundamentos de los bonos",
    eyebrow: "Bloque 1",
    chapter: -1,
    steps: ["Contrato · flujos · curva"],
    captions: ["Qué es un bono, cómo se valora y cómo encaja en la curva."],
    note: "Abrir preguntando qué compramos: una promesa, una rentabilidad o una serie de pagos. El certificado, los flujos y la curva anticipan el recorrido. Partiremos del mismo bono: 100 € de principal, cupón anual del 4% y cinco años.",
    question: "¿Qué estás comprando cuando compras un bono?",
    answer:
      "Derechos contractuales sobre pagos futuros fechados, sujetos a que el emisor cumpla.",
  },
  {
    slug: "02-table-of-contents",
    title: "Un bono. Cuatro perspectivas.",
    eyebrow: "Recorrido del bloque",
    chapter: -1,
    steps: ["El recorrido"],
    captions: [
      "Primero el objeto. Después sus flujos, su valor y su lugar en el mercado.",
    ],
    note: "Las cuatro estaciones son capas acumulativas. Los rangos 1–2, 3–4, 5–6 y 7–9 corresponden a las nueve slides docentes; portada, índice y dos repasos completan las trece. Las estaciones permiten saltar a cada microbloque.",
    question:
      "¿Qué permanece fijo después de emitir un bono: cupón, precio o YTM?",
    answer:
      "El cupón contractual de este bono a tipo fijo. Precio y YTM pueden cambiar; veremos cómo más adelante.",
  },
  {
    slug: "03-what-is-a-bond",
    title: "¿Qué es un bono?",
    eyebrow: "01 · El contrato",
    chapter: 0,
    steps: [
      "Quién necesita capital",
      "El inversor aporta capital",
      "El contrato promete pagos",
      "Qué permite financiar",
    ],
    captions: [
      "Estados y empresas necesitan capital hoy.",
      "El inversor entrega capital al emisor a través del bono.",
      "A cambio, adquiere el derecho a recibir pagos futuros.",
      "El capital financia actividad real; los pagos son una obligación del emisor.",
    ],
    note: "Recorrer emisor → instrumento → inversor. Capital hoy va desde el inversor al emisor; pagos futuros recorren el sentido contrario. Separar destino del capital y obligación de pago. El bonista es acreedor, no accionista. Una promesa no es certeza: existe riesgo de incumplimiento.",
    question: "¿De quién depende que se cumpla la promesa de pago?",
    answer:
      "Del emisor. El bono formaliza su obligación; no elimina el riesgo de incumplimiento.",
  },
  {
    slug: "04-bond-anatomy",
    title: "Abramos el contrato.",
    eyebrow: "02 · El contrato",
    chapter: 0,
    steps: [
      "Un bono a cinco años",
      "Qué significa cada condición",
      "Del porcentaje al pago",
      "El contrato se convierte en flujos",
    ],
    captions: [
      "Este bono será nuestro caso base para flujos, valoración y rendimiento.",
      "Notional: base del cupón. Valor nominal: principal devuelto. Aquí coinciden.",
      "4% × 100 € = 4 € de cupón cada año.",
      "En el último pago conviven 4 € de cupón y 100 € de principal.",
    ],
    note: "Identificar emisor, cupón, notional, valor nominal, vencimiento y frecuencia. Precio hoy = 100 € es una observación de mercado, no una condición contractual inmutable. N y principal coinciden en este ejemplo, pero no son sinónimos universales. Desde el inversor: −100, 4, 4, 4, 4, 104.",
    question: "¿Por qué el último pago es 104 €?",
    answer:
      "Porque contiene 4 € de cupón más 100 € de devolución del principal. El principal se devuelve una sola vez.",
  },
  {
    slug: "05-discounting-theory",
    title: "Traer el futuro al presente.",
    eyebrow: "03 · El valor",
    chapter: 1,
    steps: [
      "Pagos en fechas distintas",
      "Un equivalente hoy por flujo",
      "La suma construye el precio",
    ],
    captions: [
      "Cada pago tiene una fecha. Cada fecha importa.",
      "Descontar convierte un pago futuro en su equivalente de hoy.",
      "El precio es la suma de los valores presentes de todos los pagos.",
    ],
    note: "P₀ = Σ CFₜ/(1+rₜ)^t. CFₜ es el flujo futuro; rₜ es la tasa anual efectiva apropiada para ese plazo; t está expresado en años; n es el vencimiento. El último flujo contiene cupón y principal. Todavía no usamos YTM. Descontar no reduce el pago contractual: cambia su valor equivalente hoy.",
    question: "¿Descontar cambia lo que promete pagar el contrato?",
    answer:
      "No. El flujo contractual se conserva; calculamos cuánto representa hoy bajo la tasa de descuento elegida.",
  },
  {
    slug: "06-discounting-example",
    title: "Cinco pagos. Un precio.",
    eyebrow: "04 · El valor",
    chapter: 1,
    steps: [
      "Recuperar los flujos",
      "Conectar flujo y descuento",
      "Sumar valores presentes",
      "Explorar la tasa del último pago",
    ],
    captions: [
      "El contrato fija 4, 4, 4, 4 y 104 €.",
      "Cada numerador procede del contrato; cada denominador, de su plazo y tasa.",
      "Con r₁ = ··· = r₅ = 4%, los valores presentes suman 100 €.",
      "Cambia r₅: se mueve el precio, mientras los cinco pagos siguen siendo los mismos.",
    ],
    note: "P₀ = 4/(1+r₁) + 4/(1+r₂)² + 4/(1+r₃)³ + 4/(1+r₄)⁴ + 104/(1+r₅)⁵. La tasa plana del 4% es una simplificación explícita. El control altera solo r₅; las otras cuatro tasas siguen al 4%. No llamar YTM a este control. Los cálculos usan toda la precisión y redondean solo al presentar.",
    question: "Si solo aumenta r₅, ¿qué valor presente cambia?",
    answer:
      "Solo el del pago de 104 € del año 5. Ese valor presente disminuye y, con él, el precio total.",
  },
  {
    slug: "07-ytm-vs-cagr",
    title: "Una tasa no cuenta toda la historia.",
    eyebrow: "05 · El rendimiento",
    chapter: 2,
    steps: [
      "La YTM reconcilia precio y flujos",
      "Los cupones se guardan al 0%",
      "La riqueza final se anualiza",
      "¿Y si reinvertimos los cupones?",
    ],
    captions: [
      "Volvemos al caso base: precio 100 € y los mismos pagos. Su YTM es 4%.",
      "Mantener los cupones en efectivo al 0% produce 120 € al cabo de cinco años.",
      "Con el mismo bono: YTM 4,00%; CAGR sin reinversión 3,71%.",
      "Reinvertir al 4% permite realizar un 4% compuesto, si se cobra todo y se mantiene hasta vencimiento.",
    ],
    note: "Calcular YTM no exige reinvertir cupones. Realizar ese rendimiento compuesto hasta vencimiento requiere, entre otros supuestos, cobrar los flujos y reinvertir los cupones al mismo rendimiento. CAGR₀ = (120/100)^(1/5)−1 = 3,71%. Para reinversión g, W₅(g)=4(1+g)^4+4(1+g)^3+4(1+g)^2+4(1+g)+104. La YTM permanece al 4% cuando cambia g.",
    question: "Si guardo los cupones en efectivo, ¿deja de existir la YTM?",
    answer:
      "No. La YTM sigue siendo 4%. Lo que cambia es la riqueza terminal y, por tanto, el rendimiento compuesto realizado.",
  },
  {
    slug: "08-same-ytm-different-cagr",
    title: "Mismo YTM. Distinto resultado.",
    eyebrow: "06 · El rendimiento",
    chapter: 2,
    steps: [
      "Tres cupones; YTM común del 4%",
      "Construir precios y flujos",
      "Acumular sin reinvertir",
      "Comparar el CAGR",
    ],
    captions: [
      "Nuevo ejemplo: tres bonos a cinco años. Principal 100 €, pagos anuales y distintos cupones.",
      "El precio de cada bono es consistente con la misma YTM del 4%.",
      "Los cupones cobrados se mantienen en efectivo al 0%.",
      "Cuanto mayor es el cupón, más importa qué hacemos con los cobros intermedios.",
    ],
    note: "Cupones 8%, 1% y 0%; precios 117,81 €, 86,64 € y 82,19 €. Riquezas sin reinversión 140 €, 105 € y 100 €. CAGR respectivos 3,51%, 3,92% y 4,00%, calculados sobre precios sin redondear. El cupón cero no tiene cobros intermedios que reinvertir. YTM y CAGR coinciden manteniéndolo hasta vencimiento y cobrando el principal.",
    question: "¿Por qué el cupón cero conserva un CAGR del 4%?",
    answer:
      "Todo el cobro llega al vencimiento. No hay cupones intermedios cuyo rendimiento de reinversión pueda cambiar el resultado.",
  },
  {
    slug: "09-why-many-bonds-same-tenor",
    title: "Los bonos también envejecen.",
    eyebrow: "07 · El mercado",
    chapter: 3,
    steps: [
      "Nace una referencia",
      "Nacen nuevas referencias",
      "El tiempo reduce la vida residual",
      "Varias emisiones comparten zona",
    ],
    captions: [
      "Ahora explicamos de dónde vienen los distintos cupones: cada emisión nace en una fecha.",
      "Las nuevas referencias conviven con las anteriores; el cupón de cada una permanece fijo.",
      "Vida residual = fecha de vencimiento − fecha de valoración.",
      "Emisiones de distintas generaciones pueden convivir cerca del tenor 5Y.",
    ],
    note: "Ejemplos de emisiones y cupones ilustrativos, no inventario vigente del Tesoro. Un benchmark es una referencia especialmente líquida/seguida, no el único bono de un tenor. Al crear nuevas referencias, las antiguas siguen negociándose. También se puede reabrir una referencia existente; una reapertura aumenta saldo vivo, no crea un cupón nuevo.",
    question: "¿Un bono emitido a diez años sigue estando siempre en 10Y?",
    answer:
      "No. Su vencimiento contractual no cambia, pero su vida residual disminuye con el paso del tiempo.",
  },
  {
    slug: "10-coupon-price-ytm",
    title: "El cupón se fija. El precio se mueve.",
    eyebrow: "08 · El mercado",
    chapter: 3,
    steps: [
      "Contratos diferentes",
      "Un rendimiento exigido común",
      "El mercado ajusta los precios",
      "De cada bono a un punto",
    ],
    captions: [
      "Tres bonos comparables a cinco años, con cupones contractuales del 7%, 4% y 3%.",
      "Dados los flujos y la YTM exigida, obtenemos un precio para cada bono.",
      "Prima, par o descuento describen el precio frente al principal de 100 €.",
      "Estos tres bonos coinciden en (5Y, YTM común). La siguiente escena amplía a una nueva muestra.",
    ],
    note: "Con YTM=4%: precios 113,36 €, 100,00 € y 95,55 €. El control cambia el rendimiento exigido común, nunca el cupón. Bonos comparables pueden tener YTM próximas pero distintas por liquidez, crédito y otros factores. Prima no significa caro ni descuento barato. La curva que aparece aquí es ilustrativa y no es una curva spot.",
    question: "¿Un precio superior a 100 € significa que el bono está caro?",
    answer:
      "No. Puede reflejar cupones superiores al rendimiento exigido. Caro o barato requiere comparar el precio con un valor adecuado al riesgo y condiciones del bono.",
  },
  {
    slug: "11-yield-curve",
    title: "Del bono al mapa del mercado.",
    eyebrow: "09 · El mercado",
    chapter: 3,
    steps: [
      "Leer un bono",
      "Leer la nube",
      "La línea resume observaciones",
      "Benchmarks y plazos",
    ],
    captions: [
      "Un punto combina la vida residual y la YTM de un bono.",
      "Bonos próximos en plazo pueden tener rendimientos ligeramente distintos.",
      "La curva fair es un ajuste de la nube; no es un bono negociable.",
      "Los benchmarks son referencias líquidas. Aquí 0–2Y delimita el corto plazo.",
    ],
    note: "España · Bonos y Obligaciones del Estado como contexto. Datos ilustrativos, no cotizaciones. Eje X lineal de 0 a 50 años; eje Y rendimiento anual. La línea se ajusta a las 30 observaciones mediante el modelo determinista reutilizado del runtime. Benchmarks 2,3,5,7,10,15,30,50Y mostrados como hitos. El corte de corto plazo está exactamente en 2Y. Una curva de YTM no es la curva spot que descuenta cada flujo.",
    question: "¿Podemos usar directamente esta curva de YTM como curva spot?",
    answer:
      "No. Una YTM resume todos los flujos de un bono. Una tasa spot corresponde a un plazo de descuento; obtener esa curva requiere instrumentos, convenciones y un procedimiento de construcción.",
  },
  {
    slug: "12-recap-miniblocks-1-2",
    title: "Del contrato al precio.",
    eyebrow: "Repaso · Microbloques 1 y 2",
    chapter: 0,
    steps: [
      "Reconstruir el contrato",
      "Reconstruir los pagos",
      "Traer los pagos a hoy",
    ],
    captions: [
      "Un bono intercambia capital hoy por pagos futuros acordados.",
      "El cupón es c × N. El principal aparece solo en el último flujo.",
      "Un bono es un contrato de flujos; su precio es el valor presente de esos flujos.",
    ],
    note: "Recuperar emisor, cupón, notional, principal, plazo y frecuencia. Distinguir precio y principal. Pedir la secuencia −100,4,4,4,4,104 y reconstruir P₀=ΣCFₜ/(1+rₜ)^t. No introducir YTM/CAGR en este primer repaso.",
    question: "¿Qué necesita el precio además del contrato?",
    answer:
      "Tasas de descuento adecuadas a cada flujo y plazo. El contrato fija los pagos; las tasas permiten expresarlos en valor de hoy.",
  },
  {
    slug: "13-recap-miniblocks-3-4",
    title: "Del rendimiento al mercado.",
    eyebrow: "Repaso · Microbloques 3 y 4",
    chapter: 3,
    steps: [
      "Separar YTM y resultado",
      "Conectar cupón, precio y YTM",
      "Ordenar rendimientos por plazo",
    ],
    captions: [
      "La YTM resume precio y flujos; el resultado compuesto depende también de la reinversión.",
      "El cupón pertenece al contrato. El precio se negocia. La YTM se infiere.",
      "El YTM permite comparar bonos; la curva organiza esos rendimientos por plazo.",
    ],
    note: "Mantener la distinción YTM calculada y CAGR sin reinversión. Cupón cero: sin reinversión intermedia. Muchos contratos conviven en un tenor; precio+flujos→YTM; punto=(vida residual,YTM); línea=ajuste fair; benchmark=referencia líquida. No introducir todavía duración, DV01 o movimientos de curva.",
    question:
      "Un bono con cupón alto cotiza sobre 100 €. ¿Cómo termina en la curva?",
    answer:
      "El precio puede incorporar el valor de sus cupones altos. Con precio y flujos inferimos su YTM y situamos el bono en las coordenadas vida residual–YTM. Estar sobre 100 € no demuestra que esté caro.",
  },
];

export const glossary = [
  [
    "Cupón: tasa y pago",
    "c es la tasa anual; C = c × N es el pago en euros. En nuestro bono, 4% × 100 € = 4 €.",
  ],
  [
    "Notional y principal",
    "N es la base de cálculo del cupón. El principal o face value se devuelve al vencimiento. Aquí ambos valen 100 €.",
  ],
  [
    "Valor presente y rₜ",
    "CFₜ/(1+rₜ)^t convierte el pago del año t en euros de hoy. Usamos tasas anuales efectivas y periodos anuales.",
  ],
  [
    "YTM / TIR",
    "Tasa interna única que reconcilia el precio observado y los flujos contractuales. No garantiza un resultado compuesto realizado.",
  ],
  [
    "CAGR sin reinversión",
    "En este bloque, anualización de la riqueza terminal manteniendo los cupones en efectivo al 0%. No es la TIR del bono.",
  ],
  [
    "Tenor y benchmark",
    "Tenor indica una zona de vida residual. Benchmark es una referencia especialmente líquida y seguida dentro de una zona.",
  ],
  [
    "Curva de YTM y curva spot",
    "La primera resume rendimientos de bonos; la segunda proporciona tasas por plazo para descontar. No son intercambiables.",
  ],
];
