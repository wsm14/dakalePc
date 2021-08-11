import React from 'react';
import { Col, Card, Tag } from 'antd';
import { BankOutlined, TeamOutlined } from '@ant-design/icons';

const AreaQueryRight = ({ item }) => {
  const { name } = item;
  return (
    <Col span={6}>
      <Card
        title={name}
        headStyle={{ padding: '0 16px' }}
        bodyStyle={{ padding: 0 }}
        extra={
          <>
            <Tag color="green">已签 3/10</Tag>
            <Tag color="gold">定金 3/10</Tag>
          </>
        }
      >
        <div
          style={{
            textAlign: 'right',
            fontSize: 16,
            display: 'flex',
            justifyContent: 'flex-end',
            padding: 16,
          }}
        >
          <div>
            <div>
              <BankOutlined style={{ fontSize: 20 }} />
            </div>
            <div>
              <TeamOutlined style={{ fontSize: 20 }} />
            </div>
          </div>
          <div style={{ marginLeft: 10 }}>
            <div>200000</div>
            <div>200</div>
          </div>
        </div>
        <div
          style={{
            textAlign: 'center',
            fontSize: 16,
            backgroundColor: '#fffbe6',
            color: '#d48806',
            padding: 16,
          }}
        >
          80万
        </div>
      </Card>
    </Col>
  );
};

export default AreaQueryRight;
