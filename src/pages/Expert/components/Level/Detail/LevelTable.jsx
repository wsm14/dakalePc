import React from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import { targetJson } from '@/common/expertLevelJSON';
import HandleSetTable from '@/components/HandleSetTable';
import DataTableBlock from '@/components/DataTableBlock';

const LevelTable = (props) => {
  const { list, keyRow, loading, setSelectData, setEditData, fetchExpertLevelSet } = props;

  // 权益详情字典
  const rightsDataDetail = (name, value) => {
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
            升级礼包·优惠券价值 <b>{value.startMoney}</b>~<b>{value.endMoney}</b> 元 /{' '}
            <b>{value.startCount}</b>~<b>{value.endCount}</b>张
          </span>
        );
      default:
        return '--';
    }
  };

  // 任务详情字典
  const targetDataDetail = (name, value) => {
    switch (name) {
      case 'attention':
        return (
          <span>
            关注数大于等于 <b>{value}</b>
          </span>
        );
      case 'momentPic':
        return (
          <span>
            发布 <b>{value}</b> 篇图文分享
          </span>
        );
      case 'momentVideo':
        return (
          <span>
            发布 <b>{value}</b> 篇视频分享
          </span>
        );
      case 'momentLike':
        return (
          <span>
            完成 <b>{value}</b> 次分享内容点赞
          </span>
        );
      case 'momentCollect':
        return (
          <span>
            完成 <b>{value}</b> 篇分享内容收藏
          </span>
        );
      case 'domainActivity':
        return (
          <span>
            累计参与专题活动创作 <b>{value}</b> 次
          </span>
        );
      case 'family':
        return (
          <span>
            累计拥有 <b>{value}</b> 个家人
          </span>
        );
      case 'order':
        return (
          <span>
            带货成交量不低于 <b>{value}</b> 单
          </span>
        );
      case 'domainActivity':
        return (
          <span>
            累计参与专题活动创作 <b>{value}</b> 次
          </span>
        );
      case 'merchant':
        return (
          <span>
            累计拥有 <b>{value}</b> 家家店
          </span>
        );
      case 'fan':
        return (
          <span>
            豆粉数不低于 <b>{value}</b> 人
          </span>
        );
      case 'mark':
        return (
          <span>
            完成 <b>{value}</b> 次到店打卡
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
      render: (val, row) => {
        return keyRow == 'rights' ? val : targetJson.filter((i) => i.name == row.name)[0].title;
      },
    },
    {
      title: `详情`,
      dataIndex: 'value',
      render: (val, row, i) =>
        keyRow == 'rights' ? rightsDataDetail(row.name, val) : targetDataDetail(row.name, val),
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
                auth: true,
                visible: row.value,
                auth: true,
                click: () => {
                  const titleName =
                    keyRow == 'rights'
                      ? row.title
                      : targetJson.filter((i) => i.name == row.name)[0].title;
                  setEditData({ show: true, detail: { ...row, titleName } });
                },
              },
              {
                type: 'del',
                auth: true,
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
      noCard={false}
      loading={loading}
      columns={getColumns}
      rowKey={(record) => `${record.name}`}
      list={list}
      pagination={false}
    ></DataTableBlock>
  );
};

export default connect(({ loading }) => ({ loading: loading.models.expertLevel }))(LevelTable);
