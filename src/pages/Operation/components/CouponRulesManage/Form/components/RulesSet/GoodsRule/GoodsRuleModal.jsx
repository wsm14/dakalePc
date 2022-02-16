import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import { Card, Modal, Tag, Form } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import PopImgShow from '@/components/PopImgShow';
import {
  CONPON_RULES_GOODS_TYPE,
  SPECIAL_STATUS,
  SPECIAL_RECOMMEND_DELSTATUS,
  GOODS_CLASS_TYPE,
  BUSINESS_TYPE,
  COUPON_TYPE,
  COUPON_STATUS,
  COMMERCEGOODS_STATUS,
} from '@/common/constant';
import TableDataBlock from '@/components/TableDataBlock';
import imgUrl from './payImg.png';

const VaneDrawer = (props) => {
  const {
    visible,
    form,
    onClose,
    loading,
    shopData,
    setShopData,
    specialGoodsList = {},
    couponList = {},
    platformEquityList = {},
  } = props;

  const childRef = useRef();

  const [searchForm] = Form.useForm();
  const [tabKey, setTabKey] = useState('specialGoods');
  const [selectItem, setSelectItem] = useState([]); // 选中项

  useEffect(() => {
    console.log(visible);
    if (!visible || (!childRef.current && !searchForm)) return;
    if (tabKey === 'reduceCoupon') {
      searchForm?.setFieldsValue({
        ownerCouponStatus: '1',
      });
    } else {
      searchForm?.setFieldsValue({
        status: '1',
      });
    }
    childRef?.current?.fetchGetData(listProps.searchShowData);
  }, [tabKey, visible]);

  useEffect(() => {
    if (visible) {
      setTabKey(shopData['subRuleType']);
      setSelectItem(shopData['list']);
    }
  }, [visible]);

  // 搜索参数
  const searchItems = [
    {
      label: '商品名称',
      name: {
        specialGoods: 'goodsName',
        reduceCoupon: 'couponName',
        commerceGoods: 'goodsName',
      }[tabKey],
    },
    {
      label: '店铺/集团名称',
      name: {
        specialGoods: 'ownerId',
        reduceCoupon: 'ownerId',
        commerceGoods: 'relateId',
      }[tabKey],
      type: 'merchant',
    },
    {
      label: '活动状态',
      name: {
        specialGoods: 'status',
        reduceCoupon: 'ownerCouponStatus',
        commerceGoods: 'status',
      }[tabKey],
      type: 'select',
      allItem: false,
      select: tabKey === 'reduceCoupon' ? [false, '上架中', '已下架'] : SPECIAL_STATUS,
    },
  ];

  //  特惠商品/电商品 表头
  const specialGoodsColumns = [
    {
      title: '商品/店铺名称',
      fixed: 'left',
      dataIndex: 'goodsImg',
      show: ['specialGoods'].includes(tabKey),
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <PopImgShow url={val} />
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
              <Tag color={row.goodsType === 'single' ? 'orange' : 'magenta'}>
                {GOODS_CLASS_TYPE[row.goodsType]}
              </Tag>
              <Ellipsis length={10} tooltip>
                {row.goodsName}
              </Ellipsis>
            </div>
            <div style={{ display: 'flex', marginTop: 5 }}>
              <Tag>{BUSINESS_TYPE[row.ownerType]}</Tag>
              <Ellipsis length={10} tooltip>
                {row.ownerName}
              </Ellipsis>
            </div>
            <div style={{ display: 'flex', marginTop: 5 }}>{`ID:${row.specialGoodsId}`}</div>
          </div>
        </div>
      ),
    },
    {
      title: '商品信息',
      fixed: 'left',
      dataIndex: 'goodsImg',
      show: ['commerceGoods'].includes(tabKey),
      render: (val, row) => (
        <div style={{ display: 'flex' }}>
          <PopImgShow url={val} />
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
                {row.goodsName}
              </Ellipsis>
            </div>
            <div style={{ display: 'flex', marginTop: 5 }}>{`ID:${row.specialGoodsId}`}</div>
          </div>
        </div>
      ),
    },
    {
      title: '原价/售价',
      align: 'right',
      dataIndex: 'oriPrice',
      show: ['specialGoods'].includes(tabKey),
      render: (val, row) => {
        const zhe = (Number(row.realPrice) / Number(val)) * 10;
        return (
          <div>
            <div style={{ textDecoration: 'line-through', color: '#999999' }}>
              ￥{Number(val).toFixed(2)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div>￥{Number(row.realPrice).toFixed(2)}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: '原价/售价',
      align: 'right',
      dataIndex: 'paymentModeObject',
      show: ['commerceGoods'].includes(tabKey),
      render: (val = {}, row) => (
        <div>
          <div style={{ textDecoration: 'line-through', color: '#999999' }}>
            ￥{Number(row.oriPrice).toFixed(2)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              {val.type === 'self'
                ? `${val.bean || 0} 卡豆 + ${val.cash || 0} 元`
                : `${row.realPrice || 0} 元`}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '使用有效期',
      dataIndex: 'useStartTime',
      show: ['specialGoods'].includes(tabKey),
      render: (val, row) => {
        const { useStartTime, useEndTime, useTimeRule, delayDays, activeDays } = row;
        if (!useTimeRule) return '';
        if (useTimeRule === 'fixed') {
          return useStartTime + '~' + useEndTime;
        } else {
          if (delayDays === '0') {
            return `领取后立即生效\n有效期${activeDays}天`;
          }
          return `领取后${delayDays}天生效\n有效期${activeDays}天`;
        }
      },
    },
    {
      title: '活动时间',
      align: 'center',
      dataIndex: 'activityStartTime',
      show: ['specialGoods'].includes(tabKey),
      render: (val, row) => (
        <>
          {row.activityTimeRule === 'infinite'
            ? `${row.createTime} ~ 长期`
            : `${val} ~ ${row.activityEndTime}`}
          <div>
            {row.deleteFlag === '0'
              ? SPECIAL_RECOMMEND_DELSTATUS[row.deleteFlag]
              : SPECIAL_STATUS[row.status]}
          </div>
        </>
      ),
    },
    {
      title: '活动状态',
      align: 'right',
      dataIndex: 'status',
      show: ['commerceGoods'].includes(tabKey),
      render: (val) => COMMERCEGOODS_STATUS[val],
    },
    {
      title: '剩余库存',
      align: 'right',
      dataIndex: 'remain',
    },
  ];

  //  有价券 表头
  const ownerCouponColumns = [
    {
      title: '券/店铺名称',
      fixed: 'left',
      dataIndex: 'couponName',
      render: (val, row) => (
        <div>
          <div>
            <Tag color="magenta">{COUPON_TYPE[row.couponType]}</Tag>
            <Ellipsis length={10} tooltip>
              {val}
            </Ellipsis>
          </div>
          <div style={{ display: 'flex', marginTop: 5 }}>
            <Tag>{BUSINESS_TYPE[row.ownerType]}</Tag>
            <Ellipsis length={10} tooltip>
              {row.ownerName}
            </Ellipsis>
          </div>
          <div style={{ display: 'flex', marginTop: 5 }}>{`ID:${row.ownerCouponIdString}`}</div>
        </div>
      ),
    },
    {
      title: '券价值/售价',
      align: 'right',
      dataIndex: ['reduceObject', 'couponPrice'],
      render: (val, row) => (
        <div>
          <div style={{ textDecoration: 'line-through', color: '#999999' }}>
            ￥{Number(val).toFixed(2)}
          </div>
          <div>￥{Number(row.buyPrice).toFixed(2)}</div>
        </div>
      ),
    },
    {
      title: '使用有效期',
      dataIndex: 'activeDate',
      render: (val, row) => {
        const { activeDate, endDate, delayDays, activeDays } = row;
        if (activeDate && endDate) {
          return activeDate + '~' + endDate;
        } else {
          if (delayDays === '0') {
            return `领取后立即生效\n有效期${activeDays}天`;
          }
          return `领取后${delayDays}天生效\n有效期${activeDays}天`;
        }
      },
    },
    {
      title: '发布时间',
      align: 'right',
      dataIndex: 'ownerCouponStatus',
      render: (val) => COUPON_STATUS[val],
    },
    {
      title: '剩余库存',
      align: 'right',
      dataIndex: 'remain',
    },
  ];

  const listProps = {
    specialGoods: {
      dispatchType: 'couponRulesManage/fetchListSpecialGoodsManagement',
      totalList: specialGoodsList,
      searchShowData: { status: '1' },
      params: { activityType: 'specialGoods', deleteFlag: '1' },
      getColumns: specialGoodsColumns,
      id: 'specialGoodsId',
    },
    reduceCoupon: {
      dispatchType: 'baseData/fetchGetAllCouponSelect',
      totalList: couponList,
      searchShowData: { ownerCouponStatus: '1' },
      params: { buyFlag: '1', reduceCoupon: '1' },
      getColumns: ownerCouponColumns,
      id: 'ownerCouponIdString',
    },
    commerceGoods: {
      dispatchType: 'baseData/fetchGetPlatformCommerceGoodsSelect',
      totalList: platformEquityList,
      searchShowData: { status: '1' },
      params: { activityType: 'commerceGoods' },
      getColumns: specialGoodsColumns,
      id: 'specialGoodsId',
    },
  }[tabKey];

  const modalProps = {
    title: '选择指定商品',
    forceRender: true,
    width: 1000,
    visible,
    okText: ['phoneBill', 'member'].includes(tabKey)
      ? '确定'
      : `确定（已选${selectItem.length || 0}项）`,
    bodyStyle: { overflowY: 'auto', maxHeight: 600 },
    onOk: () => {
      form.setFieldsValue({
        remark: ['phoneBill', 'member'].includes(tabKey)
          ? `已选${CONPON_RULES_GOODS_TYPE[tabKey]}`
          : `已选${selectItem.length}个${CONPON_RULES_GOODS_TYPE[tabKey]}`,
        ruleConditions: ['phoneBill', 'member'].includes(tabKey)
          ? [
              {
                condition: 'all',
              },
            ]
          : selectItem.map((item) => ({
              condition: item[listProps.id],
            })),
        subRuleType: tabKey,
      });
      setShopData({ subRuleType: tabKey, list: selectItem });
      onClose();
    },
    onCancel: onClose,
  };

  // 选择数据去重数据
  const handleSelectRow = (list) => {
    const obj = {};
    const allIdArr = list.map((i) => i[listProps.id]); // 获取所有id
    // 去重数据
    const newSelectList = list
      .reduce((item, next) => {
        next && obj[next[listProps.id]]
          ? ''
          : next && (obj[next[listProps.id]] = true && item.push(next));
        return item;
      }, [])
      .filter((item) => item && allIdArr.includes(item[listProps.id]));
    setSelectItem(newSelectList);
  };

  return (
    <Modal {...modalProps}>
      <Card
        tabList={
          tabKey && selectItem.length
            ? [{ key: tabKey, tab: CONPON_RULES_GOODS_TYPE[tabKey] }]
            : Object.keys(CONPON_RULES_GOODS_TYPE).map((item) => ({
                key: item,
                tab: CONPON_RULES_GOODS_TYPE[item],
              }))
        }
        activeTabKey={tabKey}
        onTabChange={(key) => {
          setTabKey(key);
        }}
        bordered={false}
      >
        {['specialGoods', 'reduceCoupon', 'commerceGoods'].includes(tabKey) ? (
          <TableDataBlock
            cRef={childRef}
            noCard={false}
            firstFetch={false}
            loading={loading}
            searchForm={searchForm}
            searchItems={searchItems}
            searchShowData={listProps.searchShowData}
            params={listProps.params}
            columns={listProps.getColumns}
            dispatchType={listProps.dispatchType}
            rowKey={(record) => `${record[listProps.id]}`}
            {...listProps.totalList}
            rowSelection={{
              selectedRowKeys: selectItem.map((i) => i[listProps.id]),
              onSelect: (row, selected, list) => {
                /**
                 * 获取当前所有数据 且保留 list 内不为undefind的数据
                 * 当selected为true选中状态时 filter 返回true 保留数据
                 * 当selected为false取消选中 排除当前点击项目
                 */
                const allSelectList = [...selectItem, ...list].filter((i) =>
                  selected ? i : i && i[listProps.id] !== row[listProps.id],
                );
                handleSelectRow(allSelectList);
              },
              onSelectAll: (selected, selectedRows, changeRows) => {
                const allSelectList = [...selectItem, ...changeRows].filter((i) =>
                  selected
                    ? i
                    : i && !changeRows.map((it) => it[listProps.id]).includes(i[listProps.id]),
                );
                handleSelectRow(allSelectList);
              },
            }}
          ></TableDataBlock>
        ) : (
          <div
            style={{
              width: '100%',
              height: 340,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <img src={imgUrl}></img>
            <div>{`选择所有${CONPON_RULES_GOODS_TYPE[tabKey]}商品参与`}</div>
          </div>
        )}
      </Card>
    </Modal>
  );
};

export default connect(({ couponRulesManage, baseData, loading }) => ({
  specialGoodsList: couponRulesManage.specialGoodsList,
  couponList: baseData.allCouponList,
  platformEquityList: baseData.platformEquity,
  loading:
    loading.effects['couponRulesManage/fetchListSpecialGoodsManagement'] ||
    loading.effects['baseData/fetchGetAllCouponSelect'] ||
    loading.effects['baseData/fetchGetPlatformCommerceGoodsSelect'],
}))(VaneDrawer);
