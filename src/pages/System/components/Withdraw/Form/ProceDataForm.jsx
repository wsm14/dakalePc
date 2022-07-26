import React from 'react';
import { connect } from 'umi';
import { AGENCY_TYPE } from '@/common/constant';
import { Button, Form, InputNumber, Switch } from 'antd';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import WithdrawFormList from './WithdrawFormList';
import RegularForm from './RegularForm';
import styles from '../index.less';
import cityList from '@/common/city';

const ProceDataForm = (props) => {
  const { childRef, visible = {}, onClose, loading, dispatch } = props;
  const [form] = Form.useForm();

  const textDetail = () => {
    const key = 'handlingFeeList';
    const getData = (name) => form.getFieldValue(name) || 0;
    const handlingFeeTop = getData([key, 0, 'handlingFee']);
    const handlingFee = getData([key, 1, 'handlingFee']);
    const maxMoney = getData([key, 0, 'maxMoney']);
    return [
      `单笔提现金额最低为${getData('singleMinMoney')}元人民币（${
        getData('singleMinMoney') * 100
      }卡豆)`,
      `每日可申请提现${getData('dayLimitCount')}次，若当日次数已满，请次日申请；`,
      `提现金额不满${maxMoney}元人民币（${
        maxMoney * 100
      }卡豆），每次提现手续费为${handlingFeeTop}元人民币，超过或包含${maxMoney}元人民币（${
        maxMoney * 100
      }卡豆）${!handlingFee ? '免提现手续费；' : `每次提现手续费为${handlingFee}元；`}`,
      '每月首次提现免手续费；',
    ];
  };

  const {
    show = false,
    detail = {
      monthIsFree: 1,
      contentList: [
        ...textDetail(),
        '提现申请将在1-3个工作日内审核到账，请耐心等待；',
        '如有任何疑问，请联系哒卡乐客服 400-8000-5881。',
      ],
      handlingFeeList: [
        { minMoney: 0, maxMoney: '', handlingFee: '', weight: 1 },
        { minMoney: '', maxMoney: 999999999, handlingFee: '', weight: 2 },
      ],
    },
    userType = 'merchant',
  } = visible;

  // 对应字段修改，contentList 更新

  const handleChanges = (type) => {
    let list = textDetail(); // 更新后的不可修改数据
    const freeStatus = form.getFieldValue('monthIsFree'); // 每月首次提现免手续费状态开关
    const formListValue = form.getFieldValue('contentList'); // 表单内当前list 数据
    let formListEdit = formListValue.slice(4); // 默认截取包含 `手续费` 文案的内容
    // 每次数据改变时根据 当前 每月首次提现免手续费状态 获取数据更新
    if (!freeStatus) {
      list = list.slice(0, 3); // 不可修改数据截取
      formListEdit = formListValue.slice(3); // 表单内数据获取自定义部分
    }
    if (type === 'switch') {
      // 每月首次提现免手续费 按钮被点击时做数据截取 获取表单内原始数据的更新数据
      formListEdit = formListValue.slice(!freeStatus ? 4 : 3);
    }
    if (type === 'maxMoney') {
      const maxMoney = form.getFieldValue(['handlingFeeList', 0, 'maxMoney']);
      const mins = [...form.getFieldValue('handlingFeeList')];
      mins[1] = {
        ...mins[1],
        minMoney: maxMoney,
      };
      form.setFieldsValue({ handlingFeeList: mins });
    }
    form.setFieldsValue({ contentList: [...list, ...formListEdit] });
  };

  // 提交
  const handleSave = () => {
    form.validateFields().then((values) => {
      const { handlingFeeList } = values;
      const payload = {
        configWithdrawId: detail.configWithdrawId,
        userType: userType,
        ...values,
        handlingFeeList: handlingFeeList,
        monthIsFree: values.monthIsFree ? 1 : 0,
        contentList: values.contentList,
      };

      dispatch({
        type: 'widthdrawRegularList/fetchWithdrawUpdate',
        payload:
          userType === 'merchant'
            ? {
                ...payload,
                areaCode: values.areaCode ? values.areaCode[values.areaCode.length - 1] : '',
                areaType: values.areaCode == '' || values.areaCode == undefined ? 'all' : 'city',
              }
            : payload,
        callback: () => {
          childRef.current.fetchGetData();
          onClose();
        },
      });
    });
  };

  const formItems = [
    {
      label: '地区',
      name: 'areaCode',
      type: 'cascader',
      rules: [{ required: false }],
      select: JSON.parse(JSON.stringify(cityList)).map((item) => {
        item.children = item.children.map((items) => {
          return { label: items.label, value: items.value };
        });
        return item;
      }),
      visible: userType === 'merchant',
    },
    {
      type: 'noForm',
      formItem: <div style={{ marginLeft: 67 }}>{`代理商级别：${AGENCY_TYPE[userType]}`}</div>,
      visible: userType !== 'merchant',
    },
    {
      label: '提现规则',
      type: 'formItem',
      required: true,
      formItem: (
        <div>
          <div className={styles.flexCon}>
            <Form.Item label="单笔最低提现金额" name="singleMinMoney" rules={[{ required: true }]}>
              <InputNumber onChange={(val) => handleChanges(val)} style={{ width: 200 }} min={0} />
            </Form.Item>
            <span className={styles.spanAfter} style={{ marginRight: 10 }}>
              元
            </span>
          </div>
          <div className={styles.flexCon}>
            <Form.Item label="每日提现上限笔数" name="dayLimitCount" rules={[{ required: true }]}>
              <InputNumber
                onChange={(val) => handleChanges(val)}
                style={{ width: 200 }}
                min={0}
                precision={0}
              />
            </Form.Item>
            <span className={styles.spanAfter} style={{ marginRight: 10 }}>
              笔
            </span>
          </div>
          <Form.Item
            label="每月首次提现免手续费"
            name="monthIsFree"
            valuePropName="checked"
            rules={[{ required: true }]}
          >
            <Switch onChange={() => handleChanges('switch')} />
          </Form.Item>
        </div>
      ),
    },
    {
      label: '手续规则',
      type: 'formItem',
      required: true,
      formItem: <RegularForm form={form} handleChangesFn={handleChanges}></RegularForm>,
    },
    {
      type: 'formItem',
      label: '文案显示',
      name: 'regular',
      formItem: <WithdrawFormList form={form}></WithdrawFormList>,
    },
  ];
  const modalProps = {
    title: '提现手续费',
    visible: show,
    onClose,
    footer: (
      <Button type="primary" onClick={handleSave} loading={loading}>
        保存
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition formItems={formItems} form={form} initialValues={detail}></FormCondition>
    </DrawerCondition>
  );
};
export default connect(({ fetchWithdrawUpdate, loading }) => ({
  loading: loading.effects['widthdrawRegularList/fetchWithdrawUpdate'],
}))(ProceDataForm);
