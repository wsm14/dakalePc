import React from 'react';
import { Col, Tag } from 'antd';
import { Card } from 'antd-mobile';
import { BankOutlined, TeamOutlined } from '@ant-design/icons';

const AreaQueryRight = ({ item, onClick }) => {
  const { name, id, level } = item;
  return (
    <Col span={12}>
      <Card onClick={() => onClick({ name, id, level })}>
        <Card.Header title={<div style={{ fontSize: 14 }}>{name}</div>} />
        <Card.Body>
          <div style={{ textAlign: 'right' }}>
            <Tag color="green" style={{ marginRight: 0 }}>
              已签 {level !== '3' ? '3/10' : ''}
            </Tag>
          </div>
          <div style={{ textAlign: 'right', marginBottom: 5 }}>
            <Tag color="gold" style={{ marginRight: 0 }}>
              定金 {level !== '3' ? '3/10' : ''}
            </Tag>
          </div>
          <div
            style={{
              textAlign: 'right',
              fontSize: 14,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <div>
              <div>
                <BankOutlined style={{ fontSize: 16 }} />
              </div>
              <div>
                <TeamOutlined style={{ fontSize: 16 }} />
              </div>
            </div>
            <div style={{ marginLeft: 10 }}>
              <div>200000</div>
              <div>200</div>
            </div>
          </div>
        </Card.Body>
        <Card.Footer
          content={
            <div
              style={{
                textAlign: 'center',
                fontSize: 14,
                backgroundColor: '#fffbe6',
                color: '#d48806',
              }}
            >
              80万
            </div>
          }
        />
      </Card>
    </Col>
  );
};

export default AreaQueryRight;
