import React, { useRef, useState, useEffect } from 'react';
import { Card, Result } from 'antd';
import { authCheck } from '@/layouts/AuthConsumer';
import ExtraButton from '@/components/ExtraButton';
import TaskList from './components/Subsidys/List/TaskList';
import ActionList from './components/Subsidys/List/ActionList';
import SubsidyDrawer from './components/Subsidys/SubsidyDrawer';
import SubsidyActionBatchEdit from './components/Subsidys/Form/SubsidyActionBatchEdit';

const tabList = [
  {
    key: 'task',
    auth: 'task',
    tab: '营销卡豆',
  },
  {
    key: 'direct',
    auth: 'direct',
    tab: '直充卡豆',
  },
  {
    key: 'action',
    auth: 'action',
    tab: '使用规则',
  },
];

const SubsidyManage = () => {
  const check = authCheck(tabList); // 检查权限

  const childRef = useRef(); // 表格ref
  const [tabkey, setTabKey] = useState(false); // tab分类
  const [visible, setVisible] = useState(false); // 设置 修改 详情
  const [visibleActionEdit, setVisibleActionEdit] = useState(false); // 规则批量修改
  const [actionIdList, setActionIdList] = useState([]); // 已选的使用规则id

  // 检查权限获取key默认显示tab
  useEffect(() => {
    setTabKey(check && check.length ? check[0]['key'] : false);
  }, []);

  // 表格公共props
  const tableProp = { childRef, setVisible };

  const contentList = {
    task: <TaskList {...tableProp} tabkey="task" type="platform"></TaskList>, // 营销卡豆
    direct: <TaskList {...tableProp} tabkey="direct" type="directCharge"></TaskList>, // 直充卡豆
    action: <ActionList {...tableProp} setActionIdList={setActionIdList}></ActionList>, // 使用规则
  };

  const btnList = [
    {
      text: '回收',
      auth: 'recycleBean',
      show: tabkey !== 'action',
      onClick: () =>
        setVisible({
          type: 'batch',
          tab: tabkey,
          show: true,
          detail: {
            // role: 'merchant',
          },
        }),
    },
    {
      text: '批量修改',
      auth: 'batchEdit',
      show: tabkey === 'action',
      disabled: !actionIdList.length,
      onClick: () => setVisibleActionEdit(true),
    },
    {
      text: tabkey === 'action' ? '新增' : '充值',
      auth: `${tabkey}Save`,
      onClick: () => setVisible({ type: 'add', tab: tabkey, show: true }),
    },
  ];

  return (
    <>
      <Card
        tabList={check}
        onTabChange={(key) => {
          const checkGet = ['task', 'direct'];
          checkGet.includes(key) &&
            checkGet.includes(tabkey) &&
            childRef.current.fetchGetData({
              type: { task: 'platform', direct: 'directCharge' }[key],
            });
          setTabKey(key);
        }}
        tabBarExtraContent={<ExtraButton list={btnList}></ExtraButton>}
      >
        {check && check.length ? (
          contentList[tabkey]
        ) : (
          <Result status="403" title="403" subTitle="暂无权限"></Result>
        )}
      </Card>
      {/* 详情 新增 规则编辑 */}
      <SubsidyDrawer
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></SubsidyDrawer>
      {/* 规则批量修改 */}
      <SubsidyActionBatchEdit
        cRef={childRef}
        actionIdList={actionIdList}
        visible={visibleActionEdit}
        onClose={() => setVisibleActionEdit(false)}
      ></SubsidyActionBatchEdit>
    </>
  );
};

export default SubsidyManage;
