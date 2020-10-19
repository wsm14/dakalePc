import { NUM_INT } from '@/common/regExp';
import { Form, InputNumber } from 'antd';
const TradePlatformSet = (props) => {
  const {
    dispatch,
    childRef,
    initialValues = {},
    categoryId,
    CeditType,
    configMerchantSettleId,
    rowData,
  } = props;

  const propItem = {
    1: {
      title: `面积新增`,
      payload: {
        categoryId,
        type: 'area',
      },
    },
    2: {
      title: `面积修改`,
      payload: {
        type: 'area',
        configMerchantSettleId,
      },
    },
    3: {
      title: `服务费设置`,
      name: 'specialService',
      url: 'sysTradeList/fetchTradePlatformSet',
      payload: { ...rowData },
    },
  }[CeditType];

  // 提交表单
  const fetchDataEdit = (values) => {
    let objdata = {};
    // 新增修改面积
    if (CeditType === 1 || CeditType === 2) {
      objdata = { typeContent: `${values.areaMin}-${values.areaMax}` };
    } else if (CeditType === 3) {
      // 新增服务费
      if (rowData === undefined) {
        objdata = {
          categoryId,
          merchantSettleObjects: values,
          type: 'no',
          typeContent: '',
        };
      } else if (configMerchantSettleId) {
        const { merchantSettleObjects: pObj = [] } = rowData;
        objdata = {
          categoryId,
          configMerchantSettleId: rowData.configMerchantSettleIdString,
          merchantSettleObjects: [...pObj, values],
        };
      } else {
        // 修改服务费
        const { merchantSettleObjects: pObj = [] } = rowData;
        objdata = {
          configMerchantSettleId: rowData.configMerchantSettleIdString,
          merchantSettleObjects: pObj.map((item) => {
            if (item.serviceFee === initialValues.serviceFee) {
              return values;
            }
            return item;
          }),
        };
      }
    }
    dispatch({
      type: 'sysTradeList/fetchTradePlatformSet',
      payload: { ...propItem.payload, ...objdata },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  return {
    type: 'Drawer',
    showType: 'form',
    title: `设置 - ${propItem.title}`,
    loadingModels: 'sysTradeList',
    initialValues,
    formItems: [
      {
        label: '面积区间',
        type: 'children',
        rules: 'false',
        required: true,
        visible: CeditType !== 3,
        children: (
          <>
            <Form.Item
              name="areaMin"
              noStyle
              rules={[{ required: true, message: '请输入最小面积' }]}
            >
              <InputNumber min={0} />
            </Form.Item>
            &nbsp;&nbsp;~ &nbsp;&nbsp;
            <Form.Item
              name="areaMax"
              noStyle
              rules={[{ required: true, message: '请输入最大面积' }]}
            >
              <InputNumber min={0} />
            </Form.Item>
          </>
        ),
      },
      {
        label: '服务费比例',
        name: 'serviceFee',
        addonAfter: '%',
        visible: CeditType === 3,
        addRules: [{ pattern: NUM_INT, message: '服务费比例应为整数' }],
      },
      {
        label: '赠送卡豆',
        name: 'freeBean',
        addonAfter: '个',
        visible: CeditType === 3,
        addRules: [{ pattern: NUM_INT, message: '赠送卡豆应为整数' }],
      },
    ],
    onFinish: fetchDataEdit,
    ...props,
  };
};

export default TradePlatformSet;
