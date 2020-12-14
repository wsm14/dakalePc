import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const LevelTable = (props) => {
  const { list, keyRow, loading, setSelectData, fetchExpertLevelSet } = props;

  const dataDetail = (name, value) => {
    switch (name) {
      case 'videoFirst':
        return (
          <span>
            视频优先基数 <b>{value}</b>
          </span>
        );
      case 'priceDifference':
        return (
          <span>
            参与平台带货，可获商品差价部分的 <b>{value}</b> %收益
          </span>
        );
      case 'platformBeanReward':
        return (
          <span>
            平台卡豆奖励 <b>{value}</b>
          </span>
        );
      case 'exclusiveCoupon':
        return (
          <span>
            升级礼包·优惠券价值 <b>{value.startMoney}</b>~<b>{value.endMoney}</b> 元 /
            <b>{value.startCount}</b>~<b>{value.endCount}</b>张
          </span>
        );
      default:
        return '--';
    }
  };

  // table 表头
  const getColumns = [
    {
      title: '序号',
      dataIndex: 'icon',
      render: (val, row, i) => i + 1,
    },
    {
      title: `等级${keyRow == 'rights' ? '权益' : '任务'}`,
      dataIndex: 'title',
    },
    {
      title: `详情`,
      dataIndex: 'value',
      render: (val, row, i) => dataDetail(row.name, val),
    },
    {
      title: '操作',
      align: 'right',
      dataIndex: 'name',
      render: (val, row, i) => {
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                visible: row.value,
                click: () => setSelectData({ show: true }),
              },
              {
                type: 'del',
                click: () => {
                  const newList = list.filter((item, index) => index != i);
                  fetchExpertLevelSet(newList);
                },
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <DataTableBlock
      btnExtra={
        <Button className="dkl_green_btn" onClick={() => setSelectData({ show: true })}>
          添加
        </Button>
      }
      CardNone={false}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.title}`}
      list={list}
      pagination={false}
    ></DataTableBlock>
  );
};

export default connect(({ loading }) => ({ loading: loading.models.expertLevel }))(LevelTable);
