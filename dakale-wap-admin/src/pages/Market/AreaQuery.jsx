import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'umi';
import { Row, Spin } from 'antd';
import { authCheck } from '@/layouts/AuthConsumer';
import AreaQueryLeft from './components/AreaQuery/Left';
import AreaQueryRight from './components/AreaQuery/Right';
import AreaSignEdit from './components/AreaQuery/AreaSignEdit';

const AreaQuery = (props) => {
  const { loading, list, dispatch } = props;

  const childRef = useRef();
  const [selectCode, setSelectCode] = useState({ provinceCode: '33' });
  const [visibleSign, setVisibleSign] = useState(false); // 定金 / 签约 设置

  const editType = authCheck(['edit']);

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

  return (
    <div style={{ overflowY: 'hidden', display: 'flex' }}>
      <AreaQueryLeft
        cRef={childRef}
        selectCode={selectCode}
        fetchGetInfo={fetchAreaQueryInfo}
        setSelectCode={setSelectCode}
      ></AreaQueryLeft>
      <div style={{ flex: 1, height: `calc(100vh - 48px)`, overflowY: 'auto', padding: 8 }}>
        <Spin spinning={loading}>
          <Row gutter={[8, 8]}>
            {list.map((i) => (
              <AreaQueryRight
                key={i.id}
                item={i}
                onClick={(detail) =>
                  editType.includes('edit') && setVisibleSign({ show: true, detail })
                }
              ></AreaQueryRight>
            ))}
          </Row>
        </Spin>
      </div>
      {/* 签约/定金 设置 */}
      <AreaSignEdit
        selectCode={selectCode}
        visible={visibleSign}
        callBack={() => fetchAreaQueryInfo({ pid: selectCode.cityCode || selectCode.provinceCode })}
        onClose={() => setVisibleSign(false)}
      ></AreaSignEdit>
    </div>
  );
};

export default connect(({ areaQuery, loading }) => ({
  list: areaQuery.list,
  loading: loading.effects['areaQuery/fetchAreaQueryInfo'],
}))(AreaQuery);
