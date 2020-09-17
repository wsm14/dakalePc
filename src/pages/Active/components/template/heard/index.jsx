import React, { useContext } from 'react';
import { Button, Space, Row, Col } from 'antd';

const ActiveTemplateHrard = (props) => {
  const { onClose, context } = props;
  const { moduleData } = useContext(context);

  // 提交模版数据
  const handleSaveModuleData = () => {
    console.log(moduleData);
  };
  
  return (
    <>
      <Row align="middle">
        <Col flex="auto">使用模版</Col>
        <Col>
          <Space>
            <Button onClick={onClose}>关闭</Button>
            <Button type="primary" onClick={handleSaveModuleData}>
              保存
            </Button>
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default ActiveTemplateHrard;
