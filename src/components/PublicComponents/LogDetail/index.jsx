import React from 'react';
import { connect } from 'umi';
import { Timeline } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';

const LogDetail = (props) => {
  const { logDetail, dispatch } = props;
  const { show = false, data = [] } = logDetail;

  const onClose = () => {
    dispatch({
      type: 'baseData/closeLog',
    });
  };

  const modalProps = {
    title: `操作日志`,
    visible: show,
    onClose,
  };

  return (
    <DrawerCondition {...modalProps}>
      <Timeline>
        {data.map((item) => (
          <Timeline.Item key={item.logRecordId}>
            <p style={{ margin: 0, fontWeight: 500 }}>{item.createTime}</p>
            <p style={{ margin: 0 }}>{item.content}</p>
            <p style={{ margin: 0, color: '#999999' }}> 操作人：{item.operator}</p>
          </Timeline.Item>
        ))}
      </Timeline>
    </DrawerCondition>
  );
};
export default connect(({ baseData }) => ({
  logDetail: baseData.logDetail,
}))(LogDetail);
