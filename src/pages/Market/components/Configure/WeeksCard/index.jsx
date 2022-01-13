import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import { Card } from 'antd';
import ExtraButton from '@/components/ExtraButton';
import WeeksCardDrawerSet from './components/WeeksCardDrawerSet';

const CityGlobalModal = (props) => {
  const { weeklyCardObj, loading, dispatch } = props;

  const [visibleSet, setVisibleSet] = useState(false);

  useEffect(() => {
    handleInfo();
  }, []);

  const handleInfo = () => {
    dispatch({
      type: 'marketConfigure/fetchGetWeeklyCard',
    });
  };

  const formItems = [
    {
      label: '周卡名称',
      dataIndex: 'name',
    },
    {
      label: '原价',
      dataIndex: 'originalPrice',
      render: (val) => `￥${val}`,
    },
    {
      label: '售价',
      dataIndex: 'price',
      render: (val) => `￥${val}`,
    },
    {
      label: '奖励卡豆数',
      dataIndex: 'firstReceiveBean',
      render: (val, row) => (
        <div>
          <div>{`首次领取${val}卡豆`}</div>
          <div>{`其余天数${row.otherMinBean}卡豆-${row.otherMaxBean}卡豆`}</div>
        </div>
      ),
    },
    {
      label: '续费规则',
      dataIndex: 'day',
      render: (val) => `到期前${val}天可购买下一周周卡。`,
    },
    {
      label: '启用状态',
      dataIndex: 'status',
      render: (val) => (val === '0' ? `已关闭` : '已开启'),
    },
  ];

  //  编辑
  const handleAdd = () => {
    setVisibleSet({
      show: true,
      detail: weeklyCardObj,
    });
  };

  const cardBtnList = [
    {
      text: '编辑',
      auth: 'edit',
      className: '',
      typeBtn: 'link',
      onClick: handleAdd,
    },
  ];

  return (
    <>
      <Card
        title="周卡配置"
        bordered={false}
        headStyle={{ borderBottom: 'none' }}
        loading={loading}
        extra={<ExtraButton list={cardBtnList}></ExtraButton>}
      >
        <DescriptionsCondition
          bordered={false}
          formItems={formItems}
          initialValues={weeklyCardObj}
        ></DescriptionsCondition>
      </Card>
      {/* 编辑 */}
      <WeeksCardDrawerSet
        visible={visibleSet}
        handleInfo={handleInfo}
        onClose={() => setVisibleSet(false)}
      ></WeeksCardDrawerSet>
    </>
  );
};
export default connect(({ loading, marketConfigure }) => ({
  weeklyCardObj: marketConfigure.weeklyCardObj,
  loading: loading.models.marketConfigure,
}))(CityGlobalModal);
