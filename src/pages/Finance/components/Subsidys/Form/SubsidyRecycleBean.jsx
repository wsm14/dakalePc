import React, { useState, useEffect } from 'react';
import lodash from 'lodash';
import { DownSquareOutlined } from '@ant-design/icons';
import { Button, InputNumber, Tooltip, Space } from 'antd';
import { SUBSIDY_ACTION_ROLES, SUBSIDY_TASK_ROLE } from '@/common/constant';
import {
  MreSelect,
  MreSelectShow,
  GroupSelectModal,
  GroupSelectShow,
  UserSelectShow,
} from '@/components/MerUserSelectTable';
import FormCondition from '@/components/FormCondition';
import ImportDataModal from './ImportDataModal';

const SubsidyRecycleBean = (props) => {
  const { form, detail, tab } = props;

  const [visible, setVisible] = useState(false); // 选择店铺弹窗
  const [visibleGroup, setVisibleGroup] = useState(false); // 选择店铺弹窗
  const [mreList, setMreList] = useState({ keys: [], list: [] }); // 选择店铺后回显的数据
  const [groupList, setGroupList] = useState({ keys: [], list: [] }); // 选择集团后回显的数据
  const [mreNumber, setMreNumber] = useState({}); // 店铺回收卡豆数 暂存输入值
  const [groupNumber, setGroupNumber] = useState({}); // 集团回收卡豆数 暂存输入值
  const [mreTotal, setMreTotal] = useState(0); // 店铺、集团回收卡豆数
  const [role, setRole] = useState(false); // 补贴角色
  const [visiblePort, setVisiblePort] = useState(false);
  const [visibleSelect, setVisibleSelect] = useState(false); // 选择用户弹窗
  const [userList, setUserList] = useState({ keys: [], list: [], resultList: [] }); // 选择后回显的数据
  const [userNumber, setUserNumber] = useState({}); // 卡豆数 暂存输入值

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
    setMreTotal(lodash.sumBy(subsidyBeanObjects, 'bean'));
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

  //批量导入事件
  const handleImport = () => setVisiblePort({ show: true, role });

  const formItems = [
    {
      label: '任务名称',
      name: 'taskName',
    },
    {
      label: '角色',
      name: 'role',
      type: 'select',
      select: tab === 'direct' ? SUBSIDY_ACTION_ROLES : SUBSIDY_TASK_ROLE,
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
      type: 'formItem',
      visible: role === 'merchant',
      formItem: (
        <Space size="large">
          <Button type="primary" ghost onClick={() => setVisible(true)}>
            选择单店/子门店
          </Button>
          <Button type="primary" ghost onClick={handleImport}>
            批量导入
          </Button>
        </Space>
      ),
    },
    {
      label: '适用店铺',
      visible: role === 'merchant',
      type: 'noForm',
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
        <Space size="large">
          <Button type="primary" ghost onClick={() => setVisibleGroup(true)}>
            选择集团
          </Button>
          <Button type="primary" ghost onClick={handleImport}>
            批量导入
          </Button>
        </Space>
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
        <Space size="large">
          <Button type="primary" ghost onClick={() => setVisibleSelect(true)}>
            {tab === 'direct' ? '选择哒人' : '选择用户'}
          </Button>
          <Button type="primary" ghost onClick={handleImport}>
            批量导入
          </Button>
        </Space>
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
          params={tab === 'direct' ? { isDaren: 1 } : {}}
          showSelect={visibleSelect}
          onCancelShowSelect={() => setVisibleSelect(false)}
          onOk={(val) => {
            setUserList(val);
            form.setFieldsValue({ userIdList: val });
          }}
          otherColumns={[
            {
              fixed: 'right',
              title: '回收卡豆数',
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
      label: '回收卡豆数',
      name: 'subsidyBeanObjects',
      type: 'formItem',
      formItem: <>{mreTotal}</>,
    },
    {
      label: '回收凭证',
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
      <GroupSelectModal
        keys={groupList.keys}
        visible={visibleGroup}
        groupList={groupList.list}
        onOk={(val) => setGroupList(val)}
        onCancel={() => setVisibleGroup(false)}
      ></GroupSelectModal>
      <ImportDataModal
        visible={visiblePort}
        onClose={() => setVisiblePort(false)}
        setMreList={(list) => {
          setMreList({ ...list });
          const merNumbers = {};
          list.list.map((item) => (merNumbers[item.userMerchantIdString] = item.subsidyBean));
          setMreNumber(merNumbers);
        }}
        setUserList={(list) => {
          setUserList({ ...list });
          const numbers = {};
          list.list.map((item) => (numbers[item.userIdString] = item.subsidyBean));
          setUserNumber(numbers);
        }}
        setGroupList={(list) => {
          setGroupList({ ...list });
          const groupNumbers = {};
          list.list.map((item) => (groupNumbers[item.merchantGroupIdString] = item.subsidyBean));
          setGroupNumber(groupNumbers);
        }}
      ></ImportDataModal>
    </>
  );
};

export default SubsidyRecycleBean;
