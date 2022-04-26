import React, { useState, useRef } from 'react';
import { connect } from 'umi';
import { Card } from 'antd';
import ExtraButton from '@/components/ExtraButton';
import { groupGoods } from '@/components/VideoSelectBindContent/CouponFreeDom';
import GroupGoodModal from './GroupGoods/GroupGoodModal';
import TableDataBlock from '@/components/TableDataBlock';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import WeightSet from './GroupGoods/WeightSet';
import { GROUP_RULE } from '@/common/constant';

const GroupGoodsConfig = (props) => {
  const { groupGoods, dispatch, loading } = props;
  const [visible, setVisible] = useState(false);

  const childRef = useRef();

  // 编辑权重
  const fetchNewShareNoAudit = (values, back) => {
    dispatch({
      type: 'groupGoods/fetchUpdateSort',
      payload: values,
      callback: () => {
        back();
        childRef.current.fetchGetData();
      },
    });
  };

  const getColumns = [
    {
      title: '商品名称',
      fixed: 'left',
      dataIndex: 'goodsImg',
      width: 350,
      render: (val, row) => {
        const { togetherEarnGoodsObject = {} } = row;

        return (
          <div style={{ display: 'flex' }}>
            <PopImgShow url={togetherEarnGoodsObject.goodsImg} />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                marginLeft: 5,
              }}
            >
              <div style={{ display: 'flex' }}>
                <Ellipsis length={10} tooltip>
                  {togetherEarnGoodsObject.goodsName}
                </Ellipsis>
              </div>
              <div style={{ display: 'flex', marginTop: 5, color: '#999' }}>
                商品ID： {togetherEarnGoodsObject.goodsIdString}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: '商品价格',
      dataIndex: 'togetherPrice',
      align: 'center',
      render: (val, row) => {
        const { togetherEarnGoodsObject = {} } = row;
        return `￥${togetherEarnGoodsObject.togetherPrice}`;
      },
    },
    {
      title: '库存',
      dataIndex: 'remain',
      align: 'center',
      render: (val, row) => {
        const { togetherEarnGoodsObject = {} } = row;
        return togetherEarnGoodsObject.remain;
      },
    },
    {
      title: '权重',
      align: 'center',
      dataIndex: 'sort',
      render: (val, row) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WeightSet detail={row} onSubmit={fetchNewShareNoAudit}></WeightSet>
        </div>
      ),
    },
    {
      title: '成团人数',
      align: 'center',
      dataIndex: 'togetherGroupRuleObject',
      render: (val,row) =>{
        const {togetherGroupRuleObject={}}=row
        return GROUP_RULE[togetherGroupRuleObject.totalUserNum]
    
      } 
    },
    {
      title: '状态',
      align: 'center',
      dataIndex: 'status',
      render: (val) => ['下架', '上架'][val],
    },

    {
      type: 'handle',
      dataIndex: 'togetherGroupConfigId',
      width: 150,
      render: (val, record, index) => {
        return [
          {
            type: 'groupGoodsConfigDel',
            title: '删除',
            pop: true,
            click: () => handleDel(val),
          },
        ];
      },
    },
  ];

  const handleDel = (togetherGroupConfigId) => {
    dispatch({
      type: 'groupGoods/fetchDeleteConfigGoods',
      payload: {
        togetherGroupConfigId,
      },
      callback: () => childRef.current.fetchGetData(),
    });
  };

  const btnExtra = [
    {
      text: '新增',
      auth: 'groupGoodsConfigAdd',
      onClick: () => setVisible({ show: true }),
    },
  ];

  return (
    <>
      <Card title="拼团商品配置" extra={<ExtraButton list={btnExtra}></ExtraButton>}>
        <TableDataBlock
          cRef={childRef}
          noCard={false}
          columns={getColumns}
          loading={loading}
          rowKey={(record) => `${record.togetherGroupConfigId}`}
          dispatchType="groupGoods/fetchGetList"
          {...groupGoods}
        ></TableDataBlock>
        <GroupGoodModal
          childRef={childRef}
          visible={visible}
          onClose={() => setVisible(false)}
        ></GroupGoodModal>
      </Card>
    </>
  );
};
export default connect(({ loading, groupGoods }) => ({
  loading: loading.models.groupGoods,
  groupGoods,
}))(GroupGoodsConfig);
