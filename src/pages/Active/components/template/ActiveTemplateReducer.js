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
    type: '', // 组件类型
    name: '', // 组件名称
    data: null, // 当前编辑组件的数据
  },
  showActive: {
    activeUrl: '', // 活动的url路径
    activePreviewQr: true, // 活动的qr显示
    activeHtml: '', // 活动的html
  },
  showPanel: null, // 展示区域高亮面板下标
  /**
   * 已储存的模版数据
   * dataList[showEditor{}]
   */
  moduleData: { backgroundColor: '#ffffff', dataList: [] },
};

/**
 * reducer 处理
 * @type {*}  initialize 数据重置
 *            save 储存数据
 *            showPanel 当前编辑组件选框下标
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
    case 'showPanel':
      return {
        ...state,
        showPanel: action.payload,
      };
    case 'closeEditor':
      return {
        ...state,
        showPanel: null,
        showEditor: { type: '' },
      };
    case 'saveModuleData':
      return {
        ...state,
        moduleData: { ...state.moduleData, ...action.payload },
      };
    default:
      return state;
  }
};
