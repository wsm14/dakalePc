import React, { useEffect, useContext } from 'react';
import { connect } from 'umi';
import { Pie } from '@/components/Charts';
import { ChartVideoContext } from '../../chartStore';
import { Typography, Row, Col, Empty, Radio } from 'antd';

/**
 * 圈层情况
 */
const MasterChart = ({ styles, PGCData, UGCData, dispatch }) => {
  const { searchData, setSearchData } = useContext(ChartVideoContext);
  const dountProps = {
    innerRadius: 0.66,
    angleField: 'count',
    colorField: 'type',
    legend: {
      position: 'bottom',
    },
  };

  useEffect(() => {
    dispatch({
      type: 'videoBoard/fetchMomentKanBan',
      payload: searchData,
    });
  }, [searchData]);

  const onChange = (e) => {
    setSearchData({ ...searchData, status: e.target.value });
  };
  return (
    <>
      <div style={{ color: '#ccc' }}>该区域统计内容为当前时间下的数据，与时间筛选无关</div>
      <Radio.Group onChange={onChange} defaultValue="1">
        <Radio.Button value="1">上架中视频数</Radio.Button>
        <Radio.Button value="">视频库总数</Radio.Button>
      </Radio.Group>
      <Row align="middle">
        <Col span={12}>
          {PGCData.length ? (
            <div style={styles}>
              <Pie data={PGCData} title="PGC视频" {...dountProps} />
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Col>
        <Col span={12}>
          {UGCData.length ? (
            <div style={styles}>
              <Pie data={UGCData} title="UGC视频" {...dountProps} />
            </div>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Col>
      </Row>
    </>
  );
};

export default connect(({ videoBoard }) => ({
  PGCData: videoBoard.PGCData,
  UGCData: videoBoard.UGCData,
}))(MasterChart);
