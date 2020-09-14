import React from 'react';
import { Button, Space, Row, Col } from 'antd';

const ActiveTemplateHrard = (props) => {
  const { onClose } = props;

  return (
    <>
      <Row align="middle">
        <Col flex="auto">使用模版</Col>
        <Col>
          <Space>
            <Button onClick={onClose}>关闭</Button>
            <Button type="primary">保存</Button>
          </Space>
        </Col>
      </Row>
    </>
  );
};

export default ActiveTemplateHrard;
