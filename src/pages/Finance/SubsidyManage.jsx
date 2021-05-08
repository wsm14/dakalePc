import React, { useRef, useState, useEffect } from 'react';
import { Card, Result, Button, Space } from 'antd';
import AuthConsumer, { authCheck } from '@/layouts/AuthConsumer';
import TaskList from './components/Subsidys/List/TaskList';
import ActionList from './components/Subsidys/List/ActionList';
import SubsidyDrawer from './components/Subsidys/SubsidyDrawer';

const tabList = [
  {
    key: 'task',
    auth: 'task',
    tab: '营销卡豆充值',
  },
  {
    key: 'direct',
    auth: 'direct',
    tab: '平台直充',
  },
  {
    key: 'action',
    auth: 'action',
    tab: '使用规则',
  },
];

const SubsidyManage = () => {
  // 检查权限
  const check = authCheck(tabList);

  // 表格ref
  const childRef = useRef();

  // tab分类
  const [tabkey, setTabKey] = useState(false);
  // 设置 修改 详情
  const [visible, setVisible] = useState(false);

  // 检查权限获取key默认显示tab
  useEffect(() => {
    setTabKey(check && check.length ? check[0]['key'] : false);
  }, []);

  // 表格公共props
  const tableProp = { childRef, setVisible };

  const contentList = {
    task: <TaskList {...tableProp} tabkey="task" type="platform"></TaskList>, // 营销卡豆充值
    direct: <TaskList {...tableProp} tabkey="direct" type="directCharge"></TaskList>, // 平台直充
    action: <ActionList {...tableProp}></ActionList>, // 使用规则
  };

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
        tabBarExtraContent={
          <Space>
            <AuthConsumer auth={`${tabkey}Save`}>
              <Button
                className="dkl_green_btn"
                onClick={() =>
                  setVisible({
                    type: 'add',
                    tab: tabkey,
                    show: true,
                    detail: { subsidyRole: 'merchant' },
                  })
                }
              >
                新增
              </Button>
            </AuthConsumer>
          </Space>
        }
      >
        {check && check.length ? (
          contentList[tabkey]
        ) : (
          <Result status="403" title="403" subTitle="暂无权限"></Result>
        )}
      </Card>
      <SubsidyDrawer
        childRef={childRef}
        visible={visible}
        onClose={() => setVisible(false)}
      ></SubsidyDrawer>
    </>
  );
};

export default SubsidyManage;
