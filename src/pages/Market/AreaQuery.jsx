import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Card, Row, Spin } from 'antd';
import AreaQueryLeft from './components/AreaQuery/Left';
import AreaQueryRight from './components/AreaQuery/Right';
import AreaSet from './components/AreaQuery/AreaSet';
import AreaSignEdit from './components/AreaQuery/AreaSignEdit';
import ExtraButton from '@/components/ExtraButton';

const AreaQuery = (props) => {
  const { loading, list, dispatch } = props;

  const childRef = useRef();
  const [selectCode, setSelectCode] = useState({ provinceCode: '33' });
  const [visibleSet, setVisibleSet] = useState(false); // 区域设置
  const [visibleSign, setVisibleSign] = useState(false); // 定金 / 签约 设置

  useEffect(() => {
    fetchAreaQueryInfo({ pid: 33 });
  }, []);

  // 获取详情
  const fetchAreaQueryInfo = (payload) => {
    dispatch({
      type: 'areaQuery/fetchAreaQueryInfo',
      payload,
    });
  };

  const cardBtnList = [
    {
      text: '配置',
      auth: 'save',
      onClick: () => setVisibleSet(true),
    },
  ];

  return (
    <Card bordered={false} bodyStyle={{ display: 'flex' }}>
      <AreaQueryLeft
        cRef={childRef}
        selectCode={selectCode}
        fetchGetInfo={fetchAreaQueryInfo}
        setSelectCode={setSelectCode}
      ></AreaQueryLeft>
      <div style={{ flex: 1 }}>
        <Spin spinning={loading}>
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
            {list.map((i) => (
              <AreaQueryRight
                key={i.id}
                item={i}
                onClick={(detail) => setVisibleSign({ show: true, detail })}
              ></AreaQueryRight>
            ))}
          </Row>
        </Spin>
      </div>
      {/* 区域设置 */}
      <AreaSet
        childRef={childRef}
        visible={visibleSet}
        onClose={() => setVisibleSet(false)}
      ></AreaSet>
      {/* 签约/定金 设置 */}
      <AreaSignEdit
        selectCode={selectCode}
        visible={visibleSign}
        callBack={() => fetchAreaQueryInfo({ pid: selectCode.cityCode || selectCode.provinceCode })}
        onClose={() => setVisibleSign(false)}
      ></AreaSignEdit>
    </Card>
  );
};

export default connect(({ areaQuery, loading }) => ({
  list: areaQuery.list,
  loading: loading.effects['areaQuery/fetchAreaQueryInfo'],
}))(AreaQuery);
