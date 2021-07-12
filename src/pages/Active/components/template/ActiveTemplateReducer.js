/**
 * reducer 默认值
 */
export const reducerValue = {
  show: false, // 模版编辑是否显示
  // 模版信息
  info: {
    img: '', // 模版封面
    id: '', // 模版id
    title: '活动模版', // 模版名字
    activeName: '', // 活动名称
  },
  // 组件编辑模块显示内容
  showEditor: {
    id: '', // 组件id
    index: '', // 数据下标
    name: '', // 组件名称
    type: '', // 组件类型
    moduleEditData: {}, // 当前编辑组件的数据
  },
  showActive: {
    activeUrl: '', // 活动的url路径
    activePreviewQr: true, // 活动的qr显示
    activeHtml: '', // 活动的html
  },
  // 组件选项打开类型
  showPanel: {
    id: '', // 组件id
    type: '', // 组件类型
    top: 0, // 组件定位
    height: 0, // 组件高
    width: 0, // 组件宽
    ptype: '', // 组件选项面板类型
  },
  // 已储存的模版数据
  /**
   * { id:'', type, data }
   */
  moduleData: { data: [] },
};

/**
 * reducer 处理
 * @type {*}  initialize 数据重置
 *            save 储存数据
 *            showEditor 展示组件编辑面板
 *            closeEditor 关闭编辑面板
 *            saveModuleData 存储模版编辑数据
 */
export const fetchReducerEdit = (state, action) => {
  switch (action.type) {
    case 'initialize':
      return reducerValue;
    case 'save':
      return {
        ...state,
        ...payload,
      };
    case 'showEditor':
      return {
        ...state,
        showEditor: action.payload,
      };
    case 'closeEditor':
      return {
        ...state,
        showEditor: { type: '' },
      };
    case 'saveModuleData':
      return {
        ...state,
        moduleData: action.payload,
      };
    default:
      return state;
  }
};
