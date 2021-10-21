import React, { useEffect, useContext } from 'react';
import { Button, Space, Row, Col, Modal, message } from 'antd';

/**
 * 顶部显示区域
 */
const SideMenu = (props) => {
  const { onClose, context, dispatch, loading } = props;

  const { dispatchData, moduleData, info = {} } = useContext(context);

  const { handle = 'add', activityTemplateId } = info;

  // active 创建
  const fetchSaveModuleData = () => {
    const newData = moduleData.dataList.filter((item) => item.data); // 空数据不进入
    dispatch({
      type: {
        add: 'activeTemplate/fetchActiveAddaa',
        edit: 'activeTemplate/fetchActiveEditdd',
      }[handle],
      payload: {
        activityTemplateId,
        newData,
      },
      callback: () => {
        message.destroy();
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
      <Col flex="auto">编辑页面模版</Col>
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
