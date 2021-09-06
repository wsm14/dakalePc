import React, { useState, useEffect } from 'react';
import lodash from 'lodash';
import { DownSquareOutlined } from '@ant-design/icons';
import { Button, InputNumber, Tooltip } from 'antd';
import { SUBSIDY_TASK_ROLE } from '@/common/constant';
import {
  MreSelect,
  MreSelectShow,
  GroupSelectModal,
  GroupSelectShow,
} from '@/components/MerUserSelectTable';
import FormCondition from '@/components/FormCondition';

const SubsidyRecycleBean = (props) => {
  const { form, detail } = props;

  const [visible, setVisible] = useState(false); // 选择店铺弹窗
  const [visibleGroup, setVisibleGroup] = useState(false); // 选择店铺弹窗
  const [mreList, setMreList] = useState({ keys: [], list: [] }); // 选择店铺后回显的数据
  const [groupList, setGroupList] = useState({ keys: [], list: [] }); // 选择集团后回显的数据
  const [mreNumber, setMreNumber] = useState({}); // 店铺回收卡豆数 暂存输入值
  const [groupNumber, setGroupNumber] = useState({}); // 集团回收卡豆数 暂存输入值
  const [mreTotal, setMreTotal] = useState(0); // 店铺、集团回收卡豆数
  const [role, setRole] = useState(false); // 补贴角色

  // 设置form表单值 店铺id

  useEffect(() => {
    const number = role === 'merchant' ? mreNumber : groupNumber;
    const newData = lodash.pickBy(number, (value, key) =>
      role === 'merchant' ? mreList.keys.includes(key) : groupList.keys.includes(key),
    );
    const subsidyBeanObjects = Object.keys(newData).map((item) => ({
      ownerId: item,
      bean: newData[item] || 0,
    }));
    setMreTotal(lodash.sumBy(subsidyBeanObjects, 'bean'));
    form.setFieldsValue({ subsidyBeanObjects });
  }, [mreList, mreNumber, groupList, groupNumber]);

  // 向下填充
  const downBean = (bean) => {
    if (!bean) return;
    const obj = {};
    const list = { merchant: mreList, group: groupList }[role];
    list.keys.map((item) => (obj[item] = bean));
    switch (role) {
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
      label: '角色',
      name: 'role',
      type: 'select',
      select: SUBSIDY_TASK_ROLE,
      onChange: (val) => {
        setRole(val);
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
        <Button type="primary" ghost onClick={() => setVisible(true)}>
          选择店铺
        </Button>
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
    </>
  );
};

export default SubsidyRecycleBean;
