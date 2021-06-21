import React, { useState, useEffect } from 'react';
import lodash from 'lodash';
import { DownSquareOutlined } from '@ant-design/icons';
import { Button, InputNumber, Tooltip } from 'antd';
import { SUBSIDY_TASK_ROLE, SUBSIDY_ACTION_ROLE } from '@/common/constant';
import { MreSelect, MreSelectShow, UserSelectShow } from '@/components/MerUserSelectTable';
import FormCondition from '@/components/FormCondition';

const SubsidyDirectMoney = (props) => {
  const { form, detail, tab } = props;

  const [role, setRole] = useState(false); // 补贴角色
  const [visible, setVisible] = useState(false); // 选择店铺弹窗
  const [mreList, setMreList] = useState({ keys: [], list: [] }); // 选择店铺后回显的数据
  const [visibleSelect, setVisibleSelect] = useState(false); // 选择用户弹窗
  const [userList, setUserList] = useState({ keys: [], list: [], resultList: [] }); // 选择后回显的数据
  const [userNumber, setUserNumber] = useState({}); // 卡豆数 暂存输入值
  const [userTotal, setUserTotal] = useState(0); // 卡豆数总数
  const [rechargeBeans, setRechargeBeans] = useState(0); // 商户卡豆数总数

  // 设置form表单值 店铺id
  useEffect(() => {
    const directChargeList = mreList.keys.map((item) => ({
      roleId: item,
      directChargeBean: rechargeBeans || 0,
    }));
    form.setFieldsValue({ directChargeList });
    form.setFieldsValue({ merchantIds: mreList.keys.toString() });
  }, [mreList, rechargeBeans]);

  // 监听用户卡豆数变化
  useEffect(() => {
    const newData = lodash.pickBy(userNumber, (value, key) => userList.keys.includes(key));
    const directChargeList = Object.keys(newData).map((item) => ({
      roleId: item,
      directChargeBean: newData[item] || 0,
    }));
    setUserTotal(lodash.sumBy(directChargeList, 'directChargeBean'));
    form.setFieldsValue({ directChargeList });
  }, [userList, userNumber]);

  // 向下填充
  const downBean = (bean) => {
    if (!bean) return;
    const obj = {};
    userList.keys.map((item) => (obj[item] = bean));
    setUserNumber(obj);
  };

  const formItems = [
    {
      label: '任务名称',
      name: 'taskName',
    },
    {
      label: '补贴角色',
      name: 'role',
      type: 'select',
      select: tab === 'direct' ? SUBSIDY_ACTION_ROLE : SUBSIDY_TASK_ROLE,
      onChange: (val) => {
        form.setFieldsValue({ directChargeList: undefined });
        setRole(val);
      },
    },
    {
      label: '适用店铺',
      name: tab === 'direct' ? 'directChargeList' : 'merchantIds', // 营销卡豆 merchantIds
      type: 'formItem',
      rules: [{ required: true, message: '请选择店铺' }],
      visible: role === 'merchant',
      formItem: (
        <Button type="primary" ghost onClick={() => setVisible(true)}>
          选择店铺
        </Button>
      ),
    },
    {
      label: '适用店铺',
      type: 'noForm',
      visible: role === 'merchant',
      formItem: <MreSelectShow key="MreTable" {...mreList} setMreList={setMreList}></MreSelectShow>,
    },
    {
      label: '适用用户',
      name: 'directChargeList',
      type: 'formItem',
      visible: role === 'user',
      rules: [{ required: true, message: '请选择用户' }],
      formItem: (
        <Button type="primary" ghost onClick={() => setVisibleSelect(true)}>
          选择用户
        </Button>
      ),
    },
    {
      label: '适用用户',
      type: 'noForm',
      visible: role === 'user',
      formItem: (
        <UserSelectShow
          key="UserTable"
          {...userList}
          showSelect={visibleSelect}
          onCancelShowSelect={() => setVisibleSelect(false)}
          onOk={(val) => {
            setUserList(val);
            form.setFieldsValue({ userIdList: val });
          }}
          otherColumns={[
            {
              fixed: 'right',
              title: '充值卡豆数',
              dataIndex: 'recycleBean',
              render: (val, record, index) => (
                <>
                  <InputNumber
                    value={userNumber[record.userIdString]}
                    precision={0}
                    min={0}
                    onChange={(val) =>
                      setUserNumber(({ sum, ...other }) => ({
                        ...other,
                        [record.userIdString]: val,
                      }))
                    }
                  ></InputNumber>
                  {userList.list[0].userIdString === record.userIdString && (
                    <Tooltip placement="top" title={'向下填充（已勾选数据）'}>
                      <DownSquareOutlined
                        onClick={() => downBean(userNumber[record.userIdString])}
                        style={{ fontSize: 20, marginLeft: 5, cursor: 'pointer' }}
                      ></DownSquareOutlined>
                    </Tooltip>
                  )}
                </>
              ),
            },
          ]}
        ></UserSelectShow>
      ),
    },
    {
      label: '充值卡豆数',
      name: 'rechargeBeans', // 营销卡豆
      type: role === 'user' ? 'formItem' : 'number',
      precision: 0,
      min: 0,
      max: 999999999,
      formItem: <>{userTotal}</>,
      onChange: (e) => setRechargeBeans(e), // 平台直冲
    },
    {
      label: '充值凭证',
      name: 'certificate',
      type: 'upload',
      maxFile: 1,
    },
  ];

  return (
    <>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
      <MreSelect
        keys={mreList.keys}
        visible={visible}
        mreList={mreList.list}
        onOk={(val) => setMreList(val)}
        onCancel={() => setVisible(false)}
      ></MreSelect>
    </>
  );
};

export default SubsidyDirectMoney;
