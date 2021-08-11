import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { BankOutlined, TeamOutlined } from '@ant-design/icons';
import { Card, Row, Col, Tag } from 'antd';
import AreaQueryLeft from './components/AreaQuery/Left';
import ManageCitySet from './components/AreaQuery/ManageCitySet';
import CITYJSON from '@/common/cityJson';

const AreaQuery = (props) => {
  const { loading, manageCity, dispatch } = props;

  const childRef = useRef();
  const [selectCode, setSelectCode] = useState({ provinceCode: '33' });
  const [visibleSet, setVisibleSet] = useState(false);

  const block = ({ name }) => (
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

  return (
    <Card bordered={false} bodyStyle={{ display: 'flex' }}>
      <AreaQueryLeft
        cRef={childRef}
        selectCode={selectCode}
        setSelectCode={setSelectCode}
      ></AreaQueryLeft>
      <div style={{ flex: 1 }}>
        <Row gutter={[16, 16]}>
          {CITYJSON.filter(
            (i) => i.pid === (selectCode.cityCode ? selectCode.cityCode : selectCode.provinceCode),
          ).map((i) => block(i))}
        </Row>
      </div>
      <ManageCitySet
        visible={visibleSet}
        childRef={childRef}
        onClose={() => setVisibleSet(false)}
      ></ManageCitySet>
    </Card>
  );
};

export default connect(({ manageCity, loading }) => ({
  manageCity,
  loading,
}))(AreaQuery);
