import React from 'react';
import { Col, Tag } from 'antd';
import { Card } from 'antd-mobile';
import { BankOutlined, TeamOutlined } from '@ant-design/icons';

const AreaQueryRight = ({ item, onClick }) => {
  const { name, id, gdp, price, population, status } = item;
  return (
    <Col span={12}>
      <Card onClick={() => onClick({ name, id, status })}>
        <Card.Header
          title={<div style={{ fontSize: 12 }}>{name}</div>}
          extra={
            status === '2' && (
              <Tag color="green" style={{ marginRight: 0, fontSize: 12 }}>
                已签
              </Tag>
            )
          }
        />
        <Card.Body>
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
              <div>{gdp || 0}</div>
              <div>{population || 0}</div>
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
              {price || 0}
            </div>
          }
        />
      </Card>
    </Col>
  );
};

export default AreaQueryRight;
