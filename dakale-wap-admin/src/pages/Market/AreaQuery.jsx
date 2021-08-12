import React, { useRef, useState } from 'react';
import { connect } from 'umi';
import { Row } from 'antd';
import AreaQueryLeft from './components/AreaQuery/Left';
import AreaQueryRight from './components/AreaQuery/Right';
import AreaSignEdit from './components/AreaQuery/AreaSignEdit';
import CITYJSON from '@/common/cityJson';

const AreaQuery = (props) => {
  const { loading, dispatch } = props;

  const childRef = useRef();
  const [selectCode, setSelectCode] = useState({ provinceCode: '33' });
  const [visibleSign, setVisibleSign] = useState(false); // 定金 / 签约 设置

  return (
    <div style={{ overflowY: 'hidden', display: 'flex' }}>
      <AreaQueryLeft
        cRef={childRef}
        selectCode={selectCode}
        setSelectCode={setSelectCode}
      ></AreaQueryLeft>
      <div style={{ flex: 1, height: `calc(100vh - 48px)`, overflowY: 'auto', padding: 8 }}>
        <Row gutter={[8, 8]}>
          {CITYJSON.filter(
            (i) => i.pid === (selectCode.cityCode ? selectCode.cityCode : selectCode.provinceCode),
          ).map((i) => (
            <AreaQueryRight
              key={i.id}
              item={i}
              onClick={(detail) => setVisibleSign({ show: true, detail })}
            ></AreaQueryRight>
          ))}
        </Row>
      </div>
      {/* 签约/定金 设置 */}
      <AreaSignEdit
        selectCode={selectCode}
        visible={visibleSign}
        onClose={() => setVisibleSign(false)}
      ></AreaSignEdit>
    </div>
  );
};

export default connect(({ loading }) => ({
  loading,
}))(AreaQuery);
