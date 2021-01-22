import React, { useRef, useState, useEffect } from 'react';
import { Card, Result, Button, Space } from 'antd';
import AuthConsumer, { authCheck } from '@/layouts/AuthConsumer';
import TaskList from './components/Subsidys/List/TaskList';
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
  const check = authCheck(tabList);

  const childRef = useRef();
  // tab分类
  const [tabkey, setTabKey] = useState(false);
  // 设置 修改 详情
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTabKey(check ? check[0]['key'] : false);
  }, []);

  const contentList = {
    task: (
      <AuthConsumer
        auth="task"
        noAuth={<Result status="403" title="403" subTitle="暂无权限"></Result>}
      >
        <TaskList childRef={childRef} setVisible={setVisible}></TaskList>
      </AuthConsumer>
    ),
    action: (
      <AuthConsumer
        auth="action"
        noAuth={<Result status="403" title="403" subTitle="暂无权限"></Result>}
      >
        <TaskList childRef={childRef}></TaskList>
      </AuthConsumer>
    ),
  };

  return (
    <>
      <Card
        tabList={check}
        onTabChange={(key) => setTabKey(key)}
        tabBarExtraContent={
          <Space>
            <AuthConsumer auth="taskSave">
              <Button
                className="dkl_green_btn"
                onClick={() => setVisible({ type: 'add', show: true })}
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
