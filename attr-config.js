/**
 * 产品属性配置库
 * 定义10个品牌系列各自的专属字段
 * 前端根据产品所属系列，动态渲染对应的属性
 *
 * techFields.label 必须和 products-data.js 中 attributes 的 key 一致
 */

window.PandaAttrConfig = {

  // ── brand → 系列代码 映射 ─────────────────────────
  brandMap: {
    'shield':  'SHD',
    'pierce':  'PIR',
    'impact':  'IMP',
    'chem':    'CHM',
    'bio':     'BIO',
    'volt':    'VOL',
    'heat':    'HEA',
    'frost':   'FRS',
    'grip':    'GRP',
    'eco':     'ECO'
  },

  // ── 各系列专属字段（label必须和products-data中的attributes key一致）──

  // SHD · 防切割/撕裂/磨损
  SHD: {
    name: 'PandaSHIELD™ 防切割',
    abbr: 'SHD',
    techFields: [
      { key: '防护等级',    label: '防护等级',    type: 'text' },
      { key: '型号',       label: '型号',         type: 'text' },
      { key: '原产地',     label: '原产地',       type: 'text' },
      { key: '品牌',       label: '品牌',         type: 'text' },
      { key: '涂层',       label: '涂层',         type: 'text' },
      { key: '尺码',       label: '尺码',         type: 'text' },
      { key: '颜色',       label: '颜色',         type: 'text' },
      { key: '内衬',       label: '内衬',         type: 'text' },
      { key: '袖口',       label: '袖口',         type: 'text' },
      { key: '包装',       label: '包装',         type: 'text' },
      { key: '单品尺寸',   label: '单品尺寸',     type: 'text' },
      { key: '单品净重',   label: '单品净重',     type: 'text' },
      { key: '外箱尺寸',   label: '外箱尺寸',     type: 'text' },
      { key: '外箱毛重',   label: '外箱毛重',     type: 'text' },
      { key: '认证',       label: '认证',         type: 'text' },
      { key: 'MOQ',        label: 'MOQ',          type: 'text' },
      { key: '交货期',     label: '交货期',       type: 'text' },
      { key: '应用领域',   label: '应用领域',     type: 'text' }
    ]
  },

  // PIR · 防穿刺
  PIR: {
    name: 'PandaPIERCE™ 防穿刺',
    abbr: 'PIR',
    techFields: [
      { key: '防护等级',    label: '防护等级',    type: 'text' },
      { key: '型号',       label: '型号',         type: 'text' },
      { key: '衬里材料',   label: '衬里材料',     type: 'text' },
      { key: '涂层',       label: '涂层',         type: 'text' },
      { key: '尺码',       label: '尺码',         type: 'text' },
      { key: '颜色',       label: '颜色',         type: 'text' },
      { key: '包装',       label: '包装',         type: 'text' },
      { key: '原产地',     label: '原产地',       type: 'text' },
      { key: '认证',       label: '认证',         type: 'text' },
      { key: 'MOQ',        label: 'MOQ',          type: 'text' }
    ]
  },

  // IMP · 防冲击
  IMP: {
    name: 'PandaIMPACT™ 防冲击',
    abbr: 'IMP',
    techFields: [
      { key: 'impactLevel', label: '防护等级',      type: 'select' },
      { key: 'model',      label: '型号',           type: 'text' },
      { key: 'liner',      label: '内衬材质',        type: 'text' },
      { key: 'weight',     label: '克重',            type: 'text' }
    ]
  },

  // CHM · 防油污/酸碱/溶剂
  CHM: {
    name: 'PandaCHEM™ 防油污',
    abbr: 'CHM',
    techFields: [
      { key: 'chemLevel',    label: '防护等级',     type: 'select' },
      { key: 'model',        label: '型号',          type: 'text' },
      { key: 'liner',        label: '内衬材质',      type: 'text' },
      { key: 'coating_mat',  label: '涂层材料',      type: 'text' },
      { key: 'thickness',    label: '厚度',          type: 'text' },
      { key: 'app_area',     label: '应用领域',      type: 'text' }
    ]
  },

  // BIO · 防生物感染
  BIO: {
    name: 'PandaBIO™ 防生物感染',
    abbr: 'BIO',
    techFields: [
      { key: 'bioLevel',      label: '防护等级',   type: 'select' },
      { key: 'powder_free',   label: '无粉',       type: 'select' },
      { key: 'sterile',       label: '无菌',       type: 'select' },
      { key: 'model',         label: '型号',       type: 'text' }
    ]
  },

  // VOL · 防电/绝缘/静电
  VOL: {
    name: 'PandaVOLT™ 防电',
    abbr: 'VOL',
    techFields: [
      { key: 'voltLevel',  label: '防护等级',   type: 'select' },
      { key: 'model',      label: '型号',       type: 'text' },
      { key: 'liner',      label: '内衬材质',    type: 'text' },
      { key: 'weight',     label: '克重',        type: 'text' }
    ]
  },

  // HEA · 防火/阻燃/耐高温
  HEA: {
    name: 'PandaHEAT™ 耐高温',
    abbr: 'HEA',
    techFields: [
      { key: 'temp_range',    label: '耐温范围',     type: 'text' },
      { key: 'standard',      label: '执行标准',     type: 'text' },
      { key: 'model',         label: '型号',          type: 'text' },
      { key: 'liner',         label: '内衬材质',      type: 'text' },
      { key: 'coating_mat',   label: '涂层材料',      type: 'text' },
      { key: 'thickness',     label: '厚度',          type: 'text' },
      { key: 'weight',        label: '克重',          type: 'text' }
    ]
  },

  // FRS · 防寒保暖
  FRS: {
    name: 'PandaFROST™ 防寒保暖',
    abbr: 'FRS',
    techFields: [
      { key: 'temp_range',  label: '耐温范围',   type: 'text' },
      { key: 'liner',       label: '内里材质',   type: 'text' },
      { key: 'model',       label: '型号',       type: 'text' },
      { key: 'weight',      label: '克重',       type: 'text' }
    ]
  },

  // GRP · 防震防滑
  GRP: {
    name: 'PandaGRIP™ 防震防滑',
    abbr: 'GRP',
    techFields: [
      { key: 'gripType',   label: '防滑类型',   type: 'select' },
      { key: 'coating',    label: '涂层类型',   type: 'text' },
      { key: 'model',      label: '型号',       type: 'text' },
      { key: 'liner',      label: '内衬材质',   type: 'text' },
      { key: 'weight',     label: '克重',       type: 'text' }
    ]
  },

  // ECO · 环保可持续
  ECO: {
    name: 'PandaECO™ 环保可持续',
    abbr: 'ECO',
    techFields: [
      { key: 'recycled',  label: '再生材料比例', type: 'text' },
      { key: 'liner',     label: '材质',         type: 'text' },
      { key: 'model',     label: '型号',         type: 'text' },
      { key: 'weight',    label: '克重',         type: 'text' }
    ]
  }

};

/**
 * 根据brand获取对应的字段配置
 * @param {string} brand - 产品brand值，如 'shield', 'heat' 等
 * @returns {object} 包含techFields的配置
 */
window.PandaAttrConfig.getFieldsByBrand = function(brand) {
  var seriesCode = this.brandMap[brand] || brand || 'SHD';
  var seriesConfig = this[seriesCode] || {};
  return {
    tech: seriesConfig.techFields || []
  };
};
