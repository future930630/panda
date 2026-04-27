"""
批量为所有 HTML 页面添加 SEO meta 标签（title + description + Open Graph）
- 直接修改各 HTML 文件的 <head>
- 复用 i18n.js 已有词条作为 title
- 为每个页面硬编码对应的 meta description（中英文）
- 添加 Open Graph 标签
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')
import os, re, json

BASE = r'c:\Users\Windows13\Desktop\2026.02.23广东-Robin\2026.03.13panda\各版本\20260331999999-2026.04.07-4.0'
SITE = 'https://www.pandaguard.com'
IMG  = 'https://www.pandaguard.com/image/og-default.jpg'

# ─── 页面元数据定义 ───────────────────────────────────────────
PAGES = {
    # 首页
    'index.html': {
        'zh_title': '熊猫手护 — 专业手部防护解决方案',
        'en_title': 'Panda Guard — Professional Hand Protection Solutions',
        'zh_desc': '熊猫手护是专业手部防护品牌，提供防切割、防高温、防化学、防穿刺、防磨损、防电弧、防寒、防感染等全场景手部安全防护产品及解决方案。',
        'en_desc': 'Panda Guard is a professional hand protection brand offering full-scenario safety gloves: cut-resistant, heat-resistant, chemical-resistant, puncture-resistant, and more.',
    },
    # 认证与服务
    'standards.html': {
        'zh_title': '认证与检测标准 — 熊猫手护',
        'en_title': 'Certifications & Testing Standards — Panda Guard',
        'zh_desc': '熊猫手护全系产品通过EN 388、EN 407、ANSI A4等国际认证，每一款防护手套均经过严格质量检测，确保防护性能稳定可靠。',
        'en_desc': 'All Panda Guard products meet EN 388, EN 407, ANSI A4 and other international standards, with rigorous quality testing for reliable protection.',
    },
    'research-center.html': {
        'zh_title': '研发中心 — 熊猫手护',
        'en_title': 'R&D Center — Panda Guard',
        'zh_desc': '熊猫手护研发中心拥有专业材料工程师团队，持续研发新型防护材料与工艺，推动手部防护技术的创新与突破。',
        'en_desc': 'Panda Guard R&D Center has a professional team of material engineers, continuously developing new protective materials and technologies.',
    },
    'children-safety.html': {
        'zh_title': '儿童安全防护 — 熊猫手护',
        'en_title': 'Children Safety — Panda Guard',
        'zh_desc': '熊猫手护为儿童提供专业安全手套，有效防止切割、摩擦、刺伤等意外伤害，让家长更安心。',
        'en_desc': 'Panda Guard provides professional safety gloves for children, effectively preventing cuts, abrasions, and puncture injuries.',
    },
    'sustainability.html': {
        'zh_title': '可持续发展 — 熊猫手护',
        'en_title': 'Sustainability — Panda Guard',
        'zh_desc': '熊猫手护践行绿色生产与可持续发展理念，推行环保材料、节能减排和循环经济，致力于为全球劳动者的手部安全保驾护航。',
        'en_desc': 'Panda Guard is committed to green production and sustainable development, using eco-friendly materials and circular economy practices.',
    },
    # 工厂与设备
    'factory.html': {
        'zh_title': '智能工厂 — 熊猫手护',
        'en_title': 'Smart Factory — Panda Guard',
        'zh_desc': '熊猫手护智能工厂集智能制造、数字化管理于一体，引进国际先进生产线，年产能超5000万双，交付稳定有保障。',
        'en_desc': 'Panda Guard Smart Factory integrates intelligent manufacturing with digital management, with annual capacity exceeding 50 million pairs.',
    },
    'equipment-hub.html': {
        'zh_title': '生产设备 — 熊猫手护',
        'en_title': 'Production Equipment — Panda Guard',
        'zh_desc': '熊猫手护引进德国、日本先进生产设备，包括智能化编织机、高精度浸胶生产线、自动化包装系统等，确保产品品质稳定。',
        'en_desc': 'Panda Guard uses advanced equipment from Germany and Japan, including intelligent knitting machines and precision dipping production lines.',
    },
    'equipment-knitting.html': {
        'zh_title': '智能化编织设备 — 熊猫手护',
        'en_title': 'Intelligent Knitting Equipment — Panda Guard',
        'zh_desc': '采用国际领先智能化编织设备，实现手套主体精密编织，纤维结构均匀稳定，为防护性能提供坚实基础。',
        'en_desc': 'Using internationally leading intelligent knitting equipment for precise glove body knitting with uniform and stable fiber structure.',
    },
    'equipment-coating.html': {
        'zh_title': '高精度浸胶涂层设备 — 熊猫手护',
        'en_title': 'Precision Coating & Dipping Equipment — Panda Guard',
        'zh_desc': '引进德国高精度浸胶涂层生产线，实现丁腈、PU、乳胶等涂层均匀覆盖，防护性能稳定如一。',
        'en_desc': 'Imported German precision coating and dipping lines ensure uniform coverage of nitrile, PU, latex coatings for consistent protection.',
    },
    'equipment-sewing.html': {
        'zh_title': '自动化缝制设备 — 熊猫手护',
        'en_title': 'Automated Sewing Equipment — Panda Guard',
        'zh_desc': '全自动化缝制设备精准缝合手套各部件，配合人工检验，确保缝线牢固、经久耐用。',
        'en_desc': 'Fully automated sewing equipment precisely stitches glove components with quality inspection for durable seams.',
    },
    'equipment-pressing.html': {
        'zh_title': '高频压纹设备 — 熊猫手护',
        'en_title': 'High-Frequency Embossing Equipment — Panda Guard',
        'zh_desc': '高频压纹设备在手套表面形成精细纹理，大幅提升抓握性能与防滑效果，佩戴舒适、操作灵活。',
        'en_desc': 'High-frequency embossing creates fine textures on the glove surface, greatly improving grip and anti-slip performance.',
    },
    'equipment-packaging.html': {
        'zh_title': '自动化包装系统 — 熊猫手护',
        'en_title': 'Automated Packaging System — Panda Guard',
        'zh_desc': '全流程自动化包装系统，实现产品自动分拣、计数、包装、封箱，效率提升60%以上。',
        'en_desc': 'Fully automated packaging system with automatic sorting, counting, packaging and sealing, improving efficiency by over 60%.',
    },
    'equipment-eco.html': {
        'zh_title': '绿色生产设备 — 熊猫手护',
        'en_title': 'Eco-Friendly Production Equipment — Panda Guard',
        'zh_desc': '采用节能降耗绿色生产设备，践行低碳制造理念，践行可持续发展社会责任。',
        'en_desc': 'Using energy-saving and consumption-reducing green production equipment, practicing low-carbon manufacturing and sustainable development.',
    },
    'production-process.html': {
        'zh_title': '生产工艺流程 — 熊猫手护',
        'en_title': 'Production Process — Panda Guard',
        'zh_desc': '从原料检验到成品出库，熊猫手护严格执行11道核心工序，全程质量追溯，确保每双出厂手套符合国际标准。',
        'en_desc': 'From raw material inspection to finished product delivery, Panda Guard strictly follows 11 core processes with full quality traceability.',
    },
    'quality-control.html': {
        'zh_title': '质量控制体系 — 熊猫手护',
        'en_title': 'Quality Control System — Panda Guard',
        'zh_desc': '熊猫手护建立ISO质量管理体系，从原料进厂到成品出库，每一道工序均有严格质检，确保产品零缺陷交付。',
        'en_desc': 'Panda Guard has established an ISO quality management system with strict inspection at every process to ensure zero-defect delivery.',
    },
    # 材料与创新
    'materials.html': {
        'zh_title': '防护材料与创新 — 熊猫手护',
        'en_title': 'Materials & Innovation — Panda Guard',
        'zh_desc': '熊猫手护持续投入防护材料研发，整合高分子材料、超高分子量聚乙烯纤维、芳纶等高性能纤维，为防护手套提供卓越防护性能。',
        'en_desc': 'Panda Guard continuously invests in protective material R&D, integrating high-performance fibers like UHMWPE and aramid for superior glove protection.',
    },
    'fluid-test.html': {
        'zh_title': '液体防护性能测试 — 熊猫手护',
        'en_title': 'Fluid Protection Testing — Panda Guard',
        'zh_desc': '熊猫手护通过专业液体渗透测试设备，验证手套对各类化学品、溶剂、油污的阻隔性能，保障穿戴者安全。',
        'en_desc': 'Panda Guard uses professional fluid penetration testing equipment to verify glove barrier performance against chemicals, solvents and oils.',
    },
    # 产品体系
    'products.html': {
        'zh_title': '防护手套全系列产品 — 熊猫手护',
        'en_title': 'Full Range of Safety Gloves — Panda Guard',
        'zh_desc': '熊猫手护提供全场景防护手套，涵盖防切割、防高温、防化学、防穿刺、防磨损、防寒、防感染、防电弧九大防护系列。',
        'en_desc': 'Panda Guard offers full-scenario safety gloves covering cut, heat, chemical, puncture, abrasion, cold, infection and arc flash protection.',
    },
    'products-all.html': {
        'zh_title': '产品目录 — 熊猫手护',
        'en_title': 'Product Catalog — Panda Guard',
        'zh_desc': '浏览熊猫手护全系列产品目录，按品牌、功能、行业、运动等多维度筛选，快速找到最适合您的手部防护解决方案。',
        'en_desc': 'Browse Panda Guard full product catalog with multi-dimensional filtering by brand, function, industry and sport to find your best hand protection solution.',
    },
    'product-selector.html': {
        'zh_title': '产品智能选型 — 熊猫手护',
        'en_title': 'Smart Product Selector — Panda Guard',
        'zh_desc': '熊猫手护智能产品选型工具，根据您的应用场景、危害类型和行业需求，智能推荐最适合的防护手套解决方案。',
        'en_desc': 'Panda Guard smart product selector recommends the best safety gloves based on your application scenario, hazard type and industry needs.',
    },
    'product-detail.html': {
        'zh_title': '产品详情 — 熊猫手护',
        'en_title': 'Product Details — Panda Guard',
        'zh_desc': '查看熊猫手护产品详细信息，包括材质参数、认证标准、适用范围、尺寸规格等，选购专业防护手套。',
        'en_desc': 'View Panda Guard product details including material parameters, certification standards, application range and size specifications.',
    },
    # 品牌系列
    'pandashield.html': {
        'zh_title': 'PandaSHIELD™ 防切割/撕裂/磨损 — 熊猫手护',
        'en_title': 'PandaSHIELD™ Cut & Tear & Abrasion Protection — Panda Guard',
        'zh_desc': 'PandaSHIELD™系列采用超高分子量聚乙烯纤维，提供卓越防切割、防撕裂、防磨损性能，广泛应用于工业制造与物流搬运场景。',
        'en_desc': 'PandaSHIELD™ series uses UHMWPE fiber for superior cut, tear and abrasion resistance, widely used in industrial manufacturing and logistics.',
    },
    'pandaheat.html': {
        'zh_title': 'PandaHEAT™ 耐高温/阻燃 — 熊猫手护',
        'en_title': 'PandaHEAT™ Heat & Flame Resistant — Panda Guard',
        'zh_desc': 'PandaHEAT™系列具备优异耐高温与阻燃性能，专为焊接、铸造、热处理等高温作业场景设计，保障工作者双手安全。',
        'en_desc': 'PandaHEAT™ series offers excellent heat and flame resistance, designed for welding, casting, heat treatment and high-temperature operations.',
    },
    'pandachem.html': {
        'zh_title': 'PandaCHEM™ 防化学/耐腐蚀 — 熊猫手护',
        'en_title': 'PandaCHEM™ Chemical Resistant — Panda Guard',
        'zh_desc': 'PandaCHEM™系列采用优质丁腈与氯丁胶涂层，有效阻隔酸碱、溶剂、油污等化学品，守护化工与制造业劳动者手部安全。',
        'en_desc': 'PandaCHEM™ series uses quality nitrile and neoprene coatings to effectively block acids, alkalis, solvents and oils, protecting hands in chemical and manufacturing industries.',
    },
    'pandapierce.html': {
        'zh_title': 'PandaPIERCE™ 防穿刺/防刺穿 — 熊猫手护',
        'en_title': 'PandaPIERCE™ Puncture Resistant — Panda Guard',
        'zh_desc': 'PandaPIERCE™系列采用高密度纤维与钢丝复合结构，提供出色防穿刺性能，专为玻璃、金属加工与建筑施工设计。',
        'en_desc': 'PandaPIERCE™ series uses high-density fiber and steel wire composite structure for excellent puncture resistance, designed for glass, metalworking and construction.',
    },
    'pandagrip.html': {
        'zh_title': 'PandaGRIP™ 防滑/耐磨损 — 熊猫手护',
        'en_title': 'PandaGRIP™ Anti-Slip & Abrasion Resistant — Panda Guard',
        'zh_desc': 'PandaGRIP™系列采用微发泡掌面与精密压纹技术，提供卓越防滑抓握性能，同时兼具出色的耐磨特性，适合精细操作与重载搬运。',
        'en_desc': 'PandaGRIP™ series uses micro-foam palm and precision embossing technology for superior anti-slip grip and abrasion resistance, ideal for precision work and heavy lifting.',
    },
    'pandaeco.html': {
        'zh_title': 'PandaECO™ 环保可降解 — 熊猫手护',
        'en_title': 'PandaECO™ Eco-Friendly & Biodegradable — Panda Guard',
        'zh_desc': 'PandaECO™系列采用环保可降解材料，在提供专业防护的同时，减少对环境的影响，是绿色制造与可持续供应链的理想选择。',
        'en_desc': 'PandaECO™ series uses eco-friendly biodegradable materials for professional protection while reducing environmental impact, ideal for green manufacturing and sustainable supply chains.',
    },
    'pandabio.html': {
        'zh_title': 'PandaBIO™ 抗菌防护 — 熊猫手护',
        'en_title': 'PandaBIO™ Antimicrobial Protection — Panda Guard',
        'zh_desc': 'PandaBIO™系列添加银离子抗菌成分，有效抑制细菌滋生，专为医疗、食品加工与生物实验室等高卫生要求场景设计。',
        'en_desc': 'PandaBIO™ series adds silver ion antimicrobial agents to effectively inhibit bacterial growth, designed for medical, food processing and bio-laboratory applications.',
    },
    'pandavolt.html': {
        'zh_title': 'PandaVOLT™ 防电弧 — 熊猫手护',
        'en_title': 'PandaVOLT™ Arc Flash Protection — Panda Guard',
        'zh_desc': 'PandaVOLT™系列通过ARC Rating认证，具备优异防电弧伤害性能，专为电力维护与电气作业人员设计。',
        'en_desc': 'PandaVOLT™ series is ARC Rating certified with excellent arc flash protection, designed for electrical maintenance and operations personnel.',
    },
    'pandaimpact.html': {
        'zh_title': 'PandaIMPACT™ 防冲击 — 熊猫手护',
        'en_title': 'PandaIMPACT™ Impact Protection — Panda Guard',
        'zh_desc': 'PandaIMPACT™系列在手背与关节部位配备抗冲击防护垫，有效吸收碰撞能量，专为重载搬运与机械作业设计。',
        'en_desc': 'PandaIMPACT™ series features impact protection padding on back-of-hand and knuckles to effectively absorb impact energy, designed for heavy lifting and mechanical operations.',
    },
    'pandafrost.html': {
        'zh_title': 'PandaFROST™ 防寒/冷冻防护 — 熊猫手护',
        'en_title': 'PandaFROST™ Cold & Freezer Protection — Panda Guard',
        'zh_desc': 'PandaFROST™系列采用高性能保温纤维与防水透湿膜，提供出色防寒性能，专为冷库、冷链物流与冬季户外作业设计。',
        'en_desc': 'PandaFROST™ series uses high-performance insulation fibers and waterproof breathable membrane for excellent cold protection, designed for cold storage, cold chain logistics and winter outdoor work.',
    },
    # 功能分类
    'function-hub.html': {
        'zh_title': '按功能分类 — 熊猫手护',
        'en_title': 'By Function — Panda Guard',
        'zh_desc': '熊猫手护按防护功能分类，提供防切割、防高温、防化学、防穿刺、防磨损、防寒、防感染、防电弧、防冲击九大系列。',
        'en_desc': 'Panda Guard categorizes gloves by protection function: cut, heat, chemical, puncture, abrasion, cold, infection, arc flash and impact resistance.',
    },
    'func-cut.html': {
        'zh_title': '防切割手套 — 熊猫手护',
        'en_title': 'Cut Resistant Gloves — Panda Guard',
        'zh_desc': '防切割手套采用HPPE、芳纶、钢丝复合纤维，通过EN 388防切割认证，守护金属加工、玻璃制造与食品切割等场景工作者。',
        'en_desc': 'Cut resistant gloves use HPPE, aramid and steel wire composite fibers, certified to EN 388, protecting workers in metalworking, glass manufacturing and food cutting.',
    },
    'func-heat.html': {
        'zh_title': '耐高温手套 — 熊猫手护',
        'en_title': 'Heat Resistant Gloves — Panda Guard',
        'zh_desc': '耐高温手套具备优异阻燃与隔热性能，通过EN 407认证，专为焊接、铸造、热处理与高温制造场景设计。',
        'en_desc': 'Heat resistant gloves offer excellent flame retardant and thermal insulation, certified to EN 407, designed for welding, casting, heat treatment and high-temperature manufacturing.',
    },
    'func-chem.html': {
        'zh_title': '防化学手套 — 熊猫手护',
        'en_title': 'Chemical Resistant Gloves — Panda Guard',
        'zh_desc': '防化学手套有效阻隔酸碱、溶剂、油污与腐蚀性液体，保护化工、食品加工与制造业劳动者双手安全。',
        'en_desc': 'Chemical resistant gloves effectively block acids, alkalis, solvents, oils and corrosive liquids, protecting hands in chemical, food processing and manufacturing industries.',
    },
    'func-puncture.html': {
        'zh_title': '防穿刺手套 — 熊猫手护',
        'en_title': 'Puncture Resistant Gloves — Panda Guard',
        'zh_desc': '防穿刺手套采用高密度纤维与防护涂层，有效防止针刺、钉子、金属碎片穿刺，专为建筑施工与废物处理设计。',
        'en_desc': 'Puncture resistant gloves use high-density fibers and protective coatings to prevent needle sticks, nails and metal fragment punctures, designed for construction and waste handling.',
    },
    'func-wear.html': {
        'zh_title': '耐磨损手套 — 熊猫手护',
        'en_title': 'Abrasion Resistant Gloves — Panda Guard',
        'zh_desc': '耐磨损手套采用强化掌面涂层与耐磨纤维，大幅延长使用寿命，适合重载搬运、仓储物流与建筑施工等高频使用场景。',
        'en_desc': 'Abrasion resistant gloves use reinforced palm coating and wear-resistant fibers for extended service life, ideal for heavy lifting, warehouse logistics and construction.',
    },
    'func-electric.html': {
        'zh_title': '防电弧手套 — 熊猫手护',
        'en_title': 'Arc Flash Protective Gloves — Panda Guard',
        'zh_desc': '防电弧手套通过ARC Rating认证，有效防护电弧热伤害与电击风险，专为电力维修、电气安装与变电站作业人员设计。',
        'en_desc': 'Arc flash gloves are ARC Rating certified to protect against arc thermal injury and electrical risks, designed for electrical maintenance, installation and substation operations.',
    },
    'func-shock.html': {
        'zh_title': '防冲击手套 — 熊猫手护',
        'en_title': 'Impact Protective Gloves — Panda Guard',
        'zh_desc': '防冲击手套在手背与指关节部位配备抗冲击防护垫，有效吸收碰撞能量，专为机械操作、重载搬运与矿山作业设计。',
        'en_desc': 'Impact protective gloves feature impact pads on back-of-hand and finger joints to absorb collision energy, designed for machinery operations, heavy lifting and mining.',
    },
    'func-cold.html': {
        'zh_title': '防寒手套 — 熊猫手护',
        'en_title': 'Cold Resistant Gloves — Panda Guard',
        'zh_desc': '防寒手套采用高性能保温纤维与防水透气膜，提供零下30°C至常温全范围防护，专为冷库作业、冷链物流与冬季户外作业设计。',
        'en_desc': 'Cold resistant gloves use high-performance insulation fibers and waterproof breathable membrane for protection from -30°C to room temperature, designed for cold storage, cold chain and winter outdoor work.',
    },
    'func-infection.html': {
        'zh_title': '防感染手套 — 熊猫手护',
        'en_title': 'Infection Resistant Gloves — Panda Guard',
        'zh_desc': '防感染手套添加银离子抗菌成分，有效抑制细菌与病毒滋生，通过EN ISO 374 Type B认证，专为医疗护理与生物实验设计。',
        'en_desc': 'Infection resistant gloves add silver ion antimicrobial agents to inhibit bacteria and viruses, EN ISO 374 Type B certified, designed for medical care and bio-laboratory applications.',
    },
    # 行业分类
    'industry-hub.html': {
        'zh_title': '按行业分类 — 熊猫手护',
        'en_title': 'By Industry — Panda Guard',
        'zh_desc': '熊猫手护产品覆盖工业制造、医疗健康、食品加工、石油化工、电子电气、建筑施工、航空航天等七大行业领域。',
        'en_desc': 'Panda Guard products cover seven major industry sectors: industrial manufacturing, healthcare, food processing, petrochemical, electronics, construction and aerospace.',
    },
    'ind-construction.html': {
        'zh_title': '建筑施工行业手部防护 — 熊猫手护',
        'en_title': 'Construction Industry Hand Protection — Panda Guard',
        'zh_desc': '建筑施工场景复杂，熊猫手护提供防切割、防穿刺、防冲击、防磨损综合防护解决方案，有效保障建筑工人双手安全。',
        'en_desc': 'Construction sites are complex; Panda Guard provides comprehensive cut, puncture, impact and abrasion protection solutions to keep construction workers safe.',
    },
    'ind-auto.html': {
        'zh_title': '汽车工业行业手部防护 — 熊猫手护',
        'en_title': 'Automotive Industry Hand Protection — Panda Guard',
        'zh_desc': '汽车工业生产环境复杂，熊猫手护提供耐高温、防切割、防化学、耐磨损综合防护，满足汽车制造各工序手部安全需求。',
        'en_desc': 'Automotive production environments are complex; Panda Guard provides heat, cut, chemical and abrasion protection for all automotive manufacturing processes.',
    },
    'ind-electronics.html': {
        'zh_title': '电子电气行业手部防护 — 熊猫手护',
        'en_title': 'Electronics Industry Hand Protection — Panda Guard',
        'zh_desc': '电子电气行业需要精密操作与防静电双重保护，熊猫手护提供薄型灵巧防护手套，满足精密装配与电气作业双重需求。',
        'en_desc': 'Electronics industry requires precision operation and ESD protection; Panda Guard offers thin, dexterous protective gloves for precision assembly and electrical work.',
    },
    'ind-food.html': {
        'zh_title': '食品加工行业手部防护 — 熊猫手护',
        'en_title': 'Food Processing Hand Protection — Panda Guard',
        'zh_desc': '食品加工行业需要防水、防切割与卫生防护，熊猫手护提供符合食品接触标准的专业防护手套，保障食品安全与工作者健康。',
        'en_desc': 'Food processing requires waterproof, cut-resistant and hygienic protection; Panda Guard offers professional gloves meeting food contact standards for food safety and worker health.',
    },
    'ind-medical.html': {
        'zh_title': '医疗健康行业手部防护 — 熊猫手护',
        'en_title': 'Healthcare Hand Protection — Panda Guard',
        'zh_desc': '医疗健康行业需要防感染、防化学与灵巧操作多重防护，熊猫手护提供符合国际医疗标准的专业防护手套。',
        'en_desc': 'Healthcare requires infection, chemical and dexterity protection; Panda Guard offers professional gloves meeting international medical standards.',
    },
    'ind-petro.html': {
        'zh_title': '石油化工行业手部防护 — 熊猫手护',
        'en_title': 'Petrochemical Industry Hand Protection — Panda Guard',
        'zh_desc': '石油化工行业面临高温、化学品与易燃易爆风险，熊猫手护提供耐高温、防化学、防电弧综合防护解决方案。',
        'en_desc': 'Petrochemical industry faces high temperature, chemical and fire risks; Panda Guard provides heat, chemical and arc flash protection solutions.',
    },
    'ind-aerospace.html': {
        'zh_title': '航空航天行业手部防护 — 熊猫手护',
        'en_title': 'Aerospace Industry Hand Protection — Panda Guard',
        'zh_desc': '航空航天制造精度要求极高，熊猫手护提供精密灵巧、防切割、耐高温防护手套，满足航空器装配与维修严苛需求。',
        'en_desc': 'Aerospace manufacturing demands extreme precision; Panda Guard offers precision, cut-resistant and heat-resistant gloves meeting strict aircraft assembly and maintenance requirements.',
    },
    # 运动分类
    'sport-hub.html': {
        'zh_title': '运动手部防护 — 熊猫手护',
        'en_title': 'Sports Hand Protection — Panda Guard',
        'zh_desc': '熊猫手护运动系列为骑行、登山、射击、搏击、越野、滑雪、马术等运动提供专业防护手套，兼顾防护与运动表现。',
        'en_desc': 'Panda Guard sports series provides professional protective gloves for cycling, climbing, shooting, boxing, off-road, skiing, equestrian and more.',
    },
    'sport-cycling.html': {
        'zh_title': '骑行手套 — 熊猫手护',
        'en_title': 'Cycling Gloves — Panda Guard',
        'zh_desc': '熊猫手护骑行手套采用减震掌垫与透气网面设计，防滑耐磨、佩戴舒适，长途骑行与竞赛训练均适用。',
        'en_desc': 'Panda Guard cycling gloves feature shock-absorbing palm padding and breathable mesh, anti-slip and comfortable for long rides and competitive training.',
    },
    'sport-climbing.html': {
        'zh_title': '登山攀岩手套 — 熊猫手护',
        'en_title': 'Climbing Gloves — Panda Guard',
        'zh_desc': '登山攀岩手套加强手掌防护与指节包裹，防切割、防摩擦，攀岩与索降操作灵活，是户外探险的理想搭档。',
        'en_desc': 'Climbing gloves feature reinforced palm protection and knuckle wrap, cut and abrasion resistant with flexible climbing and rappelling operation.',
    },
    'sport-shooting.html': {
        'zh_title': '射击射击手套 — 熊猫手护',
        'en_title': 'Shooting Gloves — Panda Guard',
        'zh_desc': '熊猫手护射击手套采用无指/半指精密设计，扣动扳机灵敏，护手垫防护后坐力，专为射击运动与战术训练设计。',
        'en_desc': 'Panda Guard shooting gloves feature fingerless/half-finger precision design with sensitive trigger control and recoil protection, designed for shooting sports and tactical training.',
    },
    'sport-boxing.html': {
        'zh_title': '拳击搏击手套 — 熊猫手护',
        'en_title': 'Boxing Gloves — Panda Guard',
        'zh_desc': '拳击搏击手套采用高密度EVA防护垫与透气内衬，大幅吸收冲击能量，保护拳峰与指关节，是搏击训练的必备装备。',
        'en_desc': 'Boxing gloves use high-density EVA protection padding and breathable lining to absorb impact energy, protecting knuckles, essential for combat training.',
    },
    'sport-motorcycle.html': {
        'zh_title': '摩托车骑行手套 — 熊猫手护',
        'en_title': 'Motorcycle Riding Gloves — Panda Guard',
        'zh_desc': '摩托车骑行手套加强掌部与指关节防护，防摔防摩擦，配备触屏指尖，导航通话两不误，骑行安全与便利兼得。',
        'en_desc': 'Motorcycle riding gloves feature reinforced palm and knuckle protection, fall and abrasion resistant with touchscreen fingertips for navigation and calls.',
    },
    'sport-skiing.html': {
        'zh_title': '滑雪手套 — 熊猫手护',
        'en_title': 'Skiing Gloves — Panda Guard',
        'zh_desc': '滑雪手套采用防水透气膜与保暖絮片，防寒防风耐磨，手指灵活操作雪杖，畅享冰雪运动乐趣。',
        'en_desc': 'Skiing gloves use waterproof breathable membrane and thermal insulation, cold and wind resistant with flexible finger operation for ski poles.',
    },
    'sport-tactical.html': {
        'zh_title': '战术手套 — 熊猫手护',
        'en_title': 'Tactical Gloves — Panda Guard',
        'zh_desc': '熊猫手护战术手套具备防切割、防摩擦、快速穿脱设计，配备护手装甲与防滑掌面，专为军事训练与战术行动设计。',
        'en_desc': 'Panda Guard tactical gloves feature cut resistance, abrasion resistance, quick on/off design with gauntlet armor and anti-slip palm, designed for military training and tactical operations.',
    },
    'sport-extreme.html': {
        'zh_title': '极限运动手套 — 熊猫手护',
        'en_title': 'Extreme Sports Gloves — Panda Guard',
        'zh_desc': '极限运动手套提供全地形防护，防切割、防摩擦、防寒，快速穿脱，专为速降、越野、极限挑战设计。',
        'en_desc': 'Extreme sports gloves provide all-terrain protection with cut, abrasion and cold resistance, quick on/off, designed for downhill, off-road and extreme challenges.',
    },
    'sport-ball.html': {
        'zh_title': '球类运动手套 — 熊猫手护',
        'en_title': 'Ball Sports Gloves — Panda Guard',
        'zh_desc': '球类运动手套专为篮球、排球、棒球等球拍/球类运动设计，防滑透气，保护手掌，抓握稳定，提升运动表现。',
        'en_desc': 'Ball sports gloves are designed for basketball, volleyball, baseball and other ball/racket sports with anti-slip, breathable palm protection for better performance.',
    },
    'sport-fitness.html': {
        'zh_title': '健身训练手套 — 熊猫手护',
        'en_title': 'Fitness Training Gloves — Panda Guard',
        'zh_desc': '健身训练手套防滑防磨，加固掌心，减震护手，提升握力，透气不闷汗，力量训练与器械健身的贴心伴侣。',
        'en_desc': 'Fitness training gloves are anti-slip, wear-resistant with reinforced palm and shock absorption to improve grip, breathable for strength training and gym work.',
    },
    'sport-running.html': {
        'zh_title': '跑步手套 — 熊猫手护',
        'en_title': 'Running Gloves — Panda Guard',
        'zh_desc': '跑步手套轻量透气，防寒防风，指尖触屏设计，跑步时随时接听来电或查看运动数据，春秋季户外跑步必备。',
        'en_desc': 'Running gloves are lightweight and breathable, cold and wind resistant with touchscreen fingertips for calls and fitness tracking during spring and autumn outdoor running.',
    },
    'sport-fishing.html': {
        'zh_title': '钓鱼手套 — 熊猫手护',
        'en_title': 'Fishing Gloves — Panda Guard',
        'zh_desc': '钓鱼手套防水防滑，拇指食指触屏设计方便查看探鱼器，耐磨抗撕，长时间钓鱼手部依然舒适干爽。',
        'en_desc': 'Fishing gloves are waterproof and anti-slip with touchscreen thumb and index fingertips for fish finder viewing, wear and tear resistant for comfortable long fishing sessions.',
    },
    'sport-golf.html': {
        'zh_title': '高尔夫手套 — 熊猫手护',
        'en_title': 'Golf Gloves — Panda Guard',
        'zh_desc': '高尔夫手套精选高档羊皮与合成纤维，透气吸汗，握感稳定，防滑耐磨，每一杆都带来精准击球体验。',
        'en_desc': 'Golf gloves are made of premium sheepskin and synthetic fibers, breathable and sweat-absorbent with stable grip, anti-slip and wear-resistant for precise shots.',
    },
    'sport-hunting.html': {
        'zh_title': '狩猎手套 — 熊猫手护',
        'en_title': 'Hunting Gloves — Panda Guard',
        'zh_desc': '狩猎手套防寒防潮，防割防刺，无指设计保证扣动扳机灵敏度，迷彩图案融入自然，是狩猎爱好者的专业装备。',
        'en_desc': 'Hunting gloves are cold and moisture resistant, cut and puncture resistant with fingerless design for trigger sensitivity and camouflage pattern for hunters.',
    },
    'sport-equestrian.html': {
        'zh_title': '马术手套 — 熊猫手护',
        'en_title': 'Equestrian Gloves — Panda Guard',
        'zh_desc': '马术手套采用高档皮革与透气网面结合，防滑耐磨握缰稳固，指关节活动自如，兼顾优雅与专业性能。',
        'en_desc': 'Equestrian gloves combine premium leather with breathable mesh, anti-slip and wear-resistant for stable reins with flexible finger joints, balancing elegance and professional performance.',
    },
    # 搜索/登录/管理
    'search.html': {
        'zh_title': '搜索产品与服务 — 熊猫手护',
        'en_title': 'Search Products & Services — Panda Guard',
        'zh_desc': '在熊猫手护全站搜索产品型号、认证标准、行业应用，快速定位最适合您的防护手套解决方案。',
        'en_desc': 'Search Panda Guard full site for product models, certification standards and industry applications to quickly find your ideal safety glove solution.',
    },
    'auth.html': {
        'zh_title': '注册 / 登录 — 熊猫手护',
        'en_title': 'Sign Up / Login — Panda Guard',
        'zh_desc': '注册熊猫手护账号，获取产品报价、技术咨询、定制服务与品牌授权合作支持。',
        'en_desc': 'Register a Panda Guard account to get product quotes, technical consultation, customization services and brand authorization support.',
    },
    'admin.html': {
        'zh_title': '管理后台 — 熊猫手护',
        'en_title': 'Admin Dashboard — Panda Guard',
        'zh_desc': '熊猫手护管理后台。',
        'en_desc': 'Panda Guard admin dashboard.',
    },
    'cart.html': {
        'zh_title': '购物车 — 熊猫手护',
        'en_title': 'Shopping Cart — Panda Guard',
        'zh_desc': '熊猫手护购物车，查看已选产品，计算报价，提交询价单获取批量采购优惠。',
        'en_desc': 'Panda Guard shopping cart: review selected products, calculate quotes and submit inquiry for bulk purchase discounts.',
    },
}


def make_og_tags(path, meta):
    """生成 Open Graph meta 标签组"""
    url = SITE + '/' + path.lstrip('/')
    zh_t = meta['zh_title'].replace('"', '&quot;')
    en_t = meta['en_title'].replace('"', '&quot;')
    zh_d = meta['zh_desc'].replace('"', '&quot;')
    en_d = meta['en_desc'].replace('"', '&quot;')
    return (
        f'  <meta property="og:title" content="{zh_t}" />\n'
        f'  <meta property="og:title" content="{en_t}" xml:lang="en" />\n'
        f'  <meta property="og:description" content="{zh_d}" />\n'
        f'  <meta property="og:description" content="{en_d}" xml:lang="en" />\n'
        f'  <meta property="og:url" content="{url}" />\n'
        f'  <meta property="og:type" content="website" />\n'
        f'  <meta property="og:site_name" content="熊猫手护" />\n'
        f'  <meta property="og:site_name" content="Panda Guard" xml:lang="en" />\n'
        f'  <meta property="og:image" content="{IMG}" />\n'
        f'  <meta name="twitter:card" content="summary_large_image" />\n'
        f'  <meta name="twitter:title" content="{en_t}" />\n'
        f'  <meta name="twitter:description" content="{en_d}" />\n'
        f'  <meta name="twitter:image" content="{IMG}" />\n'
    )


def patch_page(filepath, meta):
    """为单个 HTML 文件添加/更新 SEO meta 标签"""
    with open(filepath, encoding='utf-8') as f:
        content = f.read()

    # 新的 meta 标签块
    new_meta = (
        f'  <title>{meta["zh_title"]}</title>\n'
        f'  <meta name="description" content="{meta["zh_desc"]}" />\n'
        f'  <meta name="description" content="{meta["en_desc"]}" lang="en" />\n'
    )
    new_og = make_og_tags(os.path.basename(filepath), meta)

    # 替换 <title>（如果存在）
    if re.search(r'<title>', content):
        content = re.sub(r'<title>[^<]*</title>\n?', '', content)

    # 替换旧的 meta description
    content = re.sub(r'<meta name="description"[^>]*>\n?', '', content)

    # 替换旧的 og tags
    for prop in ['og:title', 'og:description', 'og:url', 'og:type', 'og:site_name', 'og:image']:
        content = re.sub(rf'<meta property="{re.escape(prop)}"[^>]*>\n?', '', content)
    for name in ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']:
        content = re.sub(rf'<meta name="{re.escape(name)}"[^>]*>\n?', '', content)

    # 在 <head> 标签后、第一个非空白子元素前插入
    head_match = re.search(r'(<head>)\n?', content)
    if head_match:
        insert_after = head_match.end()
        content = content[:insert_after] + '\n' + new_meta + new_og + content[insert_after:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)


# ─── 主程序 ───────────────────────────────────────────
processed = 0
skipped = []
for fname, meta in PAGES.items():
    fpath = os.path.join(BASE, fname)
    if os.path.exists(fpath):
        patch_page(fpath, meta)
        processed += 1
        print(f'  OK {fname}')
    else:
        skipped.append(fname)
        print(f'  SKIP {fname} (not found)')

print(f'\n完成：处理 {processed} 个页面，跳过 {len(skipped)} 个')
if skipped:
    print('未找到：', skipped)
