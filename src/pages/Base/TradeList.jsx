import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Switch, Alert } from 'antd';
import AuthConsumer from '@/layouts/AuthConsumer';
import HandleSetTable from '@/components/HandleSetTable';
import TableDataBlock from '@/components/TableDataBlock';
import TradeCategorySet from './components/Trade/Form/TradeCategorySet';
import PromotionMoneySet from './components/Trade/Form/PromotionMoneySet';
import TradeDetailList from './components/Trade/List/TradeDetailList';
import TradePlatformDetailList from './components/Trade/List/TradePlatformDetailList';
import TradeSceneList from './components/Trade/List/TradeSceneList';

const SysTradeSet = (props) => {
  const { list, loading, dispatch } = props;

  const childRef = useRef();
  const [visible, setVisible] = useState(''); // 平台服务费
  const [baseVisible, setBaseVisible] = useState(''); // 基础设施
  const [moneyVisible, setMoneyVisible] = useState(false); // 推广费设置修改
  const [classVisible, setClassVisible] = useState(false); // 类目设置修改
  const [visibleScene, setVisibleScene] = useState(false); // 场景设置修改

  // 搜索参数
  const searchItems = [
    {
      label: '行业名称',
      name: 'categoryName',
    },
  ];

  // table 表头
  const getColumns = [
    {
      title: '行业类目',
      fixed: 'left',
      align: 'center',
      dataIndex: 'categoryName',
    },
    {
      title: '平台服务费',
      align: 'center',
      dataIndex: 'parentId',
      render: (val, record) => (
        <AuthConsumer auth="edit" show={!val}>
          <a onClick={() => setVisible({ record })}>设置</a>
        </AuthConsumer>
      ),
    },
    {
      title: '推广费',
      align: 'center',
      dataIndex: 'id',
      render: (val, record) => (
        <AuthConsumer auth="edit" show={!record.parentId}>
          <a onClick={() => handlePromotionMoneyGet(record)}>设置</a>
        </AuthConsumer>
      ),
    },
    {
      title: '特色服务',
      align: 'center',
      dataIndex: 'orderCount',
      render: (val, record) => (
        <AuthConsumer auth="edit" show={!record.parentId}>
          <a onClick={() => setBaseVisible({ type: 'special', record })}>设置</a>
        </AuthConsumer>
      ),
    },
    {
      title: '适用场景',
      align: 'center',
      dataIndex: 'id',
      render: (val, record) => (
        <AuthConsumer auth="edit" show={!record.parentId}>
          <a onClick={() => setVisibleScene({ type: 'scene', record })}>设置</a>
        </AuthConsumer>
      ),
    },
    {
      title: '小程序展示',
      align: 'center',
      fixed: 'right',
      dataIndex: 'isWechat',
      render: (val, record) => (
        <AuthConsumer auth="isWechat" noAuth={val === '1' ? '开' : '关'}>
          <Switch
            checkedChildren="开"
            unCheckedChildren="关"
            checked={val === '1'}
            onClick={() =>
              fetchTradeWeChat({ categoryId: record.categoryIdString, isWechat: 1 ^ val })
            }
          />
        </AuthConsumer>
      ),
    },
    {
      title: '操作',
      dataIndex: 'categoryIdString',
      fixed: 'right',
      align: 'right',
      render: (val, record) => {
        return (
          <HandleSetTable
            formItems={[
              {
                type: 'edit',
                click: () => {
                  const { categoryName } = record;
                  const detail = { categoryId: val, categoryName };
                  handleClassSet('edit', detail);
                },
              },
              {
                type: 'del',
                visible: !record.categoryDTOList,
                click: () => fetchTradeSet({ categoryId: val, isDelete: 1 }),
              },
              {
                type: 'tradeSecondAdd',
                visible: record.parentId === 0,
                click: () => {
                  const { categoryName: parentName } = record;
                  const detail = { parentId: val, node: `${val}`, parentName, type: 'second' };
                  handleClassSet('add', detail);
                },
              },
            ]}
          />
        );
      },
    },
  ];

  // 类目设置修改
  const handleClassSet = (type, detail) => setClassVisible({ show: true, type, detail });

  // 小程序是否可见开关
  const fetchTradeWeChat = (values) => {
    dispatch({
      type: 'sysTradeList/fetchTradeWeChat',
      payload: values,
      callback: childRef.current.fetchGetData,
    });
  };

  // 删除/修改类目
  const fetchTradeSet = (values) => {
    dispatch({
      type: 'sysTradeList/fetchTradeSet',
      payload: values,
      callback: childRef.current.fetchGetData,
    });
  };

  // 获取推广费详情 -> 新增/修改推广费
  const handlePromotionMoneyGet = (info) => {
    const { categoryIdString: categoryId } = info;
    dispatch({
      type: 'sysTradeList/fetchPromotionMoneyGet',
      payload: { categoryId },
      callback: (detail) => setMoneyVisible({ show: true, info, detail }),
    });
  };

  useEffect(() => {
    dispatch({
      type: 'sysTradeList/clearDetail',
    });
  }, [visible, baseVisible]);

  return (
    <>
      <Alert
        message="说明：扫码支付服务费全行业为1%，核销订单服务费根据行业配置"
        type="info"
        banner
      />
      <TableDataBlock
        cRef={childRef}
        btnExtra={
          <>
            <AuthConsumer auth="baseTrade">
              <Button className="dkl_green_btn" onClick={() => setBaseVisible({ type: 'base' })}>
                基础设施
              </Button>
            </AuthConsumer>
            <AuthConsumer auth="tradeAdd">
              <Button
                className="dkl_green_btn"
                onClick={() => handleClassSet('add', { parentId: 0, node: '0', type: 'first' })}
              >
                新增类目
              </Button>
            </AuthConsumer>
          </>
        }
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.id}`}
        dispatchType="sysTradeList/fetchGetList"
        {...list}
        expandable={{ childrenColumnName: ['categoryDTOList'] }}
        pagination={false}
      ></TableDataBlock>
      {/* 平台服务费 */}
      <TradePlatformDetailList visible={visible} setVisible={setVisible}></TradePlatformDetailList>
      {/* 基础设施 */}
      <TradeDetailList visible={baseVisible} onClose={setBaseVisible}></TradeDetailList>
      {/* 推广费设置修改 */}
      <PromotionMoneySet
        childRef={childRef}
        visible={moneyVisible}
        onClose={() => setMoneyVisible(false)}
      ></PromotionMoneySet>
      {/* 类目新增/修改 */}
      <TradeCategorySet
        childRef={childRef}
        visible={classVisible}
        onClose={() => setClassVisible(false)}
      ></TradeCategorySet>
      {/* 适用场景 */}
      <TradeSceneList
        visible={visibleScene}
        childRef={childRef}
        onClose={() => setVisibleScene(false)}
      ></TradeSceneList>
    </>
  );
};

export default connect(({ sysTradeList, loading }) => ({
  list: sysTradeList.list,
  loading:
    loading.effects['sysTradeList/fetchGetList'] ||
    loading.effects['sysTradeList/fetchPromotionMoneyGet'],
}))(SysTradeSet);
