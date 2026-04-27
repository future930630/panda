/**
 * products.js — 熊猫手护全站产品数据层
 *
 * 各页面引用方式：
 *   <script src="products.js"></script>
 *   <script src="product-detail.js"></script>  ← 由 product-detail.html 加载，读取 URL 参数动态填充
 *
 * 字段说明：
 *   id          — 唯一标识，用于 URL 参数如 ?id=shield-cut5
 *   name        — 多语言产品名称 { zh, en }
 *   category    — 功能分类 slug，对应 func-{slug}.html
 *   brand       — 品牌 slug，对应 brand-{slug}.html 或 pandashield.html 等
 *   industries  — 行业分类数组
 *   attributes  — 属性键值对（四列属性网格 / 属性 tab）
 *   price       — 价格阶梯 { moq, tiers: [{qty, price}], sample }
 *   images      — 图片路径数组
 *   certificates— 证书数组 [{code, name, desc, level, pdf}]
 *   reviews     — 评价 { product: [], store: [] }
 *   bundle      — 搭配产品 id 数组
 *   tags        — 产品标签（展示用）
 *   faq         — 常见问题 [{q, a}]
 *   supplier    — 供应商信息（统一用熊猫手护）
 */

const PRODUCTS = [

  /* ══════════════════════════════════════
     1. PandaSHIELD™ — 防切割 / 撕裂 / 磨损
     ══════════════════════════════════════ */
  {
    id: "shield-cut5",
    name: {
      zh: "PandaSHIELD™ 防切割手套 5级",
      en: "PandaSHIELD™ Cut Resistant Glove Level 5"
    },
    category: "cut",
    brand: "shield",
    industries: ["metal", "glass", "mechanical"],
    shortDesc: {
      zh: "HPPE高密度聚乙烯纤维编织，内嵌不锈钢丝，EN 388 Level 5 / ANSI A4 双认证",
      en: "HPPE fiber knit with stainless steel wire, EN 388 Level 5 / ANSI A4 dual certified"
    },
    attributes: {
      "功能点": "防切割,防滑,耐磨",
      "材料": "HPPE / 不锈钢丝 / 聚氨酯涂层",
      "应用场景": "金属加工,玻璃处理,机械制造",
      "型号": "SHD-CUT5",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 388 Level 5 / ANSI A4",
      "涂层": "聚氨酯（PU）掌部涂层",
      "尺码": "6/XS - 11/XXL",
      "颜色": "灰色/橙色/绿色/蓝色",
      "内衬": "13针HPPE编织",
      "袖口": "针织袖口，可定制",
      "包装": "12双/袋，120双/箱",
      "单品尺寸": "10×12×0.5 CM",
      "单品净重": "0.050 kg",
      "外箱尺寸": "40×28×25 CM",
      "外箱毛重": "7.2 KG",
      "认证": "CE / ISO 9001 / SGS",
      "MOQ": "300 双",
      "交货期": "25天（≥12000双）"
    },
    price: {
      moq: 300,
      tiers: [
        { qty: "120–2,999", price: "¥30.60", unit: "双" },
        { qty: "3,000–11,999", price: "¥29.24", unit: "双" },
        { qty: "≥12,000", price: "¥28.56", unit: "双" }
      ],
      sample: "¥203.95"
    },
    images: [
      "image/qiege.jpg",
      "image/qiege.jpg",
      "image/qiege.jpg",
      "image/qiege.jpg"
    ],
    colors: [
      { name: "灰色", hex: "#666666", img: "image/qiege.jpg" },
      { name: "橙色", hex: "#E85D00", img: "image/qiege.jpg" },
      { name: "绿色", hex: "#4CAF50", img: "image/qiege.jpg" },
      { name: "蓝色", hex: "#2196F3", img: "image/qiege.jpg" }
    ],
    sizes: ["6/XS", "7/S", "8/M", "9/L", "10/XL", "11/XXL"],
    certificates: [
      { code: "EN388", name: "EN 388", desc: "机械风险防护手套标准", level: "Level 5 切割 / 耐磨 4级 / 撕裂 4级", pdf: "certs/EN388.pdf" },
      { code: "ANSI", name: "ANSI A4", desc: "美国防切割标准", level: "A4 级（1500g 耐切割力）", pdf: "certs/ANSIA4.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", level: "EN 420 / PPE 法规", pdf: "certs/CE.pdf" },
      { code: "ISO", name: "ISO 9001", desc: "质量管理体系认证", level: "2015版", pdf: "certs/ISO9001.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Thomas M.",
          country: "United States",
          rating: 5,
          date: "2025-12-08",
          specs: "型号: SHD-CUT5 / 尺码: L / 颜色: 蓝色",
          text: "These gloves are exactly what I needed for my metal fabrication work. The cut resistance is excellent and they are very comfortable to wear for long hours. Will definitely order again!",
          images: ["image/pd-thumb.jpg"],
          verified: true,
          purchased: true,
          helpful: 0,
          reply: "Dear Thomas, thank you so much for your kind feedback! We're glad our gloves meet your expectations. Looking forward to serving you again. Best regards!"
        },
        {
          user: "王建国",
          country: "中国",
          rating: 5,
          date: "2025-11-22",
          specs: "型号: SHD-CUT5 / 尺码: M / 颜色: 灰色",
          text: "质量非常好，防切割性能达标，与描述一致。包装仔细，发货速度快。",
          images: [],
          verified: true,
          purchased: false,
          helpful: 3,
          reply: "感谢您的认可！我们会继续严控品质，期待下次合作。"
        }
      ],
      store: [
        { user: "John D.", country: "United Kingdom", rating: 5, date: "2026-01-15", text: "Fast shipping and excellent customer service. The product quality exceeded my expectations. Highly recommended!", helpful: 5, verified: true },
        { user: "Lisa K.", country: "Germany", rating: 5, date: "2026-01-10", text: "Sehr zufrieden mit der Qualität. Die Lieferung kam pünktlich an. Werde bald wieder bestellen.", helpful: 2, verified: true },
        { user: "Ana R.", country: "Spain", rating: 5, date: "2026-01-05", text: "Muy buena relación calidad-precio. Los guantes llegaron en perfecto estado. Los recomiendo.", helpful: 1, verified: true },
        { user: "Marie L.", country: "France", rating: 4, date: "2025-12-28", text: "Bon produit, livraison rapide. Seul petit bémol: les tailles taillent légèrement petit.", helpful: 0, verified: true }
      ]
    },
    bundle: ["shield-sleeve", "safety-goggles", "workwear-set"],
    tags: ["防切割", "HPPE", "工业级", "CE认证"],
    faq: [
      { q: "样品如何购买？", a: "样品价格 ¥203.95/双，含运费。样品通常3-5个工作日发货。需要请联系客服。" },
      { q: "最小起订量是多少？", a: "常规产品MOQ为300双。颜色、尺码可混批，详情请咨询客服。" },
      { q: "交货周期多久？", a: "<12,000双需协商；≥12,000双约25天。具体以合同确认为准。" },
      { q: "支持哪些付款方式？", a: "支持 T/T、L/C、PayPal、西联汇款等。首次合作建议 T/T 30% 定金。" },
      { q: "可以定制LOGO吗？", a: "可以。500双起接受定制LOGO和包装，最低订购量视定制内容而定。" },
      { q: "质量如何保证？", a: "每批次出厂前均经过 EN 388 / ANSI 检测，提供第三方检验报告。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     2. PandaSHIELD™ — 防撕裂 4级
     ══════════════════════════════════════ */
  {
    id: "shield-tear4",
    name: {
      zh: "PandaSHIELD™ 防撕裂手套 4级",
      en: "PandaSHIELD™ Tear Resistant Glove Level 4"
    },
    category: "tear",
    brand: "shield",
    industries: ["construction", "logistics", "mechanical"],
    shortDesc: {
      zh: "高强度涤纶内衬，撕裂强度EN 388 Level 4，适用于建筑和物流搬运",
      en: "High-strength polyester lining, EN 388 Level 4 tear resistance, for construction and logistics"
    },
    attributes: {
      "功能点": "防撕裂,耐磨,防滑",
      "材料": "高强度涤纶 / 丁腈掌部涂层",
      "应用场景": "建筑施工,物流搬运,仓储分拣",
      "型号": "SHD-TEAR4",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 388 Level 4 撕裂",
      "涂层": "丁腈（NBR）掌部涂层",
      "尺码": "7/S - 11/XXL",
      "颜色": "蓝色/灰色/黑色",
      "内衬": "15针高强度涤纶编织",
      "袖口": "螺纹针织袖口",
      "包装": "12双/袋，120双/箱",
      "单品尺寸": "10×12×0.5 CM",
      "单品净重": "0.055 kg",
      "外箱尺寸": "40×28×25 CM",
      "外箱毛重": "7.8 KG",
      "认证": "CE / ISO 9001",
      "MOQ": "500 双",
      "交货期": "20天（≥10000双）"
    },
    price: {
      moq: 500,
      tiers: [
        { qty: "500–2,999", price: "¥18.50", unit: "双" },
        { qty: "3,000–9,999", price: "¥17.20", unit: "双" },
        { qty: "≥10,000", price: "¥15.80", unit: "双" }
      ],
      sample: "¥85.00"
    },
    images: ["image/qiege.jpg", "image/qiege.jpg"],
    colors: [
      { name: "蓝色", hex: "#2196F3" },
      { name: "灰色", hex: "#666666" },
      { name: "黑色", hex: "#333333" }
    ],
    sizes: ["7/S", "8/M", "9/L", "10/XL", "11/XXL"],
    certificates: [
      { code: "EN388", name: "EN 388", desc: "机械风险防护手套标准", level: "Level 4 撕裂 / 耐磨 3级", pdf: "certs/EN388.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", level: "EN 420", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Ahmed K.",
          country: "Saudi Arabia",
          rating: 5,
          date: "2026-01-20",
          specs: "型号: SHD-TEAR4 / 尺码: L / 颜色: 蓝色",
          text: "Excellent tear resistance for our construction site. Very durable even after heavy use. Good value for money.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 2,
          reply: "Thank you Ahmed for your positive feedback! We look forward to your next order."
        }
      ],
      store: [
        { user: "Marco B.", country: "Italy", rating: 5, date: "2026-02-01", text: "Ottimo rapporto qualità-prezzo. I guanti sono molto resistenti e confortevoli.", helpful: 3, verified: true },
        { user: "Pierre D.", country: "France", rating: 4, date: "2026-01-28", text: "Good gloves for warehouse work. Fast delivery.", helpful: 1, verified: true },
        { user: "Carlos M.", country: "Mexico", rating: 5, date: "2026-01-15", text: "Muy resistentes, perfectas para mi negocio de logística. Recomendadas.", helpful: 2, verified: true },
        { user: "Tomasz W.", country: "Poland", rating: 4, date: "2026-01-10", text: "Dobre rękawice do pracy w magazynie. Szybka dostawa.", helpful: 0, verified: true }
      ]
    },
    bundle: ["shield-sleeve", "workwear-set"],
    tags: ["防撕裂", "涤纶", "建筑级"],
    faq: [
      { q: "可以提供颜色定制吗？", a: "可以，2000双起接受颜色定制服务。具体请与客服联系。" },
      { q: "最小起订量是多少？", a: "MOQ为500双。" },
      { q: "交货周期多久？", a: "≥10,000双约20天，具体以合同确认为准。" },
      { q: "支持哪些付款方式？", a: "支持 T/T、L/C、PayPal、西联汇款等。" },
      { q: "可以定制LOGO吗？", a: "可以。1000双起接受定制LOGO和包装。" },
      { q: "适用于哪些行业？", a: "建筑施工、物流搬运、仓储分拣、机械制造等。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     3. PandaSHIELD™ — 耐磨王
     ══════════════════════════════════════ */
  {
    id: "shield-wear",
    name: {
      zh: "PandaSHIELD™ 耐磨防护手套",
      en: "PandaSHIELD™ Abrasion Resistant Glove"
    },
    category: "wear",
    brand: "shield",
    industries: ["mechanical", "construction", "mining"],
    shortDesc: {
      zh: "高密度尼龙编织，丁腈全掌涂层，耐磨等级EN 388 Level 4，适合重磨损工况",
      en: "High-density nylon knit, full nitrile coating, EN 388 Level 4 abrasion, for heavy-duty wear"
    },
    attributes: {
      "功能点": "耐磨,耐油,防滑",
      "材料": "高密度尼龙 / 丁腈全掌涂层",
      "应用场景": "机械制造,建筑施工,矿山开采",
      "型号": "SHD-WEAR",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 388 Level 4 耐磨",
      "涂层": "丁腈（NBR）全掌涂层",
      "尺码": "7/S - 11/XXL",
      "颜色": "黑色/灰色/绿色",
      "内衬": "15针尼龙编织",
      "袖口": "安全袖口，可调节",
      "包装": "12双/袋，120双/箱",
      "单品尺寸": "10×12×0.5 CM",
      "单品净重": "0.065 kg",
      "外箱尺寸": "40×28×25 CM",
      "外箱毛重": "8.5 KG",
      "认证": "CE / ISO 9001",
      "MOQ": "500 双",
      "交货期": "18天（≥8000双）"
    },
    price: {
      moq: 500,
      tiers: [
        { qty: "500–2,999", price: "¥14.80", unit: "双" },
        { qty: "3,000–7,999", price: "¥13.50", unit: "双" },
        { qty: "≥8,000", price: "¥12.20", unit: "双" }
      ],
      sample: "¥68.00"
    },
    images: ["image/qiege.jpg", "image/qiege.jpg"],
    colors: [
      { name: "黑色", hex: "#333333" },
      { name: "灰色", hex: "#666666" },
      { name: "绿色", hex: "#4CAF50" }
    ],
    sizes: ["7/S", "8/M", "9/L", "10/XL", "11/XXL"],
    certificates: [
      { code: "EN388", name: "EN 388", desc: "机械风险防护手套标准", level: "Level 4 耐磨 / 撕裂 3级", pdf: "certs/EN388.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", level: "EN 420", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Sergei V.",
          country: "Russia",
          rating: 5,
          date: "2026-01-25",
          specs: "型号: SHD-WEAR / 尺码: L / 颜色: 黑色",
          text: "Best abrasion-resistant gloves I've used in 10 years of mining. The nitrile coating holds up extremely well.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 4,
          reply: "Thank you Sergei for your loyalty! Our products are designed for exactly these harsh conditions."
        }
      ],
      store: [
        { user: "Erik S.", country: "Sweden", rating: 5, date: "2026-02-05", text: "Mycket bra kvalitet för priset. Använder dessa i mitt verkstad.", helpful: 1, verified: true },
        { user: "Jan K.", country: "Netherlands", rating: 4, date: "2026-01-30", text: "Goede handschoenen voor een goede prijs. Snelle levering.", helpful: 0, verified: true },
        { user: "Bruno T.", country: "Brazil", rating: 5, date: "2026-01-20", text: "Excelente resistência à abrasão. Perfeito para minha operação de mineração.", helpful: 2, verified: true },
        { user: "Anna M.", country: "Finland", rating: 4, date: "2026-01-12", text: "Hyvä kulutuskestävyys. Sopii hyvin raskaisiin töihin.", helpful: 1, verified: true }
      ]
    },
    bundle: ["workwear-set", "shield-sleeve"],
    tags: ["耐磨", "丁腈", "矿山级"],
    faq: [
      { q: "丁腈涂层是否耐油？", a: "是的，丁腈涂层本身耐油防腐，适用于油污环境。" },
      { q: "最小起订量是多少？", a: "MOQ为500双。" },
      { q: "交货周期多久？", a: "≥8,000双约18天，具体以合同确认为准。" },
      { q: "适合高温环境使用吗？", a: "耐磨系列不适用于明火或高温场景，如需耐高温请参考PandaHEAT™系列。" },
      { q: "可以定制LOGO吗？", a: "可以。1000双起接受定制LOGO和包装。" },
      { q: "支持哪些付款方式？", a: "支持 T/T、L/C、PayPal等。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     4. PandaPIERCE™ — 防穿刺
     ══════════════════════════════════════ */
  {
    id: "pierce-proof",
    name: {
      zh: "PandaPIERCE™ 防穿刺手套",
      en: "PandaPIERCE™ Puncture Resistant Glove"
    },
    category: "puncture",
    brand: "pierce",
    industries: ["metal", "construction", "waste"],
    shortDesc: {
      zh: "复合防穿刺内衬，中等穿刺防护，适用于金属加工和废料处理",
      en: "Composite puncture-resistant liner, medium protection for metalwork and waste handling"
    },
    attributes: {
      "功能点": "防穿刺,耐磨,防滑",
      "材料": "HPPE复合内衬 / 丁腈掌部涂层",
      "应用场景": "金属冲压,建筑施工,废料处理",
      "型号": "PIR-PCT2",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 388 Level 3 穿刺",
      "涂层": "丁腈（NBR）掌部涂层",
      "尺码": "7/S - 11/XXL",
      "颜色": "黄色/蓝色/黑色",
      "内衬": "HPPE复合防穿刺内衬",
      "袖口": "安全袖口",
      "包装": "12双/袋，120双/箱",
      "单品尺寸": "10×12×0.6 CM",
      "单品净重": "0.070 kg",
      "外箱尺寸": "40×28×25 CM",
      "外箱毛重": "9.0 KG",
      "认证": "CE / ISO 9001",
      "MOQ": "300 双",
      "交货期": "22天"
    },
    price: {
      moq: 300,
      tiers: [
        { qty: "300–2,999", price: "¥24.80", unit: "双" },
        { qty: "3,000–9,999", price: "¥22.50", unit: "双" },
        { qty: "≥10,000", price: "¥20.90", unit: "双" }
      ],
      sample: "¥118.00"
    },
    images: ["image/qiege.jpg", "image/qiege.jpg"],
    colors: [
      { name: "黄色", hex: "#FFEB3B" },
      { name: "蓝色", hex: "#2196F3" },
      { name: "黑色", hex: "#333333" }
    ],
    sizes: ["7/S", "8/M", "9/L", "10/XL", "11/XXL"],
    certificates: [
      { code: "EN388", name: "EN 388", desc: "机械风险防护手套标准", level: "Level 3 穿刺 / 耐磨 3级", pdf: "certs/EN388.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", level: "EN 420", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Roberto G.",
          country: "Italy",
          rating: 5,
          date: "2026-01-18",
          specs: "型号: PIR-PCT2 / 尺码: L / 颜色: 黄色",
          text: "Ottima protezione dalla puntura nel lavoro con lamiere metalliche. Molto resistenti e confortevoli.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 3,
          reply: "Grazie mille! Siamo lieti che i nostri guanti siano all'altezza delle vostre aspettative."
        }
      ],
      store: [
        { user: "Andrei F.", country: "Romania", rating: 5, date: "2026-02-03", text: "Foarte bune pentru prelucrarea metalelor. Rezistenta la perforare este excelenta.", helpful: 2, verified: true },
        { user: "Dmitry P.", country: "Russia", rating: 4, date: "2026-01-25", text: "Horoshaya zashchita ot probivaniya, udobny v noske.", helpful: 1, verified: true },
        { user: "Yuki T.", country: "Japan", rating: 5, date: "2026-01-20", text: "金属加工に最適。穿刺保護も十分でコストパフォーマンスもいい。", helpful: 2, verified: true },
        { user: "Paulo S.", country: "Portugal", rating: 4, date: "2026-01-15", text: "Bom produto para o preço. Proteção suficiente para trabalho com metais.", helpful: 0, verified: true }
      ]
    },
    bundle: ["shield-sleeve", "safety-goggles"],
    tags: ["防穿刺", "HPPE", "建筑级"],
    faq: [
      { q: "防穿刺等级能达到多少？", a: "本产品穿刺防护等级为EN 388 Level 3。如需更高等级，请参考定制款。" },
      { q: "最小起订量是多少？", a: "MOQ为300双。" },
      { q: "适用于玻璃加工吗？", a: "可以，玻璃加工建议配合防切割系列使用，防止玻璃碎裂造成的穿刺风险。" },
      { q: "交货周期多久？", a: "常规订单约22天，大单请提前与客服确认。" },
      { q: "可以定制LOGO吗？", a: "可以。500双起接受定制LOGO。" },
      { q: "支持哪些付款方式？", a: "支持 T/T、L/C、PayPal等。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     5. PandaIMPACT™ — 防冲击
     ══════════════════════════════════════ */
  {
    id: "impact-resist",
    name: {
      zh: "PandaIMPACT™ 防冲击手套",
      en: "PandaIMPACT™ Impact Resistant Glove"
    },
    category: "shock",
    brand: "impact",
    industries: ["mining", "construction", "mechanical"],
    shortDesc: {
      zh: "TPR热塑弹性体背部冲击防护，指关节和手背全方位缓冲，适用于重型冲击工况",
      en: "TPR thermoplastic elastomer back protection, full coverage impact buffering for heavy-duty conditions"
    },
    attributes: {
      "功能点": "防冲击,耐磨,防滑",
      "材料": "超纤皮掌部 / TPR背部防护 / 尼龙内衬",
      "应用场景": "矿山开采,建筑施工,重工业装配",
      "型号": "IMP-RST3",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "ANSI Level 2 冲击 / EN 388 耐磨 4级",
      "涂层": "超纤PU皮掌部涂层",
      "尺码": "7/S - 11/XXL",
      "颜色": "黑色/灰色/橙黑色",
      "内衬": "透气尼龙网布",
      "袖口": "可调节魔术贴袖口",
      "包装": "6双/袋，60双/箱",
      "单品尺寸": "12×14×1.0 CM",
      "单品净重": "0.150 kg",
      "外箱尺寸": "45×30×30 CM",
      "外箱毛重": "10.5 KG",
      "认证": "CE / ANSI / ISO 9001",
      "MOQ": "200 双",
      "交货期": "30天"
    },
    price: {
      moq: 200,
      tiers: [
        { qty: "200–999", price: "¥58.00", unit: "双" },
        { qty: "1,000–4,999", price: "¥52.00", unit: "双" },
        { qty: "≥5,000", price: "¥46.80", unit: "双" }
      ],
      sample: "¥198.00"
    },
    images: ["image/qiege.jpg", "image/qiege.jpg"],
    colors: [
      { name: "黑色", hex: "#333333" },
      { name: "灰黑", hex: "#555555" },
      { name: "橙黑", hex: "#E85D00" }
    ],
    sizes: ["7/S", "8/M", "9/L", "10/XL", "11/XXL"],
    certificates: [
      { code: "ANSI", name: "ANSI Level 2", desc: "美国冲击防护标准", level: "Level 2 冲击防护", pdf: "certs/ANSIA2.pdf" },
      { code: "EN388", name: "EN 388", desc: "机械风险防护手套标准", level: "Level 4 耐磨", pdf: "certs/EN388.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", level: "EN 420", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Michael H.",
          country: "Australia",
          rating: 5,
          date: "2026-01-30",
          specs: "型号: IMP-RST3 / 尺码: L / 颜色: 橙黑",
          text: "These impact gloves are a game changer for our mining operation. The TPR protection on the back of the hand and knuckles is excellent. Very comfortable for all-day wear.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 6,
          reply: "Thank you Michael! We're thrilled these gloves are making a difference in your operations. Your feedback means a lot to us."
        }
      ],
      store: [
        { user: "Liam O.", country: "Ireland", rating: 5, date: "2026-02-08", text: "Brilliant impact protection. Use these daily in our construction firm. Would recommend.", helpful: 3, verified: true },
        { user: "Hans M.", country: "Germany", rating: 5, date: "2026-02-01", text: "Ausgezeichneter Stoßschutz für den Bergbau. Sehr robust und bequem.", helpful: 2, verified: true },
        { user: "George K.", country: "Greece", rating: 4, date: "2026-01-22", text: "Poly kala gantia gia thn epektaxiakh drasthriothta mou.", helpful: 1, verified: true },
        { user: "Ivan R.", country: "Czech Republic", rating: 5, date: "2026-01-18", text: "Vynikající ochrana proti nárazu. Používám každý den v dole.", helpful: 2, verified: true }
      ]
    },
    bundle: ["shield-sleeve", "workwear-set", "safety-goggles"],
    tags: ["防冲击", "TPR", "矿山级", "工业级"],
    faq: [
      { q: "TPR防护是否耐高温？", a: "TPR材质耐温约80-100℃，不适合明火或高温工件。如需耐高温冲击，请参考PandaHEAT™系列。" },
      { q: "最小起订量是多少？", a: "MOQ为200双。" },
      { q: "可以耐油吗？", a: "超纤PU掌部有一定耐油性，但不适合长时间浸泡在油类溶剂中。" },
      { q: "适用哪些行业？", a: "矿山开采、建筑施工、重型装配、物流搬运等冲击风险较高场景。" },
      { q: "交货周期多久？", a: "约30天，大单请提前60天下单。" },
      { q: "可以定制LOGO吗？", a: "可以。300双起接受定制LOGO。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     6. PandaCHEM™ — 防油污 / 酸碱 / 溶剂
     ══════════════════════════════════════ */
  {
    id: "chem-resist",
    name: {
      zh: "PandaCHEM™ 耐酸碱手套",
      en: "PandaCHEM™ Chemical Resistant Glove"
    },
    category: "chem",
    brand: "chem",
    industries: ["chemical", "automotive", "cleaning"],
    shortDesc: {
      zh: "优质丁腈材质，全掌加厚涂层，耐酸碱、耐油、耐溶剂，适用于化工和清洗作业",
      en: "Premium nitrile material, full palm thick coating, acid-alkali-oil-solvent resistant for chemical work"
    },
    attributes: {
      "功能点": "耐酸碱,耐油,耐溶剂,防水",
      "材料": "优质丁腈橡胶（NBR）",
      "应用场景": "化工生产,汽车维修,清洁作业,油污处理",
      "型号": "CHM-NBR5",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 374-1 Type A（J K L P T）",
      "涂层": "丁腈（NBR）全掌加厚涂层",
      "尺码": "7/S - 11/XXL",
      "颜色": "绿色/蓝色/橙色",
      "内衬": "棉质植绒内衬（舒适透气）",
      "袖口": "加长袖口（31cm），化学防护更全面",
      "包装": "12双/袋，120双/箱",
      "单品尺寸": "14×32×0.8 CM",
      "单品净重": "0.180 kg",
      "外箱尺寸": "40×28×30 CM",
      "外箱毛重": "22.0 KG",
      "认证": "CE / EN 374 / ISO 9001",
      "MOQ": "500 双",
      "交货期": "28天"
    },
    price: {
      moq: 500,
      tiers: [
        { qty: "500–2,999", price: "¥22.80", unit: "双" },
        { qty: "3,000–9,999", price: "¥20.50", unit: "双" },
        { qty: "≥10,000", price: "¥18.60", unit: "双" }
      ],
      sample: "¥98.00"
    },
    images: ["image/qiege.jpg", "image/qiege.jpg"],
    colors: [
      { name: "绿色", hex: "#4CAF50" },
      { name: "蓝色", hex: "#2196F3" },
      { name: "橙色", hex: "#E85D00" }
    ],
    sizes: ["7/S", "8/M", "9/L", "10/XL", "11/XXL"],
    certificates: [
      { code: "EN374", name: "EN 374-1", desc: "化学品防护手套标准", level: "Type A (J K L P T) 耐化学性", pdf: "certs/EN374.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", level: "EN 420 / PPE法规", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Chen Wei",
          country: "中国",
          rating: 5,
          date: "2026-01-15",
          specs: "型号: CHM-NBR5 / 尺码: L / 颜色: 绿色",
          text: "在化工厂用了两个月，防酸碱效果非常好，手套柔软不僵硬，穿着舒适。老板很满意！",
          images: [],
          verified: true,
          purchased: true,
          helpful: 5,
          reply: "感谢陈先生的认可！我们很高兴产品能帮到您的化工厂工作。"
        }
      ],
      store: [
        { user: "Fatima A.", country: "Saudi Arabia", rating: 5, date: "2026-02-10", text: "Excellent chemical resistance. Using these in our petrochemical facility. Very satisfied.", helpful: 4, verified: true },
        { user: "Jürgen B.", country: "Germany", rating: 5, date: "2026-02-01", text: "Sehr gute Säure- und Laugenbeständigkeit. Empfehlenswert für die chemische Industrie.", helpful: 2, verified: true },
        { user: "Lucia M.", country: "Italy", rating: 4, date: "2026-01-20", text: "Buona resistenza chimica. Li uso per la pulizia industriale.", helpful: 1, verified: true },
        { user: "Nadia O.", country: "Ukraine", rating: 5, date: "2026-01-12", text: "Відмінна стійкість до хімікатів. Використовую на хімічному виробництві.", helpful: 3, verified: true }
      ]
    },
    bundle: ["chem-apron", "safety-goggles"],
    tags: ["耐酸碱", "丁腈", "化工级", "EN374"],
    faq: [
      { q: "可以耐哪些化学品？", a: "通过EN 374 Type A认证，可防护：J（甲醇）、K（氢氧化钠）、L（硫酸）、P（过氧化氢）、T（甲醛）。如需特定化学品防护，请提供MSDS。" },
      { q: "最长可以使用多长时间？", a: "化学防护手套使用寿命取决于化学品浓度和接触时间。建议每班次更换，或出现渗透迹象时立即更换。" },
      { q: "适合食品接触吗？", a: "本款为工业级，不建议直接接触食品。如需食品级，请参考定制款。" },
      { q: "最小起订量是多少？", a: "MOQ为500双。" },
      { q: "交货周期多久？", a: "约28天，化学防护产品需要额外质检时间。" },
      { q: "可以定制LOGO吗？", a: "可以。500双起接受定制LOGO和包装。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     7. PandaBIO™ — 防生物污染
     ══════════════════════════════════════ */
  {
    id: "bio-protect",
    name: {
      zh: "PandaBIO™ 防生物污染手套",
      en: "PandaBIO™ Bioprotective Glove"
    },
    category: "infection",
    brand: "bio",
    industries: ["medical", "food", "cleaning"],
    shortDesc: {
      zh: "高密度聚乙烯材质，防血液、体液、细菌渗透，适用于医疗和食品处理",
      en: "High-density polyethylene, blood/fluid/bacteria barrier for medical and food handling"
    },
    attributes: {
      "功能点": "防生物污染,防水,一次性使用",
      "材料": "高密度聚乙烯（HDPE）",
      "应用场景": "医疗护理,食品加工,屠宰处理,卫生清洁",
      "型号": "BIO-HDPE1",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 374-2（微生物屏障）/ 食品接触认证",
      "涂层": "无粉处理，光面设计",
      "尺码": "S / M / L / XL",
      "颜色": "蓝色/白色",
      "内衬": "无粉内衬，易穿戴",
      "袖口": "卷边袖口，防滑落",
      "包装": "100只/盒，10盒/箱",
      "单品尺寸": "22×14×0.02 CM",
      "单品净重": "0.004 kg",
      "外箱尺寸": "38×26×20 CM",
      "外箱毛重": "4.5 KG",
      "认证": "CE / 食品接触认证 / ISO 9001",
      "MOQ": "5000 只",
      "交货期": "15天"
    },
    price: {
      moq: 5000,
      tiers: [
        { qty: "5,000–49,999", price: "¥0.68", unit: "只" },
        { qty: "50,000–199,999", price: "¥0.55", unit: "只" },
        { qty: "≥200,000", price: "¥0.45", unit: "只" }
      ],
      sample: "¥35.00"
    },
    images: ["image/qiege.jpg", "image/qiege.jpg"],
    colors: [
      { name: "蓝色", hex: "#2196F3" },
      { name: "白色", hex: "#EEEEEE" }
    ],
    sizes: ["S", "M", "L", "XL"],
    certificates: [
      { code: "EN374", name: "EN 374-2", desc: "微生物屏障标准", level: "通过微生物屏障测试", pdf: "certs/EN374-2.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", level: "EN 420", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Dr. Sarah J.",
          country: "United Kingdom",
          rating: 5,
          date: "2026-01-28",
          specs: "型号: BIO-HDPE1 / 尺码: M / 颜色: 蓝色",
          text: "Excellent barrier protection for our dental practice. Comfortable enough for all-day use and great value for bulk ordering.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 4,
          reply: "Thank you Dr. Johnson! We're glad these gloves meet the high standards of your dental practice."
        }
      ],
      store: [
        { user: "Klaus F.", country: "Germany", rating: 5, date: "2026-02-05", text: "Gute Schutzhandschuhe für den Lebensmittelbereich. Hypoallergen und angenehm zu tragen.", helpful: 2, verified: true },
        { user: "Maria S.", country: "Spain", rating: 4, date: "2026-01-30", text: "Buenos guantes para uso alimentario. Buena relación calidad-precio.", helpful: 1, verified: true },
        { user: "James W.", country: "Canada", rating: 5, date: "2026-01-22", text: "Great for our food processing facility. Durable and food-safe certified.", helpful: 3, verified: true },
        { user: "Kenji Y.", country: "Japan", rating: 5, date: "2026-01-15", text: "食品加工に最適。価格が安く品質もいい。", helpful: 2, verified: true }
      ]
    },
    bundle: [],
    tags: ["防生物污染", "一次性", "食品级", "HDPE"],
    faq: [
      { q: "是否有粉？", a: "无粉处理（powder-free），不易引起过敏，适合长时间穿戴。" },
      { q: "可以重复使用吗？", a: "一次性手套，不建议重复使用。重复使用会降低防护效果。" },
      { q: "适合食品接触吗？", a: "是的，通过食品接触认证，可用于生鲜、肉类、果蔬等食品处理。" },
      { q: "最小起订量是多少？", a: "MOQ为5000只（50盒）。" },
      { q: "有乳胶款吗？", a: "有乳胶款（天然乳胶），适合非乳胶过敏人群，请咨询客服定制。" },
      { q: "交货周期多久？", a: "约15天，大单可安排加急。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     8. PandaVOLT™ — 防电 / 绝缘 / 静电
     ══════════════════════════════════════ */
  {
    id: "volt-insulate",
    name: {
      zh: "PandaVOLT™ 绝缘防护手套",
      en: "PandaVOLT™ Insulated Protective Glove"
    },
    category: "electric",
    brand: "volt",
    industries: ["electric", "construction", "utility"],
    shortDesc: {
      zh: "优质天然乳胶绝缘材料，Class 00级绝缘，适合低电压电气作业",
      en: "Premium natural latex insulation, Class 00 certified, for low-voltage electrical work"
    },
    attributes: {
      "功能点": "绝缘,防静电,耐油",
      "材料": "优质天然乳胶",
      "应用场景": "电力施工,电气维修,配电作业,电信安装",
      "型号": "VOL-LTX00",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 60903 Class 00 / ASTM D120",
      "涂层": "乳胶绝缘材质（内层棉质衬里）",
      "尺码": "7/S - 11/XXL",
      "颜色": "黑色/红色",
      "内衬": "棉质植绒内衬",
      "袖口": "直筒绝缘袖口",
      "包装": "1双/袋，12双/箱",
      "单品尺寸": "30×15×1.5 CM",
      "单品净重": "0.250 kg",
      "外箱尺寸": "40×30×20 CM",
      "外箱毛重": "4.0 KG",
      "认证": "CE / EN 60903 / ASTM D120 / ISO 9001",
      "MOQ": "100 双",
      "交货期": "35天"
    },
    price: {
      moq: 100,
      tiers: [
        { qty: "100–499", price: "¥68.00", unit: "双" },
        { qty: "500–1,999", price: "¥58.00", unit: "双" },
        { qty: "≥2,000", price: "¥52.00", unit: "双" }
      ],
      sample: "¥268.00"
    },
    images: ["image/qiege.jpg", "image/qiege.jpg"],
    colors: [
      { name: "黑色", hex: "#333333" },
      { name: "红色", hex: "#D32F2F" }
    ],
    sizes: ["7/S", "8/M", "9/L", "10/XL", "11/XXL"],
    certificates: [
      { code: "EN60903", name: "EN 60903", desc: "电绝缘手套标准", level: "Class 00（AC 500V / DC 750V）", pdf: "certs/EN60903.pdf" },
      { code: "ASTM", name: "ASTM D120", desc: "美国电绝缘手套标准", level: "Class 00", pdf: "certs/ASTMD120.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Nguyen V.",
          country: "Vietnam",
          rating: 5,
          date: "2026-01-10",
          specs: "型号: VOL-LTX00 / 尺码: L / 颜色: 黑色",
          text: "Excellent insulation performance. We use these daily for our electrical maintenance team. Very comfortable even in hot weather.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 5,
          reply: "Thank you for the wonderful feedback! Safety and comfort together is what we aim for."
        }
      ],
      store: [
        { user: "Omar H.", country: "UAE", rating: 5, date: "2026-02-08", text: "High-quality insulated gloves. Essential for our electrical contracting business.", helpful: 3, verified: true },
        { user: "Peter S.", country: "South Africa", rating: 4, date: "2026-01-28", text: "Good quality for the price. Passed all our safety inspections.", helpful: 2, verified: true },
        { user: "Hassan M.", country: "Egypt", rating: 5, date: "2026-01-20", text: "جودة ممتازة للعزل الكهربائي. أنصح بها بشدة.", helpful: 4, verified: true },
        { user: "Alex T.", country: "USA", rating: 5, date: "2026-01-15", text: "These gloves meet OSHA requirements. Great for our utility workers.", helpful: 3, verified: true }
      ]
    },
    bundle: ["volt-helmet", "volt-boots"],
    tags: ["绝缘", "Class 00", "电工级", "EN60903"],
    faq: [
      { q: "Class 00可以承受多大电压？", a: "Class 00级：交流500V以下/直流750V以下。如需更高电压等级，请参考Class 0-Class 4产品。" },
      { q: "使用前需要检查吗？", a: "是的，每次使用前必须检查手套是否有裂纹、穿孔或老化。如有损坏，立即更换。" },
      { q: "如何储存？", a: "储存于阴凉干燥处，避免阳光直射和臭氧环境。不要折叠或挤压。" },
      { q: "最小起订量是多少？", a: "MOQ为100双。" },
      { q: "有防静电款吗？", a: "本款有一定防静电效果。如需专业ESD防护，请参考定制款。" },
      { q: "交货周期多久？", a: "约35天，绝缘手套需额外电气安全测试，请提前下单。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     9. PandaHEAT™ — 防火 / 阻燃 / 耐高温
     ══════════════════════════════════════ */
  {
    id: "heat-nomex",
    name: {
      zh: "PandaHEAT™ Nomex® 阻燃手套",
      en: "PandaHEAT™ Nomex® Flame Resistant Glove"
    },
    category: "flame",
    brand: "heat",
    industries: ["metal", "foundry", "welding"],
    shortDesc: {
      zh: "杜邦Nomex®芳纶纤维，阻燃隔热，EN 407 认证，适合焊接和高温作业",
      en: "DuPont Nomex® aramid fiber, flame resistant, EN 407 certified, for welding and high-temperature work"
    },
    attributes: {
      "功能点": "阻燃,隔热,防火花,耐高温",
      "材料": "Nomex® 杜邦芳纶纤维 / 铝箔隔热层",
      "应用场景": "金属冶炼,铸造,焊接,高温炉前作业",
      "型号": "HEA-NMX5",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 407 Level 4（阻燃）/ ANSI 107 高可见",
      "涂层": "铝箔复合隔热层",
      "尺码": "7/S - 11/XXL",
      "颜色": "银色/灰白色",
      "内衬": "Nomex® 芳纶纤维编织",
      "袖口": "加长阻燃袖口（15cm）",
      "包装": "6双/袋，60双/箱",
      "单品尺寸": "15×35×1.2 CM",
      "单品净重": "0.220 kg",
      "外箱尺寸": "45×30×25 CM",
      "外箱毛重": "14.0 KG",
      "认证": "CE / EN 407 / ISO 9001 / SGS",
      "MOQ": "200 双",
      "交货期": "40天"
    },
    price: {
      moq: 200,
      tiers: [
        { qty: "200–999", price: "¥88.00", unit: "双" },
        { qty: "1,000–4,999", price: "¥76.00", unit: "双" },
        { qty: "≥5,000", price: "¥68.00", unit: "双" }
      ],
      sample: "¥368.00"
    },
    images: ["image/qiege.jpg", "image/qiege.jpg"],
    colors: [
      { name: "银色", hex: "#C0C0C0" },
      { name: "灰白色", hex: "#D3D3D3" }
    ],
    sizes: ["7/S", "8/M", "9/L", "10/XL", "11/XXL"],
    certificates: [
      { code: "EN407", name: "EN 407", desc: "热/火防护手套标准", level: "Level 4 阻燃 / Level 4 隔热", pdf: "certs/EN407.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", level: "EN 420 / PPE法规", pdf: "certs/CE.pdf" },
      { code: "ISO", name: "ISO 9001", desc: "质量管理体系认证", level: "2015版", pdf: "certs/ISO9001.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Jose M.",
          country: "Mexico",
          rating: 5,
          date: "2026-01-22",
          specs: "型号: HEA-NMX5 / 尺码: L / 颜色: 银色",
          text: "The best heat-resistant gloves we've used in our foundry. Nomex quality is evident - no scorching even after hours near the furnace.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 7,
          reply: "Thank you Jose! Nomex® quality makes a real difference in extreme heat environments. We're glad they serve you well."
        }
      ],
      store: [
        { user: "Wei Chen", country: "中国", rating: 5, date: "2026-02-10", text: "焊接作业用这款太好了，耐高温不烧穿。铝箔隔热层真的有用。", helpful: 5, verified: true },
        { user: "Viktor N.", country: "Russia", rating: 5, date: "2026-02-01", text: "Otlichnye termostoykie perchatki. Ispolzuyu dlya svarki i raboty u pechi.", helpful: 3, verified: true },
        { user: "Ahmad R.", country: "Turkey", rating: 5, date: "2026-01-25", text: "Kaynak işlerimde kullaniyorum. Isiya karsi çok dayanikli.", helpful: 4, verified: true },
        { user: "Sven P.", country: "Norway", rating: 4, date: "2026-01-18", text: "God varmeisolasjon. Bruker disse ved smelteovnen.", helpful: 2, verified: true }
      ]
    },
    bundle: ["heat-jacket", "heat-helmet", "safety-goggles"],
    tags: ["阻燃", "Nomex®", "焊接级", "EN407"],
    faq: [
      { q: "最高可以承受多少温度？", a: "EN 407 Level 4认证可承受接触温度高达500°C，短时接触200°C。具体请参考产品规格书。" },
      { q: "Nomex®和普通阻燃材料的区别？", a: "Nomex®是杜邦专利芳纶纤维，离开火源后自熄不熔化，不滴落，不像普通材料会粘连皮肤。" },
      { q: "最小起订量是多少？", a: "MOQ为200双。" },
      { q: "可以水洗吗？", a: "可以，但建议用冷水轻柔手洗，避免拧绞。机洗请使用洗衣袋。" },
      { q: "适用于电焊吗？", a: "完全适用，EN 407认证专为焊接和高温作业设计。" },
      { q: "交货周期多久？", a: "约40天，Nomex®材料需要提前备料，建议提前60天下单。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     10. PandaFROST™ — 防寒 / 保暖
     ══════════════════════════════════════ */
  {
    id: "frost-protect",
    name: {
      zh: "PandaFROST™ 冬季防寒手套",
      en: "PandaFROST™ Winter Thermal Glove"
    },
    category: "cold",
    brand: "frost",
    industries: ["cold", "construction", "logistics"],
    shortDesc: {
      zh: "高性能保暖内衬，防水外层，-30°C耐寒，适用于寒冷气候户外作业",
      en: "High-performance thermal liner, waterproof outer, -30°C cold protection for outdoor winter work"
    },
    attributes: {
      "功能点": "防寒,防水,保暖,防风",
      "材料": "优质羊毛混纺内衬 / PVC防水外层",
      "应用场景": "寒冷施工,冷链物流,户外维修,冬季救援",
      "型号": "FRS-WL30",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 511（防寒手套标准）/ 防水 Class 2",
      "涂层": "PVC防水涂层 + 防风外层",
      "尺码": "7/S - 11/XXL",
      "颜色": "深灰色/黑色/军绿色",
      "内衬": "羊毛混纺保暖内衬（可拆卸清洗）",
      "袖口": "加长防风袖口，带收紧绳",
      "包装": "6双/袋，60双/箱",
      "单品尺寸": "14×28×2.0 CM",
      "单品净重": "0.280 kg",
      "外箱尺寸": "50×35×25 CM",
      "外箱毛重": "18.0 KG",
      "认证": "CE / EN 511 / ISO 9001",
      "MOQ": "200 双",
      "交货期": "30天"
    },
    price: {
      moq: 200,
      tiers: [
        { qty: "200–999", price: "¥48.00", unit: "双" },
        { qty: "1,000–4,999", price: "¥42.00", unit: "双" },
        { qty: "≥5,000", price: "¥36.00", unit: "双" }
      ],
      sample: "¥168.00"
    },
    images: ["image/qiege.jpg", "image/qiege.jpg"],
    colors: [
      { name: "深灰色", hex: "#444444" },
      { name: "黑色", hex: "#333333" },
      { name: "军绿色", hex: "#556B2F" }
    ],
    sizes: ["7/S", "8/M", "9/L", "10/XL", "11/XXL"],
    certificates: [
      { code: "EN511", name: "EN 511", desc: "防寒手套标准", level: "Level 2 接触寒冷 / Level 2 防水", pdf: "certs/EN511.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", level: "EN 420", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Viktor J.",
          country: "Norway",
          rating: 5,
          date: "2026-01-05",
          specs: "型号: FRS-WL30 / 尺码: L / 颜色: 深灰色",
          text: "These are the warmest work gloves I've used in my 15 years in Arctic construction. The wool liner is excellent and the waterproof outer really works.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 8,
          reply: "Thank you Viktor! Keeping workers warm in extreme conditions is what PandaFROST™ is designed for. Glad they passed the Arctic test!"
        }
      ],
      store: [
        { user: "Chen Guang",
          country: "中国",
          rating: 5,
          date: "2026-01-28",
          text: "东北冬天干活全靠这手套，零下30度手也不冷。保暖效果特别好。",
          helpful: 6,
          verified: true
        },
        { user: "Mikael A.", country: "Finland", rating: 5, date: "2026-01-20", text: "Erinomaisen lämpimät työkäsineet. Suosittelen talvikäyttöön.", helpful: 4, verified: true },
        { user: "Igor S.", country: "Russia", rating: 4, date: "2026-01-15", text: "Khoroshiye perchatki dlya zimney stroyki. Teploy i ne prokachivayut vodu.", helpful: 3, verified: true },
        { user: "Kai L.", country: "Estonia", rating: 5, date: "2026-01-10", text: "Parimad talvised kaitsekindaid, mida olen kasutanud.", helpful: 2, verified: true }
      ]
    },
    bundle: ["frost-jacket", "frost-boots"],
    tags: ["防寒", "保暖", "-30°C", "防水"],
    faq: [
      { q: "最低可以承受多少度？", a: "通过EN 511认证，适合-30°C环境使用。具体保温性能取决于穿戴时间和活动量。" },
      { q: "防水内衬可以清洗吗？", a: "可以。保暖内衬可拆卸单独清洗，外层用湿布擦拭即可。" },
      { q: "适用于户外冷冻库作业吗？", a: "完全适用，冷链物流和冷冻库（-25°C到-30°C）均可使用。" },
      { q: "最小起订量是多少？", a: "MOQ为200双。" },
      { q: "可以定制LOGO吗？", a: "可以。300双起接受定制LOGO。" },
      { q: "交货周期多久？", a: "约30天，大单请提前45天下单。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     11. PandaGRIP™ — 防震 / 防滑
     ══════════════════════════════════════ */
  {
    id: "grip-vibro",
    name: {
      zh: "PandaGRIP™ 抗振动手套",
      en: "PandaGRIP™ Anti-Vibration Glove"
    },
    category: "vibration",
    brand: "grip",
    industries: ["construction", "mining", "mechanical"],
    shortDesc: {
      zh: "VLR减振凝胶垫，EN ISO 10819认证，有效减少手持振动工具的振动传递",
      en: "VLR vibration-damping gel pad, EN ISO 10819 certified, reduces vibration from power tools"
    },
    attributes: {
      "功能点": "抗振动,防滑,减震,舒适",
      "材料": "尼龙弹性布 / VLR减振凝胶 / 超纤皮掌",
      "应用场景": "建筑施工,矿山开采,道路维修,重型装配",
      "型号": "GRP-VLR3",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN ISO 10819（抗振动手套）/ EN 388 耐磨 3级",
      "涂层": "超纤PU皮掌部防滑涂层",
      "尺码": "7/S - 11/XXL",
      "颜色": "黑色/灰黑色",
      "内衬": "VLR减振凝胶垫（手掌区域）",
      "袖口": "可调节魔术贴袖口",
      "包装": "6双/袋，60双/箱",
      "单品尺寸": "12×14×1.2 CM",
      "单品净重": "0.165 kg",
      "外箱尺寸": "45×30×28 CM",
      "外箱毛重": "11.0 KG",
      "认证": "CE / EN ISO 10819 / ISO 9001",
      "MOQ": "200 双",
      "交货期": "28天"
    },
    price: {
      moq: 200,
      tiers: [
        { qty: "200–999", price: "¥65.00", unit: "双" },
        { qty: "1,000–4,999", price: "¥56.00", unit: "双" },
        { qty: "≥5,000", price: "¥50.00", unit: "双" }
      ],
      sample: "¥218.00"
    },
    images: ["image/qiege.jpg", "image/qiege.jpg"],
    colors: [
      { name: "黑色", hex: "#333333" },
      { name: "灰黑色", hex: "#555555" }
    ],
    sizes: ["7/S", "8/M", "9/L", "10/XL", "11/XXL"],
    certificates: [
      { code: "ISO10819", name: "EN ISO 10819", desc: "抗振动手套标准", level: "VLR 区域减振效果符合标准", pdf: "certs/ISO10819.pdf" },
      { code: "EN388", name: "EN 388", desc: "机械风险防护手套标准", level: "Level 3 耐磨", pdf: "certs/EN388.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Carlos R.",
          country: "Chile",
          rating: 5,
          date: "2026-01-12",
          specs: "型号: GRP-VLR3 / 尺码: L / 颜色: 黑色",
          text: "Great for our jackhammer operators. Noticeably reduces vibration and the palm padding is very comfortable. Workers love them.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 6,
          reply: "Thank you Carlos! Protecting workers from HAV is crucial. We're glad these make a real difference."
        }
      ],
      store: [
        { user: "Günter W.", country: "Germany", rating: 5, date: "2026-02-03", text: "Sehr gute Vibrationsdämpfung. Verwende diese beim Presslufthammer.", helpful: 3, verified: true },
        { user: "Steve M.", country: "Australia", rating: 4, date: "2026-01-28", text: "Good anti-vibration gloves. Comfortable for all-day use with power tools.", helpful: 2, verified: true },
        { user: "Ravi K.", country: "India", rating: 5, date: "2026-01-20", text: "Excellent vibration reduction for our road construction work. Highly recommended.", helpful: 4, verified: true },
        { user: "Jonas L.", country: "Sweden", rating: 4, date: "2026-01-15", text: "Bra vibrationsdämpning. Använder vid bergborrmaskinen.", helpful: 1, verified: true }
      ]
    },
    bundle: ["impact-resist", "workwear-set"],
    tags: ["抗振动", "HAV", "建筑级", "EN ISO 10819"],
    faq: [
      { q: "EN ISO 10819认证是什么？", a: "EN ISO 10819是国际抗振动手套标准，测试振动工具的手套振动传递率。通过认证表示有效减少手臂振动伤害（HAV）。" },
      { q: "适用于电钻吗？", a: "是的，VLR凝胶可有效减少中低频振动（25-400Hz），适合电钻、冲击钻等工具。" },
      { q: "不适合哪些工具？", a: "高频振动工具（如角磨机）需要不同的减振方案，请参考我们的专业咨询。" },
      { q: "最小起订量是多少？", a: "MOQ为200双。" },
      { q: "凝胶垫可以更换吗？", a: "标准款不可更换，高端款（定制）可拆卸更换。请咨询客服。" },
      { q: "交货周期多久？", a: "约28天。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     12. PandaECO™ — 环保可持续手套
     ══════════════════════════════════════ */
  {
    id: "eco-recycled",
    name: {
      zh: "PandaECO™ 再生纤维防护手套",
      en: "PandaECO™ Recycled Fiber Protective Glove"
    },
    category: "eco",
    brand: "eco",
    industries: ["food", "agriculture", "general"],
    shortDesc: {
      zh: "回收涤纶纤维材质，环保可降解，舒适透气，适合轻量级防护和食品处理",
      en: "Recycled polyester fiber, eco-friendly biodegradable, comfortable for light-duty and food handling"
    },
    attributes: {
      "功能点": "环保再生,透气,轻量防护",
      "材料": "再生涤纶纤维（rPET）/ 再生棉",
      "应用场景": "食品加工,农业采摘,轻量级装配,仓库分拣",
      "型号": "ECO-RCY1",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 388 耐磨 2级 / 食品接触认证",
      "涂层": "再生乳胶掌部防滑涂层（无溶剂工艺）",
      "尺码": "7/S - 11/XXL",
      "颜色": "浅绿色/米白色/蓝色",
      "内衬": "再生棉混纺内衬",
      "袖口": "针织袖口",
      "包装": "12双/袋，144双/箱（100%可回收纸箱）",
      "单品尺寸": "10×12×0.4 CM",
      "单品净重": "0.040 kg",
      "外箱尺寸": "40×28×22 CM",
      "外箱毛重": "6.5 KG",
      "认证": "CE / GRS全球回收标准 / ISO 9001",
      "MOQ": "500 双",
      "交货期": "20天"
    },
    price: {
      moq: 500,
      tiers: [
        { qty: "500–2,999", price: "¥12.80", unit: "双" },
        { qty: "3,000–9,999", price: "¥11.20", unit: "双" },
        { qty: "≥10,000", price: "¥9.80", unit: "双" }
      ],
      sample: "¥58.00"
    },
    images: ["image/qiege.jpg", "image/qiege.jpg"],
    colors: [
      { name: "浅绿色", hex: "#8BC34A" },
      { name: "米白色", hex: "#F5F5DC" },
      { name: "蓝色", hex: "#2196F3" }
    ],
    sizes: ["7/S", "8/M", "9/L", "10/XL", "11/XXL"],
    certificates: [
      { code: "GRS", name: "GRS 认证", desc: "全球回收标准", level: "认证再生材料含量≥50%", pdf: "certs/GRS.pdf" },
      { code: "EN388", name: "EN 388", desc: "机械风险防护手套标准", level: "Level 2 耐磨", pdf: "certs/EN388.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Emma L.",
          country: "Netherlands",
          rating: 5,
          date: "2026-01-25",
          specs: "型号: ECO-RCY1 / 尺码: M / 颜色: 浅绿色",
          text: "Perfect for our organic farm. Comfortable, breathable and eco-friendly. Our team loves them and they hold up well during harvest.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 5,
          reply: "Thank you Emma! Supporting sustainable farming with eco-friendly PPE is what PandaECO™ is all about."
        }
      ],
      store: [
        { user: "Sophie R.", country: "France", rating: 5, date: "2026-02-06", text: "Excellents gants écologiques. Confortables et respectueux de l'environnement.", helpful: 3, verified: true },
        { user: "Lucas B.", country: "Belgium", rating: 4, date: "2026-01-30", text: "Goede ecologische handschoenen. Gebruik ze voor voedselverwerking.", helpful: 2, verified: true },
        { user: "Yuki A.", country: "Japan", rating: 5, date: "2026-01-22", text: "環境に配慮した手袋で嬉しいです。農作業に最適です。", helpful: 3, verified: true },
        { user: "Mark T.", country: "New Zealand", rating: 5, date: "2026-01-15", text: "Great eco-friendly gloves for our food processing facility. Breathable and comfortable.", helpful: 2, verified: true }
      ]
    },
    bundle: [],
    tags: ["环保", "再生纤维", "GRS认证", "食品级"],
    faq: [
      { q: "再生纤维含量是多少？", a: "通过GRS认证，再生材料含量≥50%（每批次提供GRS证书）。" },
      { q: "环保手套和普通手套的区别？", a: "使用回收涤纶和再生棉，减少原生材料消耗；无溶剂涂层工艺减少VOC排放；包装使用100%可回收纸箱。" },
      { q: "适合食品接触吗？", a: "是的，有食品接触认证，可用于食品加工和农产品处理。" },
      { q: "最小起订量是多少？", a: "MOQ为500双。" },
      { q: "有其他环保认证吗？", a: "目前有GRS和CE认证，OEKO-TEX认证正在申请中。" },
      { q: "交货周期多久？", a: "约20天。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     13. 丁腈耐油手套（兼容品牌体系）
     ══════════════════════════════════════ */
  {
    id: "nitrile-oil",
    name: {
      zh: "PandaSHIELD™ 丁腈耐油手套",
      en: "PandaSHIELD™ Nitrile Oil-Resistant Glove"
    },
    category: "oil",
    brand: "shield",
    industries: ["automotive", "chemical", "mechanical"],
    shortDesc: {
      zh: "丁腈橡胶涂层，全掌防油，EN 374 认证，适用于油污环境",
      en: "Full nitrile rubber coating, EN 374 certified, oil-proof for industrial use"
    },
    attributes: {
      "功能点": "防油,耐溶剂,防滑",
      "材料": "丁腈橡胶（NBR）/ 棉内衬",
      "应用场景": "汽车维修,化工生产,机械制造",
      "型号": "SHD-NBR3",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 374-1 Type A / CE认证",
      "涂层": "丁腈（NBR）全掌涂层",
      "尺码": "7/S - 11/XXL",
      "颜色": "蓝色/黑色/绿色",
      "内衬": "棉质植绒内衬",
      "袖口": "卷边袖口",
      "包装": "12双/袋，120双/箱",
      "单品尺寸": "10×12×0.5 CM",
      "单品净重": "0.055 kg",
      "外箱尺寸": "40×28×25 CM",
      "外箱毛重": "7.5 KG",
      "认证": "CE / EN 374 / ISO 9001",
      "MOQ": "500 双",
      "交货期": "20天（≥8000双）"
    },
    price: {
      moq: 500,
      tiers: [
        { qty: "500–4,999", price: "¥12.50", unit: "双" },
        { qty: "5,000–9,999", price: "¥11.80", unit: "双" },
        { qty: "≥10,000", price: "¥10.90", unit: "双" }
      ],
      sample: "¥45.00"
    },
    images: ["image/qiege.jpg", "image/qiege.jpg"],
    colors: [
      { name: "蓝色", hex: "#2196F3" },
      { name: "黑色", hex: "#333333" },
      { name: "绿色", hex: "#4CAF50" }
    ],
    sizes: ["7/S", "8/M", "9/L", "10/XL", "11/XXL"],
    certificates: [
      { code: "EN374", name: "EN 374-1", desc: "化学品防护手套标准", level: "Type A（J K L P T）", pdf: "certs/EN374.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Tony B.",
          country: "Australia",
          rating: 5,
          date: "2026-01-30",
          specs: "型号: SHD-NBR3 / 尺码: L / 颜色: 蓝色",
          text: "Best nitrile gloves I've used for our auto repair shop. The oil resistance is excellent and they're very comfortable.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 3,
          reply: "Thank you Tony! We're glad these gloves handle the tough oil and grease in auto repair work."
        }
      ],
      store: [
        { user: "Rui Zhang", country: "中国", rating: 5, date: "2026-02-05", text: "汽修店一直在用，防油效果很好，价格也实惠。", helpful: 4, verified: true },
        { user: "Klaus P.", country: "Germany", rating: 4, date: "2026-01-28", text: "Gute Ölbeständigkeit. Verwende diese in meiner KFZ-Werkstatt.", helpful: 2, verified: true },
        { user: "Amit S.", country: "India", rating: 5, date: "2026-01-22", text: "Excellent oil resistance. Perfect for our automotive repair business.", helpful: 3, verified: true },
        { user: "Pedro G.", country: "Brazil", rating: 4, date: "2026-01-15", text: "Bons guantes para oficinas mecânicas. Boa relação custo-benefício.", helpful: 1, verified: true }
      ]
    },
    bundle: ["shield-sleeve", "workwear-set"],
    tags: ["耐油", "丁腈", "汽修级", "EN374"],
    faq: [
      { q: "丁腈涂层是否耐所有溶剂？", a: "丁腈对大多数油类、脂类和溶剂有良好防护，但对酮类、酯类、某些芳香烃耐受性有限。具体请提供MSDS确认。" },
      { q: "适合食品接触吗？", a: "工业级丁腈不适合食品接触。如需食品级，请参考PandaBIO™系列。" },
      { q: "最小起订量是多少？", a: "MOQ为500双。" },
      { q: "交货周期多久？", a: "≥8,000双约20天，具体以合同确认为准。" },
      { q: "可以定制LOGO吗？", a: "可以。1000双起接受定制LOGO。" },
      { q: "支持哪些付款方式？", a: "支持 T/T、L/C、PayPal等。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     14. 乳胶耐热手套（兼容品牌体系）
     ══════════════════════════════════════ */
  {
    id: "latex-heat",
    name: {
      zh: "PandaHEAT™ 乳胶耐热防滑手套",
      en: "PandaHEAT™ Latex Heat-Resistant Glove"
    },
    category: "heat",
    brand: "heat",
    industries: ["agriculture", "construction", "general"],
    shortDesc: {
      zh: "天然乳胶浸胶，高温防护，防皱设计，适用于园艺和重型工作",
      en: "Natural latex coating, heat-resistant, wrinkle design for gardening and heavy-duty work"
    },
    attributes: {
      "功能点": "耐热,防滑,透气,防皱",
      "材料": "天然乳胶 / 棉/涤纶内衬",
      "应用场景": "农业采摘,建筑施工,园艺,食品加工",
      "型号": "HEA-LTX2",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 388 耐磨 3级 / 食品接触认证",
      "涂层": "乳胶浸胶掌部（防皱纹理）",
      "尺码": "7/S - 11/XXL",
      "颜色": "棕色/绿色",
      "内衬": "棉涤纶混纺内衬",
      "袖口": "安全袖口",
      "包装": "12双/袋，120双/箱",
      "单品尺寸": "10×12×0.5 CM",
      "单品净重": "0.060 kg",
      "外箱尺寸": "40×28×25 CM",
      "外箱毛重": "8.0 KG",
      "认证": "CE / ISO 9001 / 食品接触认证",
      "MOQ": "200 双",
      "交货期": "18天"
    },
    price: {
      moq: 200,
      tiers: [
        { qty: "200–1,999", price: "¥8.80", unit: "双" },
        { qty: "2,000–9,999", price: "¥7.90", unit: "双" },
        { qty: "≥10,000", price: "¥7.20", unit: "双" }
      ],
      sample: "¥38.00"
    },
    images: ["image/qiege.jpg", "image/qiege.jpg"],
    colors: [
      { name: "棕色", hex: "#8B4513" },
      { name: "绿色", hex: "#4CAF50" }
    ],
    sizes: ["7/S", "8/M", "9/L", "10/XL", "11/XXL"],
    certificates: [
      { code: "EN388", name: "EN 388", desc: "机械风险防护手套标准", level: "Level 3 耐磨", pdf: "certs/EN388.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Anna F.",
          country: "Germany",
          rating: 5,
          date: "2026-01-18",
          specs: "型号: HEA-LTX2 / 尺码: M / 颜色: 棕色",
          text: "Sehr gut für Gartenarbeit und Landwirtschaft. Die Hitzebeständigkeit ist gut und sie sind sehr angenehm zu tragen.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 3,
          reply: "Danke Anna! Wir freuen uns, dass diese Handschuhe für Ihre landwirtschaftlichen Bedürfnisse geeignet sind."
        }
      ],
      store: [
        { user: "Li Hua", country: "中国", rating: 5, date: "2026-02-08", text: "种地摘菜用的，防滑效果好，透气不闷手。", helpful: 4, verified: true },
        { user: "Oscar M.", country: "Spain", rating: 4, date: "2026-01-28", text: "Buenos guantes para agricultura. Buenos precios.", helpful: 2, verified: true },
        { user: "Paul J.", country: "Kenya", rating: 5, date: "2026-01-20", text: "Perfect for our tea plantation work. Comfortable in hot weather.", helpful: 3, verified: true },
        { user: "Nina K.", country: "Ukraine", rating: 4, date: "2026-01-12", text: "Good gloves for farm work. Heat protection is decent for the price.", helpful: 1, verified: true }
      ]
    },
    bundle: ["eco-recycled", "workwear-set"],
    tags: ["耐热", "乳胶", "农业级", "食品级"],
    faq: [
      { q: "耐热温度是多少？", a: "乳胶涂层可短时承受高达200°C的接触温度。不适合明火作业。" },
      { q: "适合食品加工吗？", a: "有食品接触认证，可用于食品加工和农产品处理。" },
      { q: "最小起订量是多少？", a: "MOQ为200双。" },
      { q: "可以定制颜色吗？", a: "可以，3000双起接受颜色定制。" },
      { q: "交货周期多久？", a: "约18天。" },
      { q: "适合汽修吗？", a: "乳胶手套不适合油污环境，建议选用PandaSHIELD™丁腈耐油款。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     15. 防切割护臂套
     ══════════════════════════════════════ */
  {
    id: "shield-sleeve",
    name: {
      zh: "PandaSHIELD™ 防切割护臂套",
      en: "PandaSHIELD™ Cut-Resistant Arm Sleeve"
    },
    category: "cut",
    brand: "shield",
    industries: ["metal", "glass", "mechanical"],
    shortDesc: {
      zh: "HPPE材质，5级防切割，全手臂防护，可选40/50/60cm长度",
      en: "HPPE material, Level 5 cut resistance, full arm protection, 40/50/60cm options"
    },
    attributes: {
      "功能点": "防切割,耐磨,透气",
      "材料": "HPPE / 不锈钢丝",
      "应用场景": "金属加工,玻璃处理,食品切割",
      "型号": "SHD-SLV5",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 388 Level 5 切割",
      "涂层": "无缝编织，拇指扣设计",
      "尺码": "40cm / 50cm / 60cm",
      "颜色": "白色/灰色",
      "内衬": "13针HPPE无缝编织",
      "袖口": "弹性袖口，防滑落",
      "包装": "10只/袋，100只/箱",
      "单品尺寸": "8×40×0.3 CM",
      "单品净重": "0.040 kg",
      "外箱尺寸": "40×30×20 CM",
      "外箱毛重": "5.0 KG",
      "认证": "CE / ISO 9001",
      "MOQ": "500 只",
      "交货期": "20天"
    },
    price: {
      moq: 500,
      tiers: [
        { qty: "500–2,999", price: "¥16.50", unit: "只" },
        { qty: "3,000–9,999", price: "¥14.80", unit: "只" },
        { qty: "≥10,000", price: "¥13.20", unit: "只" }
      ],
      sample: "¥68.00"
    },
    images: ["image/qiege.jpg"],
    colors: [
      { name: "白色", hex: "#F5F5F5" },
      { name: "灰色", hex: "#AAAAAA" }
    ],
    sizes: ["40cm", "50cm", "60cm"],
    certificates: [
      { code: "EN388", name: "EN 388", desc: "机械风险防护手套标准", level: "Level 5 切割", pdf: "certs/EN388.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Thomas K.",
          country: "Germany",
          rating: 5,
          date: "2026-01-20",
          specs: "型号: SHD-SLV5 / 尺码: 50cm / 颜色: 白色",
          text: "Excellent arm protection for our glass processing line. The HPPE material is very comfortable and the thumb hole keeps it in place.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 4,
          reply: "Danke Thomas! We're glad the thumb hole design works well for your glass processing line."
        }
      ],
      store: [
        { user: "Zhang Wei", country: "中国", rating: 5, date: "2026-02-01", text: "食品切割用，防护到位，价格便宜。", helpful: 3, verified: true },
        { user: "George C.", country: "USA", rating: 5, date: "2026-01-25", text: "Great cut protection for meat processing. Very comfortable for all-day wear.", helpful: 2, verified: true },
        { user: "Kai M.", country: "Sweden", rating: 4, date: "2026-01-18", text: "Bra arm.skydd för metallbearbetning. Bra pris.", helpful: 1, verified: true },
        { user: "Andrei V.", country: "Russia", rating: 5, date: "2026-01-12", text: "Otlichnaya zashchita ruk i predplechiy. Udobno i praktichno.", helpful: 3, verified: true }
      ]
    },
    bundle: ["shield-cut5", "safety-goggles"],
    tags: ["护臂套", "防切割", "HPPE"],
    faq: [
      { q: "护臂套可以和手套连接使用吗？", a: "可以，我们的护臂套有拇指扣设计，可与手套重叠使用，形成完整的手臂防护。" },
      { q: "有不同防护等级可选吗？", a: "有Level 3、Level 5两级可选。Level 5防护更强，适合金属加工和玻璃处理。" },
      { q: "最小起订量是多少？", a: "MOQ为500只。" },
      { q: "可以洗涤吗？", a: "可以，冷水手洗，避免拧绞，自然晾干。洗涤会略微降低切割等级。" },
      { q: "交货周期多久？", a: "约20天。" },
      { q: "有左右手区别吗？", a: "无缝编织设计，无左右手区分，左右均可使用。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     16. 防护安全护目镜
     ══════════════════════════════════════ */
  {
    id: "safety-goggles",
    name: {
      zh: "熊猫手护 防护安全护目镜",
      en: "Panda Guard Safety Protective Goggles"
    },
    category: "static",
    brand: "shield",
    industries: ["metal", "chemical", "construction"],
    shortDesc: {
      zh: "PC镜片，防雾防紫外线，防飞溅，一体式密封设计",
      en: "PC lens, anti-fog, UV protection, splash resistant, seamless seal design"
    },
    attributes: {
      "功能点": "防飞溅,防雾,防紫外线,防刮",
      "材料": "PC聚碳酸酯镜片 / TPU框架",
      "应用场景": "金属加工,化工,建筑施工,实验室",
      "型号": "GOG-PC1",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "ANSI Z87.1 / EN 166",
      "涂层": "双面防雾涂层 + 防刮硬化层",
      "尺码": "均码（可调节头带）",
      "颜色": "透明/灰色镜片",
      "内衬": "柔软TPU鼻托和眉框",
      "袖口": "弹性编织头带，可调节",
      "包装": "12副/盒，144副/箱",
      "单品尺寸": "16×8×8 CM",
      "单品净重": "0.095 kg",
      "外箱尺寸": "50×40×35 CM",
      "外箱毛重": "15.5 KG",
      "认证": "CE / ANSI Z87.1 / EN 166 / ISO 9001",
      "MOQ": "200 副",
      "交货期": "15天"
    },
    price: {
      moq: 200,
      tiers: [
        { qty: "200–999", price: "¥28.00", unit: "副" },
        { qty: "1,000–4,999", price: "¥24.50", unit: "副" },
        { qty: "≥5,000", price: "¥21.00", unit: "副" }
      ],
      sample: "¥98.00"
    },
    images: ["image/qiege.jpg"],
    colors: [
      { name: "透明", hex: "#e8f4f8" },
      { name: "灰色", hex: "#607D8B" }
    ],
    sizes: ["均码"],
    certificates: [
      { code: "ANSI", name: "ANSI Z87.1", desc: "美国工业安全护目镜标准", level: "Z87+ 高冲击防护", pdf: "certs/ANSIZ87.pdf" },
      { code: "EN166", name: "EN 166", desc: "欧洲工业护目镜标准", level: " optical class 1 / mechanical strength S", pdf: "certs/EN166.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "David W.",
          country: "USA",
          rating: 5,
          date: "2026-01-25",
          specs: "型号: GOG-PC1 / 镜片: 透明",
          text: "Best safety goggles I've worn. The anti-fog coating really works even in humid conditions. Very comfortable for all-day use.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 5,
          reply: "Thank you David! The dual anti-fog coating is our key feature. We're glad it performs well in real work conditions."
        }
      ],
      store: [
        { user: "Wei Fang", country: "中国", rating: 5, date: "2026-02-08", text: "眼镜防雾效果很好，价格便宜量大。", helpful: 4, verified: true },
        { user: "Martin S.", country: "Germany", rating: 5, date: "2026-01-30", text: "Sehr gute Schutzbrille. Die Antibeschlagbeschichtung funktioniert einwandfrei.", helpful: 3, verified: true },
        { user: "Raj P.", country: "India", rating: 4, date: "2026-01-22", text: "Good anti-fog safety goggles for our chemical lab. Comfortable fit.", helpful: 2, verified: true },
        { user: "Luis M.", country: "Mexico", rating: 5, date: "2026-01-15", text: "Excelentes gafas de seguridad. Muy cómodas y con buen防雾效果。", helpful: 3, verified: true }
      ]
    },
    bundle: ["shield-cut5", "workwear-set", "shield-sleeve"],
    tags: ["护目镜", "防护", "ANSI Z87", "防雾"],
    faq: [
      { q: "可以佩戴近视眼镜吗？", a: "可以，宽体设计可容纳大多数近视眼镜。建议先试戴确认舒适性。" },
      { q: "镜片可以更换吗？", a: "标准款为一体式设计，不可更换。备用镜片服务请联系客服定制。" },
      { q: "适合焊接辅助作业吗？", a: "不适合，焊接需要专用的焊接护目镜。请使用EN 169或ANSI Z87.2标准产品。" },
      { q: "最小起订量是多少？", a: "MOQ为200副。" },
      { q: "有防蓝光款吗？", a: "有，可定制防蓝光镜片款，请咨询客服。" },
      { q: "交货周期多久？", a: "约15天，大单可安排加急。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     17. 防切割工作服套装
     ══════════════════════════════════════ */
  {
    id: "workwear-set",
    name: {
      zh: "熊猫手护 防切割工作服套装",
      en: "Panda Guard Cut-Resistant Workwear Set"
    },
    category: "cut",
    brand: "shield",
    industries: ["metal", "mechanical", "food"],
    shortDesc: {
      zh: "全身防护套装，含防护上衣和裤子，HPPE防切割面料全身覆盖",
      en: "Full body protection set, protective jacket and pants, HPPE cut-resistant fabric throughout"
    },
    attributes: {
      "功能点": "防切割,全身防护,耐磨",
      "材料": "HPPE防切割面料（主体）/ 涤纶加固",
      "应用场景": "金属加工,食品切割加工,机械制造",
      "型号": "WRK-SET1",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "A4 级全身切割防护",
      "涂层": "局部PU加固（肘部/膝部）",
      "尺码": "S / M / L / XL / 2XL / 3XL",
      "颜色": "灰色/深蓝色",
      "内衬": "透气网布内衬",
      "袖口": "魔术贴可调节袖口 + 松紧下摆",
      "包装": "1套/袋，10套/箱",
      "单品尺寸": "50×40×5 CM",
      "单品净重": "1.200 kg",
      "外箱尺寸": "60×45×40 CM",
      "外箱毛重": "13.5 KG",
      "认证": "CE / EN ISO 13997（全身切割）/ ISO 9001",
      "MOQ": "50 套",
      "交货期": "35天"
    },
    price: {
      moq: 50,
      tiers: [
        { qty: "50–199", price: "¥89.00", unit: "套" },
        { qty: "200–499", price: "¥78.00", unit: "套" },
        { qty: "≥500", price: "¥68.00", unit: "套" }
      ],
      sample: "¥320.00"
    },
    images: ["image/qiege.jpg"],
    colors: [
      { name: "灰色", hex: "#666666" },
      { name: "深蓝色", hex: "#1A237E" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    certificates: [
      { code: "ENISO", name: "EN ISO 13997", desc: "全身切割防护标准", level: "A4 级全身切割防护", pdf: "certs/ISO13997.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Robert K.",
          country: "USA",
          rating: 5,
          date: "2026-01-15",
          specs: "型号: WRK-SET1 / 尺码: L / 颜色: 灰色",
          text: "Great full-body cut protection for our meat processing facility. Workers feel much safer now. The breathable mesh lining keeps them cool.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 5,
          reply: "Thank you Robert! Full-body HPPE protection combined with breathable design is what makes this set unique."
        }
      ],
      store: [
        { user: "Jan B.", country: "Poland", rating: 5, date: "2026-02-01", text: "Świetny kompletny zestaw ochronny. Wytrzymały i wygodny.", helpful: 3, verified: true },
        { user: "Ali H.", country: "Turkey", rating: 4, date: "2026-01-25", text: "İyi kalite kesilmeye dayanıklı iş kıyafetleri. Fiyat makul.", helpful: 2, verified: true },
        { user: "Liu Yang", country: "中国", rating: 5, date: "2026-01-18", text: "食品切割车间统一配发，全身防护到位，员工反馈透气性好。", helpful: 4, verified: true },
        { user: "Pedro L.", country: "Portugal", rating: 4, date: "2026-01-10", text: "Bom conjunto de vestuário protetor. Confortável para uso prolongado.", helpful: 1, verified: true }
      ]
    },
    bundle: ["shield-cut5", "shield-sleeve", "safety-goggles"],
    tags: ["工作服", "全身防护", "HPPE", "A4级"],
    faq: [
      { q: "套装包含哪些？", a: "含一件防护上衣和一条防护裤子。分体设计方便穿戴。" },
      { q: "可以单独购买上衣或裤子吗？", a: "可以，请联系客服单独订购。" },
      { q: "适用于食品加工吗？", a: "完全适用，HPPE面料食品接触安全，适合肉类和鱼类加工。" },
      { q: "最小起订量是多少？", a: "MOQ为50套（可混码混色）。" },
      { q: "可以定制LOGO和颜色吗？", a: "可以。100套起接受颜色定制（需额外15天），LOGO印刷500套起。" },
      { q: "交货周期多久？", a: "约35天，大单请提前60天下单。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     18. 乳胶防滑手套（通用功能）
     ══════════════════════════════════════ */
  {
    id: "antislip-grip",
    name: {
      zh: "熊猫手护 乳胶防滑手套",
      en: "Panda Guard Latex Anti-Slip Glove"
    },
    category: "antislip",
    brand: "shield",
    industries: ["construction", "agriculture", "general"],
    shortDesc: {
      zh: "天然乳胶全掌防滑纹理，轻便透气，适用于建筑和农业轻量级作业",
      en: "Natural latex full-palm anti-slip texture, lightweight and breathable for construction and agriculture"
    },
    attributes: {
      "功能点": "防滑,透气,耐磨,轻量",
      "材料": "涤纶内衬 / 天然乳胶掌部涂层",
      "应用场景": "建筑施工,农业采摘,仓储搬运",
      "型号": "GRIP-LTX1",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 388 耐磨 2级",
      "涂层": "天然乳胶掌部防滑纹理",
      "尺码": "7/S - 11/XXL",
      "颜色": "绿色/蓝色/橙色",
      "内衬": "13针涤纶编织",
      "袖口": "针织弹性袖口",
      "包装": "12双/袋，120双/箱",
      "单品尺寸": "10×12×0.4 CM",
      "单品净重": "0.045 kg",
      "外箱尺寸": "40×28×22 CM",
      "外箱毛重": "6.2 KG",
      "认证": "CE / ISO 9001",
      "MOQ": "500 双",
      "交货期": "15天"
    },
    price: {
      moq: 500,
      tiers: [
        { qty: "500–2,999", price: "¥6.80", unit: "双" },
        { qty: "3,000–9,999", price: "¥5.90", unit: "双" },
        { qty: "≥10,000", price: "¥5.20", unit: "双" }
      ],
      sample: "¥28.00"
    },
    images: ["image/qiege.jpg"],
    colors: [
      { name: "绿色", hex: "#4CAF50" },
      { name: "蓝色", hex: "#2196F3" },
      { name: "橙色", hex: "#E85D00" }
    ],
    sizes: ["7/S", "8/M", "9/L", "10/XL", "11/XXL"],
    certificates: [
      { code: "EN388", name: "EN 388", desc: "机械风险防护手套标准", level: "Level 2 耐磨", pdf: "certs/EN388.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Mohammed A.",
          country: "UAE",
          rating: 4,
          date: "2026-01-28",
          specs: "型号: GRIP-LTX1 / 尺码: L / 颜色: 绿色",
          text: "Good value for money. The latex grip texture is excellent for our construction work. Very affordable for bulk orders.",
          images: [],
          verified: true,
          purchased: true,
          helpful: 2,
          reply: "Thank you Mohammed! We're glad the value works well for your bulk ordering needs."
        }
      ],
      store: [
        { user: "Sandra M.", country: "Spain", rating: 5, date: "2026-02-05", text: "Buenos guantes antideslizantes para agricultura. Muy buena relación calidad-precio.", helpful: 2, verified: true },
        { user: "Zhang Q.", country: "中国", rating: 4, date: "2026-01-28", text: "工地用性价比高，防滑效果不错，量大的话价格很划算。", helpful: 3, verified: true },
        { user: "John P.", country: "UK", rating: 4, date: "2026-01-20", text: "Decent anti-slip gloves for warehouse work. Good bulk pricing.", helpful: 1, verified: true },
        { user: "Rosa K.", country: "Colombia", rating: 5, date: "2026-01-12", text: "Excelentes guantes para trabajo agrícola. Muy buenos precios al por mayor.", helpful: 2, verified: true }
      ]
    },
    bundle: [],
    tags: ["防滑", "乳胶", "轻量级", "高性价比"],
    faq: [
      { q: "适合精细操作吗？", a: "适合一般的抓握和搬运操作。如需精细操作（如电子组装），请参考超薄款。" },
      { q: "适合冬季使用吗？", a: "轻量级设计不适合低温环境，建议冬季使用PandaFROST™防寒款。" },
      { q: "最小起订量是多少？", a: "MOQ为500双。" },
      { q: "有食品级款吗？", a: "有，食品接触认证款（无溶剂涂层）可定制，请咨询客服。" },
      { q: "交货周期多久？", a: "约15天，大单可加急。" },
      { q: "可以定制颜色吗？", a: "可以，2000双起接受颜色定制。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     19. 溶剂防护手套
     ══════════════════════════════════════ */
  {
    id: "solvent-resist",
    name: {
      zh: "PandaCHEM™ 溶剂防护手套",
      en: "PandaCHEM™ Solvent Resistant Glove"
    },
    category: "solvent",
    brand: "chem",
    industries: ["chemical", "automotive", "cleaning"],
    shortDesc: {
      zh: "厚型丁腈材质，强耐溶剂，防渗透，适用于喷涂和溶剂清洗",
      en: "Thick nitrile material, strong solvent resistance, for spray painting and solvent cleaning"
    },
    attributes: {
      "功能点": "耐溶剂,耐油,防水,防化学",
      "材料": "加厚丁腈橡胶（NBR）",
      "应用场景": "化工生产,喷涂作业,溶剂清洗,油污处理",
      "型号": "CHM-SOL2",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 374-1 Type A（J K L P T S）/ CE认证",
      "涂层": "加厚丁腈全掌涂层",
      "尺码": "7/S - 11/XXL",
      "颜色": "绿色/蓝色",
      "内衬": "棉质植绒内衬",
      "袖口": "加长袖口（35cm），化学防护更全面",
      "包装": "12双/袋，60双/箱",
      "单品尺寸": "14×35×0.8 CM",
      "单品净重": "0.220 kg",
      "外箱尺寸": "40×28×35 CM",
      "外箱毛重": "14.5 KG",
      "认证": "CE / EN 374 / ISO 9001",
      "MOQ": "300 双",
      "交货期": "25天"
    },
    price: {
      moq: 300,
      tiers: [
        { qty: "300–2,999", price: "¥26.00", unit: "双" },
        { qty: "3,000–9,999", price: "¥22.80", unit: "双" },
        { qty: "≥10,000", price: "¥19.90", unit: "双" }
      ],
      sample: "¥118.00"
    },
    images: ["image/qiege.jpg"],
    colors: [
      { name: "绿色", hex: "#4CAF50" },
      { name: "蓝色", hex: "#2196F3" }
    ],
    sizes: ["7/S", "8/M", "9/L", "10/XL", "11/XXL"],
    certificates: [
      { code: "EN374", name: "EN 374-1", desc: "化学品防护手套标准", level: "Type A（J K L P T S）", pdf: "certs/EN374.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Chen Jian",
          country: "中国",
          rating: 5,
          date: "2026-01-20",
          specs: "型号: CHM-SOL2 / 尺码: L / 颜色: 绿色",
          text: "工厂喷涂作业一直用这款，溶剂防护效果很好，手套厚实耐穿。价格也很实惠。",
          images: [],
          verified: true,
          purchased: true,
          helpful: 4,
          reply: "感谢陈先生的认可！加厚丁腈是溶剂防护的最佳选择，很高兴产品能满足您的需求。"
        }
      ],
      store: [
        { user: "Andrei T.", country: "Russia", rating: 5, date: "2026-02-03", text: "Otlichnye perchatki dlya raboty s rastvoritelyami. Tolstyy nitril khorosho zashchishchayet.", helpful: 3, verified: true },
        { user: "Marco V.", country: "Italy", rating: 5, date: "2026-01-28", text: "Ottima resistenza ai solventi per verniciatura. Molto robuste e durature.", helpful: 2, verified: true },
        { user: "Yusuf K.", country: "Turkey", rating: 4, date: "2026-01-20", text: "Boya ve solvent işlerinde çok iyi koruma sağlıyor. Dayanıklı.", helpful: 3, verified: true },
        { user: "Dmitri R.", country: "Kazakhstan", rating: 5, date: "2026-01-12", text: "Jakshy korğau. Qaynatushylarga jane eritkidilerge tazhyrmyz.", helpful: 2, verified: true }
      ]
    },
    bundle: ["chem-resist", "safety-goggles"],
    tags: ["耐溶剂", "丁腈", "喷涂级", "EN374"],
    faq: [
      { q: "适合喷涂作业吗？", a: "完全适用。EN 374 Type A认证，可防护大多数油漆、溶剂和化学品。" },
      { q: "适合清洗作业吗？", a: "适合工业清洗和溶剂清洗，35cm加长袖口保护前臂。" },
      { q: "最小起订量是多少？", a: "MOQ为300双。" },
      { q: "可以接触食品吗？", a: "工业级不适合食品接触。如需食品接触认证，请参考PandaBIO™系列。" },
      { q: "交货周期多久？", a: "约25天。" },
      { q: "有不同厚度可选吗？", a: "有薄型（0.38mm）、中厚型（0.56mm）、加厚型（0.80mm）可选，请咨询客服。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  },

  /* ══════════════════════════════════════
     20. 防静电手套
     ══════════════════════════════════════ */
  {
    id: "static-dissip",
    name: {
      zh: "PandaVOLT™ 防静电手套",
      en: "PandaVOLT™ Anti-Static Glove"
    },
    category: "static",
    brand: "volt",
    industries: ["electronic", "semiconductor", "precision"],
    shortDesc: {
      zh: "碳纤维导电丝内衬，表面电阻<10^5Ω，ESD防护，适用于电子装配和精密制造",
      en: "Carbon fiber conductive liner, surface resistance <10^5Ω, ESD protection for electronics assembly"
    },
    attributes: {
      "功能点": "防静电,防尘,精密操作,ESD防护",
      "材料": "尼龙/涤纶内衬 + 碳纤维导电丝",
      "应用场景": "电子装配,半导体制造,精密仪器,无尘室",
      "型号": "VOL-ESD3",
      "原产地": "山东，中国",
      "品牌": "熊猫手护",
      "防护等级": "EN 1149-5（防静电工作服标准）/ ESD S20.20",
      "涂层": "PU掌部涂层（防滑）",
      "尺码": "S / M / L / XL",
      "颜色": "白色/黑色",
      "内衬": "碳纤维导电丝混纺（表面电阻<10^5Ω）",
      "袖口": "弹性袖口，防静电纤维编织",
      "包装": "10双/袋，100双/盒（无尘包装）",
      "单品尺寸": "8×20×0.2 CM",
      "单品净重": "0.022 kg",
      "外箱尺寸": "35×25×15 CM",
      "外箱毛重": "2.8 KG",
      "认证": "CE / EN 1149-5 / ISO 9001 / ESD协会认证",
      "MOQ": "500 双",
      "交货期": "20天"
    },
    price: {
      moq: 500,
      tiers: [
        { qty: "500–2,999", price: "¥18.00", unit: "双" },
        { qty: "3,000–9,999", price: "¥15.80", unit: "双" },
        { qty: "≥10,000", price: "¥13.50", unit: "双" }
      ],
      sample: "¥68.00"
    },
    images: ["image/qiege.jpg"],
    colors: [
      { name: "白色", hex: "#EEEEEE" },
      { name: "黑色", hex: "#333333" }
    ],
    sizes: ["S", "M", "L", "XL"],
    certificates: [
      { code: "EN1149", name: "EN 1149-5", desc: "防静电防护服标准", level: "表面电阻 <10^5Ω", pdf: "certs/EN1149.pdf" },
      { code: "CE", name: "CE 认证", desc: "欧盟市场准入", pdf: "certs/CE.pdf" }
    ],
    reviews: {
      product: [
        {
          user: "Emily C.",
          country: "USA",
          rating: 5,
          date: "2026-01-22",
          specs: "型号: VOL-ESD3 / 尺码: M / 颜色: 白色",
          text: "Perfect for our electronics assembly line. The carbon fiber conductivity is spot-on and they are incredibly thin for precision work. No more ESD damage claims!",
          images: [],
          verified: true,
          purchased: true,
          helpful: 6,
          reply: "Thank you Emily! ESD protection in precision electronics is critical. We're thrilled these gloves help reduce your damage claims."
        }
      ],
      store: [
        { user: "Takeshi Y.", country: "Japan", rating: 5, date: "2026-02-08", text: "電子機器組み立てに最適です。薄いので精密作業しやすい。静電気防止の効果も確認できました。", helpful: 5, verified: true },
        { user: "Klaus H.", country: "Germany", rating: 5, date: "2026-02-01", text: "Perfekte ESD-Handschuhe für die Elektronikfertigung. Sehr dünn und präzise.", helpful: 3, verified: true },
        { user: "Sarah W.", country: "UK", rating: 5, date: "2026-01-25", text: "Excellent anti-static gloves for semiconductor manufacturing. We order these monthly.", helpful: 4, verified: true },
        { user: "Lee J.", country: "South Korea", rating: 5, date: "2026-01-18", text: "반도체 제조에 완벽한 ESD 장갑. 정밀 작업에 적합하고 내静电防止 효과가 뛰어납니다.", helpful: 4, verified: true }
      ]
    },
    bundle: [],
    tags: ["防静电", "ESD", "电子级", "精密制造"],
    faq: [
      { q: "表面电阻是多少？", a: "通过EN 1149-5认证，表面电阻<10^5Ω，有效消散静电。" },
      { q: "适用于无尘室吗？", a: "是，有无尘室包装版本（Class 100洁净室兼容），请在订单中注明。" },
      { q: "可以洗涤吗？", a: "可以轻柔手洗，避免拧绞。洗涤会影响导电性能，建议定期更换。" },
      { q: "最小起订量是多少？", a: "MOQ为500双。" },
      { q: "有不同电阻等级可选吗？", a: "有：<10^5Ω（标准款）、<10^4Ω（高精度款）、<10^3Ω（超净款）。" },
      { q: "交货周期多久？", a: "约20天，无尘包装款需额外5天。" }
    ],
    supplier: {
      name: "熊猫手护防护科技有限公司",
      since: 2012,
      responseRate: 95,
      responseTime: "<4h",
      annualRevenue: "$5M+",
      orders: "5,000+",
      repeatRate: "45%",
      mainProducts: ["防切割手套", "耐高温手套", "耐油手套", "防静电手套", "防寒手套"]
    }
  }

];

// 导出完整产品列表，供 product-detail.js "其他推荐" 使用
window.ALL_PRODUCTS = PRODUCTS;


/* ══════════════════════════════════════════
   工具函数：按条件筛选产品
   ══════════════════════════════════════════ */

/**
 * 根据 category（功能）筛选
 * 用法: getProductsByCategory('cut') → 返回所有防切割手套
 */
function getProductsByCategory(cat) {
  return PRODUCTS.filter(p => p.category === cat);
}

/**
 * 根据 brand（品牌）筛选
 * 用法: getProductsByBrand('shield') → 返回所有品牌产品
 */
function getProductsByBrand(brand) {
  return PRODUCTS.filter(p => p.brand === brand);
}

/**
 * 根据 industry（行业）筛选
 * 用法: getProductsByIndustry('metal') → 返回所有金属加工相关产品
 */
function getProductsByIndustry(ind) {
  return PRODUCTS.filter(p => p.industries.includes(ind));
}

/**
 * 根据关键词搜索（name / shortDesc / tags）
 */
function searchProducts(keyword) {
  const kw = keyword.toLowerCase();
  return PRODUCTS.filter(p =>
    p.name.zh.toLowerCase().includes(kw) ||
    p.name.en.toLowerCase().includes(kw) ||
    (p.shortDesc && p.shortDesc.zh.includes(kw)) ||
    p.tags.some(t => t.toLowerCase().includes(kw))
  );
}

/**
 * 根据 ID 获取单个产品
 * 用法: getProductById('shield-cut5')
 */
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

/**
 * 获取搭配产品（bundle 数组里的 id 对应产品对象）
 * 用法: getBundleProducts(product)
 */
function getBundleProducts(product) {
  if (!product || !product.bundle || !product.bundle.length) return [];
  return product.bundle
    .map(id => getProductById(id))
    .filter(Boolean);
}

/**
 * 当前语言获取产品名称
 * 用法: getProductName(product) → 中文或英文名称
 */
function getProductName(product, lang) {
  const l = lang || document.documentElement.lang || 'zh';
  return l.startsWith('en') ? product.name.en : product.name.zh;
}
