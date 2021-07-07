import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { BUSINESS_TYPE, COUPON_WEEK_TIME, COUPON_BUY_RULE } from '@/common/constant';
import { DoubleRightOutlined } from '@ant-design/icons';
import { Button, Tabs, Alert, Form, notification } from 'antd';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';
import ExtraButton from '@/components/ExtraButton';
import CheckRefuseDraw from './CheckRefuseDraw';
import MerchantListTable from '../../SpecialGoods/Detail/MerchantListTable';
import CheckRecord from '../../GoodCheck/Detail/CheckRecord';

const GoodsDetail = (props) => {
  const { visible, onClose, total, getDetail, loading, dispatch, tabkey, cRef } = props;
  const { show = false, index, detail = {}, status } = visible;
  const {
    ownerType = 'merchant',
    merchantIdList: mreList = [],
    buyFlag = '1',
    auditIdString,
    ownerIdString,
  } = detail;

  const [visibleRefuse, setVisibleRefuse] = useState(false);
  const [merchantList, setMerchantList] = useState([]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (show) {
      //挂靠商家列表
      if (detail.ownerType === 'group') {
        getMerchantList();
      }
    }
  }, [show]);

  // 审核通过
  const handleVerifyAllow = () => {
    form.validateFields().then((values) => {
      const { serviceDivisionDTO = {} } = values;
      const payload = {
        auditId: auditIdString,
        ownerId: ownerIdString,
        serviceDivisionDTO: detail.divisionFlag === '1' ? serviceDivisionDTO : '',
      };
      dispatch({
        type: 'specialGoodsCheck/fetchSpecialGoodsAudit',
        payload: payload,
        callback: () => {
          onClose();
          cRef.current.fetchGetData();
        },
      });
    });
  };

  //sku通用-审核中sku挂靠商家列表
  const getMerchantList = () => {
    dispatch({
      type: 'baseData/fetchAuditMerchantList',
      payload: {
        auditId: auditIdString,
        ownerId: ownerIdString,
      },
      callback: (list) => setMerchantList(list),
    });
  };

  const btnList = [
    {
      auth: 'check',
      onClick: handleVerifyAllow,
      text: '审核通过',
      show: ['0'].includes(status) && ['adminAudit'].includes(tabkey),
    },
  ];
  // 参与活动的店铺
  const mreFormItems = [
    {
      label: '店铺类型',
      name: 'ownerType',
      render: (val) => BUSINESS_TYPE[val],
    },
    {
      label: `${BUSINESS_TYPE[ownerType]}名称`,
      name: 'ownerName',
    },
  ];

  // 券信息
  const couponFormItems = [
    {
      label: '券名称',
      name: 'couponName',
    },
    {
      label: '券价值',
      name: ['reduceObject', 'couponPrice'],
      render: (val) => `￥ ${val}`,
    },
    {
      label: '售卖价格',
      name: 'buyPrice',
      show: buyFlag === '1',
      render: (val) => `￥ ${val}`,
    },
    {
      label: '商家结算价',
      name: 'merchantPrice',
      show: buyFlag === '1',
      render: (val) => `￥ ${val}`,
    },
  ];

  // 使用规则
  const useFormItems = [
    {
      label: '使用门槛',
      name: ['reduceObject', 'thresholdPrice'],
      render: (val) => (val === '0' || val === '--' ? '无门槛' : `满${val}元可使用`),
    },
    {
      label: '使用有效期',
      name: 'activeDate',
      render: (val, row) => {
        const { useTimeRule, activeDate, endDate, delayDays, activeDays } = row;
        if (useTimeRule === 'fixed') {
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
      label: '适用时段',
      name: 'useWeek',
      render: (val) => COUPON_WEEK_TIME.filter((item, index) => val.includes(index)),
    },
    {
      label: '使用时间',
      name: 'useTime',
    },
    {
      label: '投放总量',
      name: 'total',
    },
    {
      label: `${['领取', '购买'][buyFlag]}上限`,
      name: 'buyRule',
      render: (val) => COUPON_BUY_RULE[val] || '--',
      children: (
        <>
          {detail.buyRule === 'personLimit' && (
            <div>
              单人每人{['领取', '购买'][buyFlag]}份数: {detail.personLimit}
            </div>
          )}
          {detail.buyRule === 'dayLimit' && (
            <div>
              单人每天{['领取', '购买'][buyFlag]}份数: {detail.dayMaxBuyAmount}
            </div>
          )}
        </>
      ),
    },
    {
      label: '使用说明',
      name: 'couponDescString',
    },
    {
      label: '退款规则',
      name: ['reduceObject', 'anytimeRefund'],
      render: (val) =>
        `${val === '1' ? '' : '不'}允许随时退款 \n ${
          detail.reduceObject.expireRefund === '1' ? '' : '不'
        }允许过期退款`,
    },
  ];
  //分佣配置
  const commissionItem = [
    {
      label: '省代分佣金额（元）',
      name: ['serviceDivisionDTO', 'provinceFee'],
      type: 'number',
      precision: 2,
      min: 0,
      max: 999999.99,
    },
    {
      label: '区县分佣金额（元）',
      name: ['serviceDivisionDTO', 'districtFee'],
      type: 'number',
      precision: 2,
      min: 0,
      max: 999999.99,
    },
    {
      label: '哒人分佣金额（元）',
      name: ['serviceDivisionDTO', 'darenFee'],
      type: 'number',
      precision: 2,
      min: 0,
      max: 999999.99,
    },
  ];
  const commission = [
    {
      label: `佣金总额`,
      name: 'commission',
      render: (val) => (val ? val + '元' : ''),
    },
  ];

  const modalProps = {
    visible: show,
    title: '详情',
    onClose,
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    footer: (
      <ExtraButton list={btnList}>
        {['0'].includes(status) && ['adminAudit'].includes(tabkey) && (
          <Button
            style={{ marginLeft: 8 }}
            danger
            onClick={() =>
              setVisibleRefuse({
                show: true,
                type: 'edit',
                auditId: detail.auditIdString,
                ownerId: detail.ownerIdString,
              })
            }
          >
            审核驳回
          </Button>
        )}
      </ExtraButton>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {status == '2' && (
        <Alert
          message={`驳回原因：${
            detail.rejectReason.length > 12
              ? detail.rejectReason.substr(0, 12) + '...'
              : detail.rejectReason
          }`}
          type="error"
          banner
          action={
            <Button
              size="small"
              danger
              onClick={() =>
                setVisibleRefuse({
                  show: true,
                  type: 'info',
                  detail: detail.auditDetail,
                })
              }
            >
              <DoubleRightOutlined />
            </Button>
          }
        />
      )}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="商品信息" key="1">
          <>
            <DescriptionsCondition
              title="参与活动的店铺"
              formItems={mreFormItems}
              initialValues={detail}
            ></DescriptionsCondition>
            {detail.ownerType === 'group' && (
              <div style={{ margin: '10px' }}>
                <MerchantListTable merchantList={merchantList || []}></MerchantListTable>
              </div>
            )}
            <DescriptionsCondition
              title="券信息"
              formItems={couponFormItems}
              initialValues={detail}
            ></DescriptionsCondition>
            <DescriptionsCondition
              title="使用规则"
              formItems={useFormItems}
              initialValues={detail}
            ></DescriptionsCondition>
            {/* 详情 手动分佣*/}
            {tabkey !== 'adminAudit' && detail.divisionFlag === '1' && (
              <DescriptionsCondition
                title="分佣配置"
                formItems={commissionItem}
                initialValues={detail}
              ></DescriptionsCondition>
            )}
          </>
        </Tabs.TabPane>
        <Tabs.TabPane tab="审核记录" key="2">
          <CheckRecord detail={detail}></CheckRecord>
        </Tabs.TabPane>
      </Tabs>

      {/* 审核手动分佣展示 */}
      {tabkey === 'adminAudit' && detail.divisionFlag === '1' && (
        <>
          <div
            style={{ fontSize: 16, color: 'rgba(0,0,0,.85', margin: '10px 0', fontWeight: 'bold' }}
          >
            分佣配置
          </div>
          <DescriptionsCondition
            formItems={commission}
            initialValues={detail}
          ></DescriptionsCondition>
          <FormCondition
            form={form}
            style={{ marginTop: 10 }}
            formItems={commissionItem}
            initialValues={detail}
          ></FormCondition>
        </>
      )}
      <CheckRefuseDraw
        cRef={cRef}
        visible={visibleRefuse}
        onClose={() => setVisibleRefuse(false)}
        onCloseF={onClose}
      ></CheckRefuseDraw>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoodsCheck/fetchSpecialGoodsAuditDetail'],
}))(GoodsDetail);
