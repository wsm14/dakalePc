import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Card, Row } from 'antd';
import AreaQueryLeft from './components/AreaQuery/Left';
import AreaQueryRight from './components/AreaQuery/Right';
import ManageCitySet from './components/AreaQuery/ManageCitySet';
import ExtraButton from '@/components/ExtraButton';
import CITYJSON from '@/common/cityJson';

const AreaQuery = (props) => {
  const { loading, manageCity, dispatch } = props;

  const childRef = useRef();
  const [selectCode, setSelectCode] = useState({ provinceCode: '33' });
  const [visibleSet, setVisibleSet] = useState(false);

  const cardBtnList = [
    {
      text: '配置',
      auth: 'save',
      onClick: () => {},
    },
    {
      type: 'excel',
      auth: 'save',
      onClick: () => {},
    },
  ];

  return (
    <Card bordered={false} bodyStyle={{ display: 'flex' }}>
      <AreaQueryLeft
        cRef={childRef}
        selectCode={selectCode}
        setSelectCode={setSelectCode}
      ></AreaQueryLeft>
      <div style={{ flex: 1 }}>
        <div
          style={{
            paddingBottom: 16,
            marginBottom: 16,
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'right',
          }}
        >
          <ExtraButton list={cardBtnList}></ExtraButton>
        </div>
        <Row gutter={[16, 16]}>
          {CITYJSON.filter(
            (i) => i.pid === (selectCode.cityCode ? selectCode.cityCode : selectCode.provinceCode),
          ).map((i) => (
            <AreaQueryRight key={i.id} item={i}></AreaQueryRight>
          ))}
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
