import React, { useEffect, useContext } from 'react';
import { Button, Space, Row, Col, Modal } from 'antd';
import update from 'immutability-helper';

/**
 * 顶部显示区域
 */
const SideMenu = (props) => {
  const { onClose, context, dispatch, loading } = props;

  const { dispatchData, moduleData, info = {} } = useContext(context);

  const { configWanderAroundModuleId, activityName } = info;

  // active 创建
  const fetchSaveModuleData = () => {
    const newData = moduleData.dataList
      .filter((item) => item.moduleName) // 空数据不进入
      .map((item) => {
        // 应季主打+二宫格拆分为两个类型
        if (item.moduleName == 'seasonalKeyAndBicuspidLattice') {
          return [
            {
              ...item,
              moduleName: 'seasonalKey',
            },
            {
              ...item,
              moduleName: 'bicuspidLattice',
            },
          ];
        } else {
          return item;
        }
      })
      .flat(Infinity); // 多维数组化一维

    dispatch({
      type: 'walkingManage/fetchUpdateWanderAroundModule',
      payload: {
        configWanderAroundModuleId,
        flag: 'updateModule',
        wanderAroundModuleObjects: newData,
      },
      callback: () => {
        onClose();
      },
    });
  };

  useEffect(() => {
    return () => {
      dispatchData({ type: 'initialize' });
    };
  }, []);

  return (
    <Row align="middle">
      <Col flex="auto">{activityName || '编辑页面模版'}</Col>
      <Col>
        <Space>
          <Button
            onClick={() => {
              Modal.confirm({
                title: '已编辑数据不会保存，确认关闭？',
                onOk() {
                  onClose();
                },
                onCancel() {},
              });
            }}
          >
            关闭
          </Button>
          <Button type="primary" loading={loading} onClick={() => fetchSaveModuleData('active')}>
            保存
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default SideMenu;
