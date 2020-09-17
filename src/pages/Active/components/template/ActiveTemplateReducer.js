/**
 * reducer 默认值
 */
export const reducerValue = {
  // 模版信息
  info: {
    img: '', // 模版封面
    templateUrl: '', // 模版url
    id: '', // 模版id
    title: '活动模版', // 模版名字
  },
  show: false, // 模版编辑是否显示
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
    type: '', // 组件类型
  },
  // 模版数据
  moduleList: [],
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
    case 'showPanel':
      return {
        ...state,
        ...action.payload,
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
      return {
        ...state,
        moduleList: [...state.moduleList, action.payload],
      };
    default:
      return state;
  }
};
