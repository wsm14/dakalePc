import React from 'react';
import { connect } from 'umi';
import { Column } from '@/components/Charts';
import { Typography, Empty } from 'antd';

/**
 * 圈层推荐情况
 */
const MasterRecommendChart = ({ totalData, styles }) => {
  return (
    <>
      <Typography.Title level={5}>圈层推荐情况</Typography.Title>
      {totalData.length ? (
        <div style={styles}>
          <Column
            data={totalData}
            meta={{ type: { alias: '类型' }, count: { alias: '数量' } }}
            xyField={{ xField: 'type', yField: 'count' }}
          />
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  );
};

export default connect(({ chartBlock }) => ({
  totalData: chartBlock.masterBarData,
}))(MasterRecommendChart);
