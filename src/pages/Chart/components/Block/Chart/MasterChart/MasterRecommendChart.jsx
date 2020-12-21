import React from 'react';
import { connect } from 'umi';
import { Column } from '@/components/Charts';
import { Typography, Empty } from 'antd';

/**
 * 圈层推荐情况
 */
const MasterRecommendChart = ({ totalData }) => {
  return (
    <>
      <Typography.Title level={5}>圈层推荐情况</Typography.Title>
      {totalData.length ? (
        <Column
          data={totalData}
          height={356}
          meta={{ type: { alias: '类型' }, count: { alias: '数量' } }}
          xyField={{ xField: 'type', yField: 'count' }}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  );
};

export default connect(({ chartBlock }) => ({
  totalData: chartBlock.masterBarData,
}))(MasterRecommendChart);
