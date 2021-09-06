import React, { useState, useEffect } from 'react';
import lodash from 'lodash';
import { DownSquareOutlined } from '@ant-design/icons';
import { Button, InputNumber, Tooltip } from 'antd';
import { SUBSIDY_TASK_ROLE, SUBSIDY_ACTION_ROLE } from '@/common/constant';
import {
  MreSelect,
  MreSelectShow,
  UserSelectShow,
  GroupSelectModal,
  GroupSelectShow,
} from '@/components/MerUserSelectTable';
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
  const [visibleGroup, setVisibleGroup] = useState(false); // 选择店铺弹窗
  const [groupList, setGroupList] = useState({ keys: [], list: [] }); // 选择集团后回显的数据
  const [mreNumber, setMreNumber] = useState({}); // 店铺回收卡豆数 暂存输入值
  const [groupNumber, setGroupNumber] = useState({}); // 集团回收卡豆数 暂存输入值

  // 设置form表单值 店铺id
  // useEffect(() => {
  //   const subsidyBeanObjects = mreList.keys.map((item) => ({
  //     ownerId: item,
  //     bean: rechargeBeans || 0,
  //   }));
  //   form.setFieldsValue({ subsidyBeanObjects });
  //   form.setFieldsValue({ merchantIds: mreList.keys.toString() });
  // }, [mreList, rechargeBeans]);

  // 监听用户卡豆数变化
  useEffect(() => {
    // user: '用户', merchant: '店铺', group: '集团'
    const list = { user: userList, merchant: mreList, group: groupList }[role];
    const number = { user: userNumber, merchant: mreNumber, group: groupNumber }[role];
    const newData = lodash.pickBy(number, (value, key) => list.keys.includes(key));
    const subsidyBeanObjects = Object.keys(newData).map((item) => ({
      ownerId: item,
      bean: newData[item] || 0,
    }));
    setUserTotal(lodash.sumBy(subsidyBeanObjects, 'bean'));
    form.setFieldsValue({ subsidyBeanObjects });
  }, [userList, userNumber, mreList, mreNumber, groupList, groupNumber]);

  // 向下填充
  const downBean = (bean) => {
    if (!bean) return;
    const obj = {};
    const list = { user: userList, merchant: mreList, group: groupList }[role];
    list.keys.map((item) => (obj[item] = bean));
    switch (role) {
      case 'user':
        setUserNumber(obj);
        break;
      case 'merchant':
        setMreNumber(obj);
        break;
      case 'group':
        setGroupNumber(obj);
        break;
    }
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
        form.setFieldsValue({ subsidyBeanObjects: undefined });
        setRole(val);
        setUserList({ keys: [], list: [] });
        setMreList({ keys: [], list: [] });
        setGroupList({ keys: [], list: [] });
      },
    },
    {
      label: '适用店铺',
      name: 'subsidyBeanObjects',
      // name: tab === 'direct' ? 'subsidyBeanObjects' : 'merchantIds', // 营销卡豆 merchantIds
      type: 'formItem',
      rules: [{ required: true, message: '请选择店铺/子门店' }],
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
      formItem: (
        <MreSelectShow
          key="MreTable"
          {...mreList}
          setMreList={setMreList}
          otherColumns={[
            {
              fixed: 'right',
              title: '回收卡豆数',
              dataIndex: 'bean',
              render: (val, record) => (
                <>
                  <InputNumber
                    value={mreNumber[record.userMerchantIdString]}
                    precision={0}
                    min={1}
                    onChange={(val) => {
                      console.log(val, 'ddd');
                      setMreNumber(({ sum, ...other }) => {
                        console.log(sum, other, 'ooo');
                        return {
                          ...other,
                          [record.userMerchantIdString]: val,
                        };
                      });
                    }}
                  ></InputNumber>
                  {mreList.list[0].userMerchantIdString === record.userMerchantIdString && (
                    <Tooltip placement="top" title={'向下填充（已勾选数据）'}>
                      <DownSquareOutlined
                        onClick={() => downBean(mreNumber[record.userMerchantIdString])}
                        style={{ fontSize: 20, marginLeft: 5, cursor: 'pointer' }}
                      ></DownSquareOutlined>
                    </Tooltip>
                  )}
                </>
              ),
            },
          ]}
        ></MreSelectShow>
      ),
    },

    {
      label: '适用集团',
      name: 'subsidyBeanObjects',
      type: 'formItem',
      visible: role === 'group',
      formItem: (
        <Button type="primary" ghost onClick={() => setVisibleGroup(true)}>
          选择集团
        </Button>
      ),
    },
    {
      label: '适用集团',
      type: 'noForm',
      visible: role === 'group',
      formItem: (
        <GroupSelectShow
          key="MreTable"
          {...groupList}
          setGroupList={setGroupList}
          otherColumns={[
            {
              fixed: 'right',
              title: '回收卡豆数',
              dataIndex: 'bean',
              render: (val, record) => (
                <>
                  <InputNumber
                    value={groupNumber[record.merchantGroupIdString]}
                    precision={0}
                    min={1}
                    onChange={(val) =>
                      setGroupNumber(({ sum, ...other }) => ({
                        ...other,
                        [record.merchantGroupIdString]: val,
                      }))
                    }
                  ></InputNumber>
                  {groupList.list[0].merchantGroupIdString === record.merchantGroupIdString && (
                    <Tooltip placement="top" title={'向下填充（已勾选数据）'}>
                      <DownSquareOutlined
                        onClick={() => downBean(groupNumber[record.merchantGroupIdString])}
                        style={{ fontSize: 20, marginLeft: 5, cursor: 'pointer' }}
                      ></DownSquareOutlined>
                    </Tooltip>
                  )}
                </>
              ),
            },
          ]}
        ></GroupSelectShow>
      ),
    },

    {
      label: '适用用户',
      name: 'subsidyBeanObjects',
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
          maxLength={500}
          key="UserTable"
          {...userList}
          params={{ isDaren: 1 }}
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
              dataIndex: 'bean',
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
      name: 'bean',
      type: 'formItem',
      formItem: <>{userTotal}</>,
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
      {/* merchant */}
      <MreSelect
        keys={mreList.keys}
        visible={visible}
        mreList={mreList.list}
        onOk={(val) => setMreList(val)}
        onCancel={() => setVisible(false)}
      ></MreSelect>
      {/* group */}
      <GroupSelectModal
        keys={groupList.keys}
        visible={visibleGroup}
        groupList={groupList.list}
        onOk={(val) => setGroupList(val)}
        onCancel={() => setVisibleGroup(false)}
      ></GroupSelectModal>
    </>
  );
};

export default SubsidyDirectMoney;
