/**
 * reducer 默认值
 */
export const reducerValue = {
  show: false, // 模版编辑是否显示
  // 模版信息
  info: {
    img: '', // 模版封面
    templateUrl: '', // 模版url
    id: '', // 模版id
    title: '活动模版', // 模版名字
    activeName: '', // 活动名称
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
    ptype: '', // 组件选项面板类型
  },
  // 组件编辑显示
  showEditor: {
    id: '', // 组件id
    name: '', // 组件名称
    type: '', // 组件类型
    moduleEditData: {}, // 当前编辑组件的数据
  },
  // 已储存的模版数据
  moduleData: [],
};

/**
 * reducer 处理
 * @type {*}  initialize 数据重置
 *            saveInfo 储存选择的模版信息
 *            showPanel 展示组件选择面板
 *            showEditor 展示组件编辑面板
 *            closeEditor 关闭编辑面板
 *            saveModuleData 存储模版编辑数据
 */
export const fetchReducerEdit = (state, action) => {
  switch (action.type) {
    case 'initialize':
      return reducerValue;
    case 'saveInfo':
      return {
        ...state,
        ...action.payload,
      };
    case 'showActive':
      return {
        ...state,
        showActive: { ...state.showActive, ...action.payload },
      };
    case 'showPanel':
      return {
        ...state,
        showPanel: action.payload,
      };
    case 'showEditor':
      return {
        ...state,
        showEditor: action.payload,
      };
    case 'closeEditor':
      return {
        ...state,
        showPanel: { height: 0, ptype: '' },
        showEditor: { type: '' },
      };
    case 'saveModuleData':
      const { moduleData } = state;
      const oldData = moduleData.filter((i) => i.id !== action.payload.id);
      return {
        ...state,
        moduleData: [...oldData, action.payload],
      };
    default:
      return state;
  }
};
