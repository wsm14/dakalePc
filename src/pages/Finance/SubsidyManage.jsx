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
    tab: '任务列表',
  },
  {
    key: 'action',
    auth: 'action',
    tab: '行为管理',
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
    setTabKey(check ? check[0]['key'] : false);
  }, []);

  // 表格公共props
  const tableProp = {
    childRef,
    setVisible,
  };

  const contentList = {
    task: <TaskList {...tableProp}></TaskList>,
    action: <ActionList {...tableProp}></ActionList>,
  };

  return (
    <>
      <Card
        tabList={check}
        onTabChange={(key) => setTabKey(key)}
        tabBarExtraContent={
          <Space>
            <AuthConsumer auth={`${tabkey}Save`}>
              <Button
                className="dkl_green_btn"
                onClick={() => setVisible({ type: 'add', tab: tabkey, show: true })}
              >
                新增
              </Button>
            </AuthConsumer>
          </Space>
        }
      >
        {check ? (
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
