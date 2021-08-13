import React from 'react';
import { Col, Card, Tag } from 'antd';
import { BankOutlined, TeamOutlined } from '@ant-design/icons';

const AreaQueryRight = ({ item, onClick }) => {
  const { name, id, level } = item;
  return (
    <Col span={4}>
      <Card
        title={name}
        headStyle={{ padding: '0 16px' }}
        bodyStyle={{ padding: 0 }}
        onClick={() => onClick({ name, id, level })}
        extra={<Tag color="green">已签</Tag>}
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
