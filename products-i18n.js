/**
 * products-i18n.js — 熊猫手护产品体系专属翻译
 * 认证标准 / 行业名称 / 运动名称 / 属性标签 / 品牌名等
 * 补充 main i18n.js 的产品维度翻译
 */

(function () {
  var PRODUCT_I18N = {

    // ── 认证标准全称 ─────────────────────────
    certFull: {
      EN388: {
        zh: 'EN 388:2016+A1 机械风险防护手套',
        en: 'EN 388:2016+A1 Protective Gloves Against Mechanical Risks',
        fr: 'EN 388:2016+A1 Gants de protection contre les risques mécaniques',
        de: 'EN 388:2016+A1 Schutzhandschuhe gegen mechanische Risiken',
        es: 'EN 388:2016+A1 Guantes de protección contra riesgos mecánicos',
      },
      ANSI: {
        zh: 'ANSI/ISEA 105-2024 美国防切割手套标准',
        en: 'ANSI/ISEA 105-2024 American Cut-Resistant Glove Standard',
        fr: 'ANSI/ISEA 105-2024 Norme américaine de gants anti-coupure',
        de: 'ANSI/ISEA 105-2024 Amerikanischer Schnittschutzhandschuh-Standard',
        es: 'ANSI/ISEA 105-2024 Estándar estadounidense de guantes ant corte',
      },
      CE: {
        zh: 'CE 认证 — 欧盟个人防护装备法规 (EU) 2016/425',
        en: 'CE Certification — EU PPE Regulation (EU) 2016/425',
        fr: 'Certification CE — Règlement EPI de l\'UE (EU) 2016/425',
        de: 'CE-Kennzeichnung — EU PSA-Verordnung (EU) 2016/425',
        es: 'Certificación CE — Reglamento UE de EPI (EU) 2016/425',
      },
      ISO9001: {
        zh: 'ISO 9001:2015 质量管理体系认证',
        en: 'ISO 9001:2015 Quality Management System',
        fr: 'ISO 9001:2015 Système de management de la qualité',
        de: 'ISO 9001:2015 Qualitätsmanagementsystem',
        es: 'ISO 9001:2015 Sistema de gestión de la calidad',
      },
      SGS: {
        zh: 'SGS 国际检测认证',
        en: 'SGS International Testing & Certification',
        fr: 'Certification et essais internationaux SGS',
        de: 'SGS Internationaler Prüf- und Zertifizierungsdienst',
        es: 'Certificación y ensayos internacionales SGS',
      },
    },

    // ── 行业名称 ──────────────────────────────
    industry: {
      metal:      { zh: '金属加工', en: 'Metalworking',         fr: 'Travail des métaux',         de: 'Metallbearbeitung',         es: 'Trabajo de metales' },
      glass:      { zh: '玻璃制造', en: 'Glass Manufacturing',  fr: 'Fabrication du verre',        de: 'Glasherstellung',            es: 'Fabricación de vidrio' },
      mechanical: { zh: '机械制造', en: 'Mechanical Industry',  fr: 'Industrie mécanique',        de: 'Maschinenbau',               es: 'Industria mecánica' },
      construction:{ zh: '建筑施工', en: 'Construction',         fr: 'Construction',               de: 'Bauwesen',                   es: 'Construcción' },
      logistics:  { zh: '物流搬运', en: 'Logistics & Warehouse',fr: 'Logistique et entrepôt',     de: 'Logistik und Lager',         es: 'Logística y almacén' },
      petro:      { zh: '石油化工', en: 'Petrochemical',        fr: 'Pétrochimie',               de: 'Petrochemie',                es: 'Petroquímica' },
      food:       { zh: '食品加工', en: 'Food Processing',     fr: 'Transformation alimentaire',  de: 'Lebensmittelverarbeitung',   es: 'Procesamiento de alimentos' },
      medical:    { zh: '医疗护理', en: 'Medical & Healthcare', fr: 'Médical et santé',           de: 'Medizin und Gesundheit',     es: 'Médico y sanitario' },
      electronics: { zh: '电子制造', en: 'Electronics Mfg.',    fr: 'Fabrication électronique',   de: 'Elektronikfertigung',        es: 'Fabricación electrónica' },
      agriculture:{ zh: '农业劳作', en: 'Agriculture',           fr: 'Agriculture',               de: 'Landwirtschaft',              es: 'Agricultura' },
      mining:     { zh: '采矿爆破', en: 'Mining & Blasting',   fr: 'Mines et explosifs',        de: 'Bergbau und Sprengung',       es: 'Minería y voladura' },
      automotive: { zh: '汽车装配', en: 'Automotive Assembly',   fr: 'Assemblage automobile',      de: 'Kfz-Montage',                 es: 'Ensamblaje automotriz' },
      marine:     { zh: '海洋工程', en: 'Marine Engineering',  fr: 'Ingénierie marine',         de: 'Marinebau',                   es: 'Ingeniería marina' },
      lab:        { zh: '实验室',   en: 'Laboratory',          fr: 'Laboratoire',              de: 'Labor',                       es: 'Laboratorio' },
      fire:       { zh: '消防救援', en: 'Firefighting',         fr: 'Lutte anti-incendie',      de: 'Feuerwehr',                   es: 'Lucha contra incendios' },
      energy:     { zh: '电力工程', en: 'Electrical Industry',  fr: 'Industrie électrique',      de: 'Elektroindustrie',            es: 'Industria eléctrica' },
    },

    // ── 运动/活动名称 ─────────────────────────
    sport: {
      cycling:    { zh: '骑行',       en: 'Cycling',       fr: 'Vélo',          de: 'Radsport',         es: 'Ciclismo' },
      climbing:   { zh: '攀岩/登山',  en: 'Climbing',      fr: 'Escalade',      de: 'Klettern',          es: 'Escalada' },
      skiing:     { zh: '滑雪',       en: 'Skiing',        fr: 'Ski',           de: 'Skifahren',         es: 'Esquí' },
      fitness:    { zh: '健身/举重',  en: 'Fitness',       fr: 'Fitness',       de: 'Fitness',           es: 'Fitness' },
      shooting:   { zh: '射击/狩猎',  en: 'Shooting',      fr: 'Tir',           de: 'Schießen',          es: 'Tiro' },
      diving:     { zh: '潜水',       en: 'Diving',        fr: 'Plongée',       de: 'Tauchen',           es: 'Buceo' },
      fishing:    { zh: '钓鱼',       en: 'Fishing',       fr: 'Pêche',         de: 'Angeln',            es: 'Pesca' },
      equestrian: { zh: '马术',       en: 'Equestrian',   fr: 'Équitation',   de: 'Reitsport',          es: 'Equitación' },
    },

    // ── 品牌系列全称 ──────────────────────────
    brand: {
      shield:   { zh: 'PandaSHIELD™   防切割 · 防撕裂 · 防磨损',    en: 'PandaSHIELD™   Cut · Tear · Abrasion Protection',   fr: 'PandaSHIELD™   Protection anti-coupure, déchirure' },
      impact:   { zh: 'PandaIMPACT™   防冲击 · 关节防护',           en: 'PandaIMPACT™   Impact & Joint Protection',         fr: 'PandaIMPACT™   Protection anti-choc et articulations' },
      chem:     { zh: 'PandaCHEM™     防化学 · 耐溶剂',             en: 'PandaCHEM™     Chemical & Solvent Resistant',       fr: 'PandaCHEM™     Résistant aux produits chimiques et solvants' },
      bio:      { zh: 'PandaBIO™      生物防护 · 医疗级',           en: 'PandaBIO™      Bio-Safety & Medical Grade',         fr: 'PandaBIO™      Protection biologique et grade médical' },
      volt:     { zh: 'PandaVOLT™     电绝缘 · 静电防护',           en: 'PandaVOLT™     Electrical Insulation & ESD',          fr: 'PandaVOLT™     Isolation électrique et protection ESD' },
      heat:     { zh: 'PandaHEAT™     耐高温 · 防火阻燃',           en: 'PandaHEAT™     Heat Resistant & Flame Retardant',   fr: 'PandaHEAT™     Résistant à la chaleur et ignifuge' },
      frost:    { zh: 'PandaFROST™    防寒保暖 · 冷冻作业',         en: 'PandaFROST™    Cold Protection & Cryogenic Work',  fr: 'PandaFROST™    Protection contre le froid et travaux cryogéniques' },
      eco:      { zh: 'PandaECO™      环保可降解 · 可持续',         en: 'PandaECO™      Eco-Friendly & Sustainable',         fr: 'PandaECO™      Écologique et durable' },
    },

    // ── 筛选标签翻译 ──────────────────────────
    filterLabel: {
      cert:      { zh: '检验认证', en: 'Certifications',  fr: 'Certifications',  de: 'Zertifizierungen', es: 'Certificaciones' },
      brand:     { zh: '品牌系列', en: 'Brand Series',     fr: 'Gamme de marques', de: 'Markenserie',       es: 'Serie de marca' },
      type:      { zh: '防护类型', en: 'Protection Type',  fr: 'Type de protection', de: 'Schutztyp',       es: 'Tipo de protección' },
      industry:  { zh: '行业应用', en: 'Industry',         fr: 'Secteur',          de: 'Branche',           es: 'Sector' },
      sport:     { zh: '运动场景', en: 'Sport & Activity', fr: 'Sport et activité', de: 'Sport & Aktivität', es: 'Deporte y actividad' },
    },
  };

  // 挂载到全局
  window.__PANDA_PRODUCT_I18N__ = PRODUCT_I18N;

  // 快捷查询函数
  /**
   * 获取产品体系翻译
   * @param {string} category - certFull | industry | sport | brand | filterLabel
   * @param {string} key - 具体键名
   * @param {string} [lang] - 语言码，默认取 document.documentElement.lang
   */
  function t(category, key, lang) {
    var l = lang || (document.documentElement.lang || 'zh');
    var cat = PRODUCT_I18N[category];
    if (!cat || !cat[key]) return key;
    var entry = cat[key];
    if (l.startsWith('en')) return entry.en || entry.zh || key;
    if (l.startsWith('fr')) return entry.fr || entry.zh || key;
    if (l.startsWith('de')) return entry.de || entry.zh || key;
    if (l.startsWith('es')) return entry.es || entry.zh || key;
    return entry.zh || key;
  }
  window.__pandaT = t;

})();
