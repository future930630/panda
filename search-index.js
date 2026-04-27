/**
 * 全站搜索数据 — 覆盖所有主要页面
 * 每个条目包含：url, title, desc, keywords, category, pageType
 * Fuse.js 将对 title + desc + keywords 做模糊匹配
 */
const SEARCH_INDEX = [
  // ════ 首页 ════
  { id: 'home', url: 'index.html', title: '熊猫手护 — 专业手部防护解决方案', titleEn: 'Panda Guard — Professional Hand Protection Solutions', desc: '熊猫手护是专业手部防护品牌，提供防切割、防高温、防化学、防穿刺、防磨损、防电弧、防寒、防感染等全场景手部安全防护产品及解决方案。', keywords: '首页 手护 手套 安全防护', pageType: '首页', category: 'brand' },

  // ════ 产品线 ════
  { id: 'products', url: 'products.html', title: '产品中心 — 熊猫手护', titleEn: 'Product Center — Panda Guard', desc: '熊猫手护全系列防护手套，按品牌、功能、行业、运动等多维度分类，帮助您快速找到最适合的解决方案。', keywords: '产品 手套 防护 品牌 功能 行业', pageType: '产品', category: 'product' },
  { id: 'products-all', url: 'products-all.html', title: '全部产品 — 熊猫手护', titleEn: 'All Products — Panda Guard', desc: '浏览熊猫手护完整产品目录，支持多维度筛选：品牌系列、功能特性、行业应用、运动类型。', keywords: '产品目录 筛选 全部产品', pageType: '产品', category: 'product' },
  { id: 'selector', url: 'product-selector.html', title: '产品选型工具 — 熊猫手护', titleEn: 'Product Selector — Panda Guard', desc: '回答几个问题，智能推荐最适合您的手部防护产品。输入行业、工序、危害类型，获得个性化推荐方案。', keywords: '选型 推荐 智能 定制', pageType: '工具', category: 'tool' },

  // ════ 品牌系列 ════
  { id: 'pandashield', url: 'pandashield.html', title: 'PandaSHIELD™ 防切割系列', titleEn: 'PandaSHIELD™ Cut-Resistant Series', desc: '高强度芳纶/HPPE材质，EN 388 F级/A9级切割防护，适用于玻璃加工、金属处理、建筑施工等高风险场景。', keywords: '防切割 芳纶 HPPE EN388 玻璃加工 金属切割', pageType: '品牌', category: 'product', brand: 'PandaSHIELD', brandColor: 'E85D00' },
  { id: 'pandaheat', url: 'pandaheat.html', title: 'PandaHEAT™ 阻燃耐高温系列', titleEn: 'PandaHEAT™ Heat-Resistant Series', desc: '芳纶阻燃材质，EN 407认证，接触热防护4级，适用于焊接、冶金、热工作业、铸造等高温场景。', keywords: '阻燃 高温 焊接 冶金 EN407 铸造', pageType: '品牌', category: 'product', brand: 'PandaHEAT', brandColor: 'DC2626' },
  { id: 'pandachem', url: 'pandachem.html', title: 'PandaCHEM™ 防化学品系列', titleEn: 'PandaCHEM™ Chemical-Resistant Series', desc: '丁腈/乳胶/氯丁橡胶材质，EN 374化学品渗透认证，耐油、耐酸碱、耐有机溶剂，适用于石油化工、实验室、清洗作业。', keywords: '化学品 丁腈 耐油 耐酸碱 EN374 石化 实验室', pageType: '品牌', category: 'product', brand: 'PandaCHEM', brandColor: '7C3AED' },
  { id: 'pandapierce', url: 'pandapierce.html', title: 'PandaPIERCE™ 防穿刺系列', titleEn: 'PandaPIERCE™ Puncture-Resistant Series', desc: 'UHMWPE超高分子量聚乙烯，综合耐磨4级+穿刺防护，适合重工业、建筑施工、物流搬运等高强度场景。', keywords: '防穿刺 UHMWPE 耐磨 建筑 物流 重工业', pageType: '品牌', category: 'product', brand: 'PandaPIERCE', brandColor: '0369A1' },
  { id: 'pandagrip', url: 'pandagrip.html', title: 'PandaGRIP™ 防滑防振系列', titleEn: 'PandaGRIP™ Anti-Vibration Series', desc: 'EVA减震中底+乳胶微粗糙面，EN ISO 10819防振动认证，适合重型机械操作、振动作业、精密装配、物流搬运。', keywords: '防滑 防振 EVA 减震 精密装配 物流', pageType: '品牌', category: 'product', brand: 'PandaGRIP', brandColor: '2563EB' },
  { id: 'pandaeco', url: 'pandaeco.html', title: 'PandaECO™ 可持续环保系列', titleEn: 'PandaECO™ Sustainable Series', desc: 'rPET再生聚酯材质，减少碳足迹约40%，GRS认证，适合企业ESG采购、可持续生产、绿色供应链。', keywords: '环保 再生 可持续 ESG GRS 再生聚酯', pageType: '品牌', category: 'product', brand: 'PandaECO', brandColor: '16A34A' },
  { id: 'pandabio', url: 'pandabio.html', title: 'PandaBIO™ 防生物污染系列', titleEn: 'PandaBIO™ Biohazard Series', desc: 'EN 374-5病毒渗透+EN 455医疗器械认证，医疗级丁腈手套，适用于医疗、实验室、生物制药、食品加工。', keywords: '医疗 生物 病毒 EN374 EN455 实验室 食品', pageType: '品牌', category: 'product', brand: 'PandaBIO', brandColor: '059669' },
  { id: 'pandavolt', url: 'pandavolt.html', title: 'PandaVOLT™ 绝缘防电系列', titleEn: 'PandaVOLT™ Electrical Insulation Series', desc: 'IEC 60903认证天然橡胶绝缘手套，Class 00~4全等级；ESD防静电手套适合电子制造、半导体、洁净室。', keywords: '绝缘 防电 IEC60903 ESD 防静电 电子 半导体', pageType: '品牌', category: 'product', brand: 'PandaVOLT', brandColor: 'F59E0B' },
  { id: 'pandaimpact', url: 'pandaimpact.html', title: 'PandaIMPACT™ 防冲击系列', titleEn: 'PandaIMPACT™ Impact Protection Series', desc: 'TPR热塑弹性体全面覆盖+EVA泡沫衬垫，EN 13552 HRC认证，适合采矿、工程机械、重型装配、锤击作业。', keywords: '防冲击 TPR EVA 采矿 工程机械 EN13552', pageType: '品牌', category: 'product', brand: 'PandaIMPACT', brandColor: '9333EA' },
  { id: 'pandafrost', url: 'pandafrost.html', title: 'PandaFROST™ 防寒保暖系列', titleEn: 'PandaFROST™ Cold Protection Series', desc: '3M Thinsulate保暖材料，-40°C耐寒认证，IP67防水透气，适合冷库作业、冬季户外施工、极地探险。', keywords: '防寒 保暖 Thinsulate 冷库 冬季 户外', pageType: '品牌', category: 'product', brand: 'PandaFROST', brandColor: '0891B2' },

  // ════ 功能分类 ════
  { id: 'func-hub', url: 'function-hub.html', title: '按功能分类 — 熊猫手护', titleEn: 'By Function — Panda Guard', desc: '按防护功能分类浏览：切割防护、高温防护、化学防护、穿刺防护、耐磨防护、阻燃防电、防寒防护、感染防护。', keywords: '功能 切割 高温 化学 穿刺 耐磨 阻燃 防寒 感染', pageType: '分类', category: 'function' },
  { id: 'func-cut', url: 'func-cut.html', title: '切割防护功能详解', titleEn: 'Cut-Resistant Protection Guide', desc: 'EN 388切割防护等级解析，A–F六级标准，ANSI/ISEA 105 A1–A9级详解，帮助您选择合适的切割防护产品。', keywords: '切割 EN388 ANSI A级 防切割 芳纶', pageType: '功能', category: 'function' },
  { id: 'func-heat', url: 'func-heat.html', title: '高温防护功能详解', titleEn: 'Heat-Resistant Protection Guide', desc: 'EN 407阻燃等级解析，接触热/对流热/辐射热/熔融金属防护等级介绍，选购指南与使用注意事项。', keywords: '高温 EN407 阻燃 焊接 铸造', pageType: '功能', category: 'function' },
  { id: 'func-chem', url: 'func-chem.html', title: '化学品防护功能详解', titleEn: 'Chemical Protection Guide', desc: 'EN 374化学品渗透标准详解，各类材质（丁腈/乳胶/氯丁橡胶/PVC/ Viton）耐化学性对比表。', keywords: '化学品 EN374 丁腈 耐溶剂 渗透', pageType: '功能', category: 'function' },
  { id: 'func-puncture', url: 'func-puncture.html', title: '穿刺防护功能详解', titleEn: 'Puncture-Resistant Protection Guide', desc: 'EN 388穿刺防护等级详解，穿刺力测试方法与选购建议，适用于建筑施工、工业装配等场景。', keywords: '穿刺 EN388 工业 装配 施工', pageType: '功能', category: 'function' },
  { id: 'func-wear', url: 'func-wear.html', title: '耐磨防护功能详解', titleEn: 'Abrasion-Resistant Protection Guide', desc: 'EN 388耐磨等级1–4级详解，磨损机理分析，延长手套使用寿命的维护建议。', keywords: '耐磨 EN388 磨损 维护', pageType: '功能', category: 'function' },
  { id: 'func-electric', url: 'func-electric.html', title: '电气防护功能详解', titleEn: 'Electrical Protection Guide', desc: 'IEC 60903绝缘手套等级标准，Class 00~4电压范围，ESD防静电原理与选购指南。', keywords: '电气 IEC60903 绝缘 防静电 ESD', pageType: '功能', category: 'function' },
  { id: 'func-shock', url: 'func-shock.html', title: '电弧防护功能详解', titleEn: 'Arc Flash Protection Guide', desc: 'NFPA 70E电弧防护标准，ATPV值解析，电弧伤害机理与防护手套选型建议。', keywords: '电弧 NFPA70E ATPV 电气安全', pageType: '功能', category: 'function' },
  { id: 'func-cold', url: 'func-cold.html', title: '防寒防护功能详解', titleEn: 'Cold Protection Guide', desc: '冷防护等级标准，防水透气技术，Thinsulate保暖原理，适合冷库、冷链、冬季户外作业。', keywords: '防寒 冷库 冷链 Thinsulate 保暖', pageType: '功能', category: 'function' },
  { id: 'func-infection', url: 'func-infection.html', title: '生物防护功能详解', titleEn: 'Biohazard Protection Guide', desc: 'EN 374-5病毒/细菌/真菌渗透标准，EN 455医疗器械认证，医疗级手套选购指南。', keywords: '生物 病毒 EN374 EN455 医疗', pageType: '功能', category: 'function' },

  // ════ 行业应用 ════
  { id: 'ind-hub', url: 'industry-hub.html', title: '行业解决方案 — 熊猫手护', titleEn: 'Industry Solutions — Panda Guard', desc: '按行业分类浏览手部防护解决方案：建筑、石油化工、汽车制造、电子制造、食品加工、医疗、航空航天。', keywords: '行业 建筑 石化 汽车 电子 食品 医疗', pageType: '分类', category: 'industry' },
  { id: 'ind-construction', url: 'ind-construction.html', title: '建筑施工行业防护方案', titleEn: 'Construction Industry Solutions', desc: '建筑全流程手部防护，钢筋搬运、钻孔、水泥作业、高空作业等各工序防护建议与产品推荐。', keywords: '建筑 施工 钢筋 水泥 钻孔 高空', pageType: '行业', category: 'industry' },
  { id: 'ind-auto', url: 'ind-auto.html', title: '汽车制造行业防护方案', titleEn: 'Automotive Industry Solutions', desc: '汽车制造全流程手部防护，冲压、焊接、涂装、总装各工序专业防护产品与选型建议。', keywords: '汽车 冲压 焊接 涂装 总装', pageType: '行业', category: 'industry' },
  { id: 'ind-electronics', url: 'ind-electronics.html', title: '电子制造行业防护方案', titleEn: 'Electronics Manufacturing Solutions', desc: 'ESD防静电+防切割手套，适合PCB焊接、半导体制造、电子元件装配，兼顾操作精度与安全。', keywords: '电子 PCB 半导体 ESD 防静电', pageType: '行业', category: 'industry' },
  { id: 'ind-food', url: 'ind-food.html', title: '食品加工行业防护方案', titleEn: 'Food Processing Industry Solutions', desc: 'FDA/LFGB食品安全认证手套，防切割同时满足食品卫生要求，适用于屠宰、分割、食品生产线。', keywords: '食品 FDA LFGB 食品安全 屠宰', pageType: '行业', category: 'industry' },
  { id: 'ind-medical', url: 'ind-medical.html', title: '医疗行业防护方案', titleEn: 'Medical Industry Solutions', desc: 'EN 455医疗器械认证，医疗检查、手术、实验室操作的专用防护手套选购指南。', keywords: '医疗 EN455 手术 实验室 检查', pageType: '行业', category: 'industry' },
  { id: 'ind-petro', url: 'ind-petro.html', title: '石油化工行业防护方案', titleEn: 'Petrochemical Industry Solutions', desc: '石油化工全链路安全防护方案，化学品防护、高温防护、机械防护多场景应用，提供定制化产品组合。', keywords: '石化 石油 化工 高温 化学 定制', pageType: '行业', category: 'industry' },
  { id: 'ind-aerospace', url: 'ind-aerospace.html', title: '航空航天行业防护方案', titleEn: 'Aerospace Industry Solutions', desc: '航空航天精密装配手部防护，无硅、无氯、精密操作专用手套，适合复合材料加工、精密仪器装配。', keywords: '航空 航天 精密 无硅 复合材料', pageType: '行业', category: 'industry' },

  // ════ 运动防护 ════
  { id: 'sport-hub', url: 'sport-hub.html', title: '运动防护 — 熊猫手护', titleEn: 'Sport Protection — Panda Guard', desc: '14种运动专项防护手套：攀岩、骑行、射击、拳击、摩托、滑雪、战术等，兼顾防护性能与运动表现。', keywords: '运动 攀岩 骑行 射击 摩托 滑雪 战术', pageType: '分类', category: 'sport' },
  { id: 'sport-cycling', url: 'sport-cycling.html', title: '骑行防护手套', titleEn: 'Cycling Gloves', desc: '专业骑行手套，减震掌垫+透气网眼，防滑握把，适合公路骑行、山地越野、城市通勤。', keywords: '骑行 山地 公路 通勤 防滑', pageType: '运动', category: 'sport' },
  { id: 'sport-climbing', url: 'sport-climbing.html', title: '攀岩防护手套', titleEn: 'Climbing Gloves', desc: '攀岩专用手套，卓越抓握力+手掌防滑处理，保护手部免受岩石磨损，适合室内外攀岩。', keywords: '攀岩 攀石 岩壁 防滑 磨损', pageType: '运动', category: 'sport' },
  { id: 'sport-shooting', url: 'sport-shooting.html', title: '射击防护手套', titleEn: 'Shooting Gloves', desc: '射击专用手套，精准操控+枪械握把防滑，适合竞技射击、狩猎、战术射击。', keywords: '射击 狩猎 战术 精准', pageType: '运动', category: 'sport' },
  { id: 'sport-boxing', url: 'sport-boxing.html', title: '拳击/搏击防护手套', titleEn: 'Boxing Gloves', desc: '搏击专项手套，拳击散打防护，EVA减震+透气设计，保护拳峰与手部关节。', keywords: '拳击 散打 搏击 减震', pageType: '运动', category: 'sport' },
  { id: 'sport-motorcycle', url: 'sport-motorcycle.html', title: '摩托骑行防护手套', titleEn: 'Motorcycle Gloves', desc: '摩托车手套，CE认证防护+防风防水面料，关节护甲，适合长途摩旅与赛道骑行。', keywords: '摩托 骑行 护甲 防风防水', pageType: '运动', category: 'sport' },
  { id: 'sport-skiing', url: 'sport-skiing.html', title: '滑雪防护手套', titleEn: 'Ski Gloves', desc: '专业滑雪手套，3M Thinsulate保暖+防水透气GORE-TEX，压胶密封工艺，适合高山滑雪与单板滑雪。', keywords: '滑雪 单板 高山 保暖 防水', pageType: '运动', category: 'sport' },
  { id: 'sport-tactical', url: 'sport-tactical.html', title: '战术/军警防护手套', titleEn: 'Tactical Gloves', desc: '军警战术手套，KP认证关节防护+耐切割面料，防刮耐磨，适合执法、特勤、户外战术。', keywords: '战术 军警 KP认证 执法', pageType: '运动', category: 'sport' },
  { id: 'sport-extreme', url: 'sport-extreme.html', title: '极限运动防护手套', titleEn: 'Extreme Sports Gloves', desc: '极限运动综合手套，冲浪、尾波滑水、越野摩托等高强度运动专用，兼顾灵活性与防护性。', keywords: '极限 冲浪 尾波 越野', pageType: '运动', category: 'sport' },
  { id: 'sport-ball', url: 'sport-ball.html', title: '球类运动防护手套', titleEn: 'Ball Sports Gloves', desc: '篮球、排球、棒球等球类运动手套，防滑吸汗+关节保护，适合训练与比赛。', keywords: '篮球 排球 棒球 防滑 吸汗', pageType: '运动', category: 'sport' },
  { id: 'sport-fitness', url: 'sport-fitness.html', title: '健身运动防护手套', titleEn: 'Fitness Gloves', desc: '多功能健身手套，保护手掌防茧，增强握力，适合举铁、CrossFit、引体向上等高强度训练。', keywords: '健身 举铁 CrossFit 握力 防茧', pageType: '运动', category: 'sport' },
  { id: 'sport-running', url: 'sport-running.html', title: '跑步/马拉松防护手套', titleEn: 'Running Gloves', desc: '轻量跑步手套，防风透气+触摸屏兼容，适合冬季跑步、马拉松、户外慢跑。', keywords: '跑步 马拉松 防风 触摸屏', pageType: '运动', category: 'sport' },
  { id: 'sport-fishing', url: 'sport-fishing.html', title: '钓鱼防护手套', titleEn: 'Fishing Gloves', desc: '钓鱼专用手套，防滑防水面料+保暖设计，保护手部免受鱼钩、鱼线伤害，适合海钓与淡水钓。', keywords: '钓鱼 防滑 防水 保暖', pageType: '运动', category: 'sport' },
  { id: 'sport-golf', url: 'sport-golf.html', title: '高尔夫防护手套', titleEn: 'Golf Gloves', desc: '高尔夫手套，仿羊皮掌心+透气网背，卓越握感与击球手感，适合练习场与下场打球。', keywords: '高尔夫 握感 仿羊皮', pageType: '运动', category: 'sport' },
  { id: 'sport-hunting', url: 'sport-hunting.html', title: '狩猎防护手套', titleEn: 'Hunting Gloves', desc: '狩猎专用手套，迷彩防刮面料+静音设计，保护手部免受树枝划伤，适合户外打猎。', keywords: '狩猎 迷彩 静音 防刮', pageType: '运动', category: 'sport' },
  { id: 'sport-equestrian', url: 'sport-equestrian.html', title: '马术防护手套', titleEn: 'Equestrian Gloves', desc: '马术手套，缰绳握把防滑设计+关节保护，透气舒适，适合马场骑乘与马球运动。', keywords: '马术 缰绳 防滑 骑乘', pageType: '运动', category: 'sport' },

  // ════ 工厂与设备 ════
  { id: 'factory', url: 'factory.html', title: '关于我们 — 熊猫手护', titleEn: 'About Panda Guard', desc: '熊猫手护北京总部与全国制造基地介绍，20年专业手部防护经验，年产防护手套2000万双以上。', keywords: '工厂 制造 北京 总部', pageType: '品牌', category: 'brand' },
  { id: 'equipment-hub', url: 'equipment-hub.html', title: '生产设备 — 熊猫手护', titleEn: 'Production Equipment — Panda Guard', desc: '全流程先进生产设备展示：智能针织机、浸胶生产线、缝纫系统、压印设备、全自动包装线、环保处理系统。', keywords: '设备 针织 浸胶 缝纫 包装', pageType: '工厂', category: 'factory' },
  { id: 'equipment-knitting', url: 'equipment-knitting.html', title: '智能针织设备', titleEn: 'Knitting Equipment', desc: '德国进口全自动电脑针织机，18针超细编织工艺，一次成型无缝设计，实现轻薄与强度的完美结合。', keywords: '针织 电脑 细针 无缝', pageType: '设备', category: 'factory' },
  { id: 'equipment-coating', url: 'equipment-coating.html', title: '浸胶涂层设备', titleEn: 'Coating Equipment', desc: '全自动化丁腈/PU浸胶涂层生产线，精准控制涂层厚度，确保每双手套防护性能一致稳定。', keywords: '浸胶 丁腈 PU 涂层 自动化', pageType: '设备', category: 'factory' },
  { id: 'equipment-sewing', url: 'equipment-sewing.html', title: '缝纫系统', titleEn: 'Sewing Systems', desc: '全自动高速缝纫系统，进口高强度缝纫线，保证手套接缝牢固耐用，适合各类工业手套加工。', keywords: '缝纫 线 高强度 工业', pageType: '设备', category: 'factory' },
  { id: 'equipment-pressing', url: 'equipment-pressing.html', title: '压印/硫化设备', titleEn: 'Pressing & Vulcanizing Equipment', desc: '高温硫化压印设备，品牌标识精准压印，手套成型定型专用，确保尺寸稳定性与品牌一致性。', keywords: '压印 硫化 定型 高温', pageType: '设备', category: 'factory' },
  { id: 'equipment-packaging', url: 'equipment-packaging.html', title: '全自动包装线', titleEn: 'Automated Packaging Line', desc: '自动化包装系统，独立封口包装+纸卡挂条，日产能30万双，支持OEM/ODM定制包装服务。', keywords: '包装 自动 封口 OEM', pageType: '设备', category: 'factory' },
  { id: 'equipment-eco', url: 'equipment-eco.html', title: '环保处理系统', titleEn: 'Eco-Friendly Treatment System', desc: '全套废水废气环保处理设备，ISO 14001环境管理体系认证，践行绿色制造与可持续发展承诺。', keywords: '环保 ISO14001 废水 绿色', pageType: '设备', category: 'factory' },
  { id: 'production-process', url: 'production-process.html', title: '生产工艺流程 — 熊猫手护', titleEn: 'Production Process — Panda Guard', desc: '从原料检测到成品出库的完整生产工艺流程：纱线→针织→浸胶→硫化→质检→包装，每一步都有质量追溯。', keywords: '工艺 流程 质检 追溯', pageType: '工厂', category: 'factory' },
  { id: 'quality-control', url: 'quality-control.html', title: '质量控制体系 — 熊猫手护', titleEn: 'Quality Control — Panda Guard', desc: 'ISO 9001质量管理体系，全流程质量追溯，从原料到成品的每一道检验，确保出厂产品100%合格。', keywords: '质量 ISO9001 质检 追溯', pageType: '工厂', category: 'factory' },

  // ════ 材料与认证 ════
  { id: 'materials', url: 'materials.html', title: '防护材料解析 — 熊猫手护', titleEn: 'Protective Materials — Panda Guard', desc: '芳纶/HPPE/丁腈/TPR等核心防护材料解析，材质特性与适用场景对比，帮助您理解产品技术参数。', keywords: '材料 芳纶 HPPE 丁腈 TPR', pageType: '技术', category: 'tech' },
  { id: 'fluid-test', url: 'fluid-test.html', title: '液体渗透测试 — 熊猫手护', titleEn: 'Fluid Penetration Testing', desc: 'EN 374-3液体渗透测试方法解析，化学品渗透时间与防护等级对照表，测试流程与认证流程说明。', keywords: '渗透 EN374 测试 认证', pageType: '技术', category: 'tech' },
  { id: 'standards', url: 'standards.html', title: '认证标准体系 — 熊猫手护', titleEn: 'Certification Standards', desc: 'EN 388/EN 374/EN 407/EN 420等欧盟标准，ANSI/ISEA 105美国标准，ISO 9001/ISO 14001认证全解析。', keywords: '认证 EN388 EN374 EN407 ANSI ISO', pageType: '技术', category: 'tech' },
  { id: 'research', url: 'research-center.html', title: '研发中心 — 熊猫手护', titleEn: 'R&D Center — Panda Guard', desc: '专业研发团队+国家认可实验室，持续投入材料科学与防护技术创新，拥有多项核心专利技术。', keywords: '研发 实验室 专利 材料', pageType: '品牌', category: 'brand' },

  // ════ 内容页 ════
  { id: 'children', url: 'children-safety.html', title: '儿童手部安全教育 — 熊猫手护', titleEn: 'Children Hand Safety Education', desc: '儿童手部安全知识科普：家庭安全隐患识别、正确使用工具、安全教育游戏，培养儿童安全意识。', keywords: '儿童 安全 教育 家庭', pageType: '内容', category: 'content' },
  { id: 'sustainability', url: 'sustainability.html', title: '可持续发展 — 熊猫手护', titleEn: 'Sustainability — Panda Guard', desc: '企业ESG战略与可持续发展承诺，PandaECO再生系列，GRS认证，碳足迹追踪，绿色供应链建设。', keywords: 'ESG 可持续 绿色 GRS 碳足迹', pageType: '内容', category: 'content' },
  { id: 'contact', url: 'contact.html', title: '联系我们 — 熊猫手护', titleEn: 'Contact Us — Panda Guard', desc: '联系咨询、询价采购、试样申请三种表单入口，全国服务热线，专业客服团队7×24小时响应。', keywords: '联系 询价 试样 咨询', pageType: '页面', category: 'page' },
  { id: 'faq', url: 'faq.html', title: '常见问题 — 熊猫手护', titleEn: 'FAQ — Panda Guard', desc: '产品选型、认证标准、试样申请、订购交付、定制服务等常见问题解答，快速找到您关心的问题答案。', keywords: 'FAQ 问题 选型 试样 交付', pageType: '页面', category: 'page' },
];
