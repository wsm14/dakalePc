import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { Alert } from 'antd';
import TableDataBlock from '@/components/TableDataBlock';
import TradeCategoryFrontSet from '../Form/TradeCategoryFrontSet';
import DraggableContent, { DragHandle } from '@/components/TableDataBlock/SortBlock';
import TradeDetailList from '../List/TradeDetailList';
import TradeSortSet from '../Form/TradeSortSet';

const SysTradeSet = (props) => {
  const { list = {}, loading, dispatch } = props;

  const childRef = useRef();
  const [baseVisible, setBaseVisible] = useState(''); // 基础设施
  const [classVisible, setClassVisible] = useState(false); // 类目设置修改
  // const [expandedRowKeys, setExpandedRowKeys] = useState([]); // 展开行
  // const [expandedRowKeyNode, setExpandedRowKeyNode] = useState(1); // 展开行层级
  // const [sortArrData, setSortArrData] = useState([]); // 排序的数组数据

  // useEffect(() => {
  //   console.log(list.list);
  //   if (expandedRowKeyNode === 1) {
  //     setSortArrData(list.list);
  //   }
  // }, [list.list.length]);

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
      title: '行业编号',
      align: 'center',
      dataIndex: 'categoryFrontId',
    },
    {
      title: '关联后台类目',
      align: 'center',
      dataIndex: 'categoryDTOList',
      render: (val) => {
        let result = '';
        val &&
          val.forEach((item) => {
            result = `${result}${item.categoryName},`;
          });
        return result.slice(0, -1);
      },
    },
    {
      title: '权重',
      align: 'center',
      fixed: 'right',
      dataIndex: 'sortValue',
      render: (val, row) => (
        <TradeSortSet detail={row} onSubmit={fetchTradeSet} getList={getList}></TradeSortSet>
      ),
    },
    // {
    //   title: '排序',
    //   align: 'center',
    //   dataIndex: 'sort',
    //   render: (val, row) =>
    //     expandedRowKeyNode == row.node.split('.').length ? <DragHandle /> : '',
    // },
    {
      title: '小程序展示',
      type: 'switch',
      fixed: 'right',
      dataIndex: 'isWechat',
      render: (val, row) => {
        const { categoryFrontId } = row;
        return {
          auth: 'isWechat',
          checkedChildren: '开',
          unCheckedChildren: '关',
          noAuth: val === '1' ? '开' : '关',
          checked: val === '1',
          onClick: () => fetchTradeWeChat({ categoryFrontId, isWechat: 1 ^ Number(val) }),
        };
      },
    },
    {
      title: '状态',
      type: 'switch',
      fixed: 'right',
      dataIndex: 'isDelete',
      render: (val, row) => {
        const { categoryFrontId } = row;
        return {
          auth: 'isDelete',
          checkedChildren: '开',
          unCheckedChildren: '关',
          noAuth: val === '0' ? '开' : '关',
          checked: val === '0',
          onClick: () => fetchTradeStatus({ categoryFrontId, isDelete: 1 ^ Number(val) }),
        };
      },
    },
    {
      type: 'handle',
      dataIndex: 'categoryFrontId',
      render: (val, record) => {
        const { node, parentIdString } = record;
        const listLength = node.split('.').length;
        return [
          {
            type: 'edit',
            click: () => {
              dispatch({
                type: 'sysTradeList/fetchFrontTradeDetail',
                payload: {
                  categoryFrontId: parentIdString,
                },
                callback: (content) => {
                  const { categoryName: parentName } = content;
                  const { isDelete, parentId, ...other } = record;
                  const detail = {
                    ...other,
                    parentName,
                    isDelete: isDelete === '0' ? true : false,
                    ranking: listLength === 1 ? 'first' : listLength === 2 ? 'second' : 'third',
                  };
                  handleClassSet('edit', detail);
                },
              });
            },
          },
          {
            type: 'del',
            visible: !record.childList,
            click: () => fetchTradeSet({ categoryFrontId: val, isDelete: 1 }, getList),
          },
          {
            type: 'tradeSecondAdd',
            visible: listLength !== 3,
            click: () => {
              const { categoryName: parentName } = record;
              const ranking = listLength === 2 ? 'third' : 'second';
              const detail = {
                parentId: val,
                parentName,
                ranking,
                type: 'behind',
                isDelete: true,
              };
              handleClassSet('add', detail);
            },
          },
        ];
      },
    },
  ];

  // 类目设置修改
  const handleClassSet = (status, detail) => setClassVisible({ show: true, status, detail });

  //获取列表信息
  const getList = () => {
    childRef.current.fetchGetData();
  };

  // 小程序是否可见开关
  const fetchTradeWeChat = (values) => {
    dispatch({
      type: 'sysTradeList/fetchFrontTradeWeChat',
      payload: values,
      callback: childRef.current.fetchGetData,
    });
  };

  // 状态是否打开
  const fetchTradeStatus = (values) => {
    dispatch({
      type: 'sysTradeList/fetchFrontTradeSet',
      payload: values,
      callback: childRef.current.fetchGetData,
    });
  };

  // 删除/修改类目
  const fetchTradeSet = (values, callback) => {
    dispatch({
      type: 'sysTradeList/fetchFrontTradeSet',
      payload: values,
      callback,
    });
  };

  useEffect(() => {
    dispatch({
      type: 'sysTradeList/clearDetail',
    });
  }, [baseVisible]);
  // 问题排序
  const fetchFAQSort = (payload) => {
    dispatch({
      type: 'sysTradeList/fetchFrontSortList',
      payload,
      callback: childRef.current.fetchGetData,
    });
  };

  const extraBtn = [
    {
      text: '基础设施',
      auth: 'baseTrade',
      onClick: () => setBaseVisible({ type: 'base' }),
    },
    {
      text: '新增类目',
      auth: 'tradeAdd',
      onClick: () => handleClassSet('add', { parentId: 0, ranking: 'first', isDelete: true }),
    },
  ];

  return (
    <>
      <Alert
        message="说明：扫码支付服务费全行业为1%，核销订单服务费根据行业配置"
        type="info"
        banner
      />
      <TableDataBlock
        cRef={childRef}
        btnExtra={extraBtn}
        loading={loading}
        columns={getColumns}
        searchItems={searchItems}
        rowKey={(record) => `${record.categoryFrontId}`}
        dispatchType="sysTradeList/fetchFrontGetList"
        // 排序
        // {...DraggableContent(
        //   // 参与排序的源数据 父级列表 或者 子列表  expandedRowKeys.length > 0 则是对子类操作 否则是父类
        //   sortArrData,
        //   {
        //     key: 'categoryFrontId',
        //     // 排序回调
        //     onSortEnd: (val) => {
        //       console.log(val, 'val');
        //       // 传递排序后数据
        //       console.log(val, 'newArr');
        //       fetchFAQSort({
        //         categoryFrontDTOList: val.map((item, i) => ({
        //           categoryFrontId: item['categoryFrontId'],
        //           sortValue: i,
        //         })),
        //       });
        //     },
        //   },
        // )}
        expandable={{
          // expandedRowKeys,
          childrenColumnName: ['childList'],
          // onExpand: (expanded, row) => {
          //   const nodeLength = row.node.split('.').length;
          //   setSortArrData(expanded ? row.childList : []);
          //   setExpandedRowKeyNode(expanded ? nodeLength + 1 : nodeLength);
          //   setExpandedRowKeys(
          //     expanded
          //       ? row.node.split('.')
          //       : nodeLength === 2
          //       ? row.node.split('.').slice(0, 1)
          //       : [],
          //   );
          // },
        }}
        pagination={false}
        {...list}
      ></TableDataBlock>
      {/* 基础设施 */}
      <TradeDetailList visible={baseVisible} onClose={setBaseVisible}></TradeDetailList>
      {/* 类目新增/修改 */}
      <TradeCategoryFrontSet
        childRef={childRef}
        visible={classVisible}
        onClose={() => setClassVisible(false)}
      ></TradeCategoryFrontSet>
    </>
  );
};

export default connect(({ sysTradeList, loading }) => ({
  list: sysTradeList.frontList,
  loading: loading.effects['sysTradeList/fetchFrontGetList'],
}))(SysTradeSet);
