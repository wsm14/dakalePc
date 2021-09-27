import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Button, Tabs, Alert, Form, notification } from 'antd';
import { COMMISSION_TYPE } from '@/common/constant';
import { DoubleRightOutlined } from '@ant-design/icons';
import DrawerCondition from '@/components/DrawerCondition';
import GoodsDetailForm from './Detail/GoodsDetail';
import RegularDetail from './Detail/RegularDetail';
import CheckRecord from '@/components/CheckRecord';
import ExtraButton from '@/components/ExtraButton';
import FormCondition from '@/components/FormCondition';
import CheckRefuseDraw from './Detail/CheckRefuseDraw';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const SpecialGoodCheckDetail = (props) => {
  const { visible, onClose, total, getDetail, loading, dispatch, tabkey, cRef } = props;
  const {
    show = false,
    index,
    detail = {},
    status,
    ownerIdString,
    auditIdString,
    submitterType,
  } = visible;
  const [merchantTaglist, setMerchantTaglist] = useState([]);
  const [platTaglist, setPlatTaglist] = useState([]);
  const [visibleRefuse, setVisibleRefuse] = useState(false);
  const [merchantList, setMerchantList] = useState([]);
  const [recordList, setRecordList] = useState({});

  const {
    goodsTagList = [],
    categoryIdString = '',
    divisionFlag,
    serviceDivisionDTO: dService = {},
  } = detail;

  useEffect(() => {
    if (show) {
      const merTags = goodsTagList
        .filter((item) => item.tagType === 'merchant')
        .map((key) => key.configGoodsTagId);
      const platTags = goodsTagList
        .filter((item) => item.tagType === 'platform')
        .map((key) => key.configGoodsTagId);
      detail.platTags = platTags;
      detail.merTags = merTags;
    }
  }, [show]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (show) {
      getTagList();
      //挂靠商家列表
      if (detail.ownerType === 'group') {
        getMerchantList();
      }
    }
  }, [show]);

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

  //获取标签--商品标签--平台标签list
  const getTagList = () => {
    dispatch({
      type: 'baseData/fetchGoodsTagListByCategoryId',
      payload: {
        categoryId: categoryIdString,
      },
      callback: (list) => {
        const merTagslist = list.filter((item) => item.tagType === 'merchant').map((key) => key);
        const platTagslist = list.filter((item) => item.tagType === 'platform').map((key) => key);

        setMerchantTaglist(merTagslist);
        setPlatTaglist(platTagslist);
      },
    });
  };

  // 审核通过
  const handleVerifyAllow = () => {
    if (!form.getFieldValue('otherPlatformPrice')) {
      notification.info({
        message: '温馨提示',
        description: '请输入其他平台价格',
      });
    }
    form.validateFields().then((values) => {
      const { otherPlatformPrice, merTags, platTags, serviceDivisionDTO = {} } = values;

      const payload = {
        submitterType,
        divisionFlag,
        auditId: auditIdString,
        ownerId: ownerIdString,
        serviceDivisionDTO: detail.divisionFlag === '1' ? serviceDivisionDTO : '',
        otherPlatformPrice: otherPlatformPrice,
        goodsTags: merTags?.toString(),
        platformGoodsTags: platTags?.toString(),
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

  const btnList = [
    {
      auth: 'check',
      onClick: handleVerifyAllow,
      text: '审核通过',
      show:
        ['0'].includes(status) &&
        ['admin', 'sell'].includes(detail.auditorType) &&
        ['adminAudit'].includes(tabkey),
    },
  ];
  // 弹出窗属性
  const modalProps = {
    title: '活动详情',
    visible: show,
    loading,
    onClose,
    dataPage: {
      current: index,
      total,
      onChange: (size) => getDetail(size, 'info'),
    },
    footer: (
      <ExtraButton list={btnList}>
        {['0'].includes(status) &&
          ['admin', 'sell'].includes(detail.auditorType) &&
          ['adminAudit'].includes(tabkey) && (
            <Button
              style={{ marginLeft: 8 }}
              danger
              onClick={() =>
                setVisibleRefuse({
                  show: true,
                  type: 'edit',
                  auditId: auditIdString,
                  ownerId: ownerIdString,
                })
              }
            >
              审核驳回
            </Button>
          )}
      </ExtraButton>
    ),
  };

  const formItems = [
    {
      label: `其他平台价格`,
      name: 'otherPlatformPrice',
      maxLength: 20,
    },
  ];

  const commission = [
    {
      label: `佣金总额`,
      name: 'commission',
      render: (val) => (val ? `${val}元（${Number(val) * 100}卡豆）` : ''),
    },
  ];

  const formCommission = Object.keys(dService).map((i) => ({
    label: `${COMMISSION_TYPE[i.replace('Bean', '')]}分佣`,
    name: ['serviceDivisionDTO', i],
    type: 'number',
    precision: 2,
    min: 0,
    suffix: '卡豆',
    addRules: [
      {
        validator: (rule, time) => {
          const keyArr = Object.keys(dService).map((i) => ['serviceDivisionDTO', i]);
          const valObj = form.getFieldsValue(keyArr);
          const { serviceDivisionDTO: sVal = {} } = valObj;
          const allPrice =
            Object.values(sVal).reduce((pre, cur) => pre + Number(cur || 0), 0) / 100;
          if (allPrice > Number(detail.commission)) {
            return Promise.reject('分佣金额之和不能大于佣金总额');
          }
          return Promise.resolve();
        },
      },
    ],
  }));

  const formTagItem = [
    {
      label: '商家商品标签',
      type: 'select',
      mode: 'multiple',
      name: 'merTags',
      select: merchantTaglist,
      placeholder: '请选择商家商品标签',
      fieldNames: { label: 'tagName', value: 'configGoodsTagId' },
      addRules: [
        {
          validator: (rule, value) => {
            if (value.length > 3) {
              return Promise.reject('最多选择3个标签');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: '平台商品标签',
      name: 'platTags',
      type: 'select',
      mode: 'multiple',
      select: platTaglist,
      rules: [{ required: false }],
      placeholder: '请选择平台商品标签',
      fieldNames: { label: 'tagName', value: 'configGoodsTagId' },
    },
  ];

  //审核记录
  const handleTabChange = (val) => {
    if (val === '3') {
      setRecordList([]);
      if (detail.marketingIdString) {
        dispatch({
          type: 'baseData/fetchGetLogDetail',
          payload: {
            type: 'audit',
            key: 'audit',
            identificationId: detail.marketingIdString,
          },
          callback: (list) => {
            setRecordList(list);
          },
        });
      } else {
        notification.info({
          message: '温馨提示',
          description: '暂无审核记录',
        });
      }
    }
  };

  return (
    <DrawerCondition {...modalProps}>
      {/* 驳回原因 */}
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
                  detail: detail.rejectObj,
                })
              }
            >
              <DoubleRightOutlined />
            </Button>
          }
        />
      )}
      {/* 信息展示 */}
      <Tabs defaultActiveKey="1" onChange={handleTabChange}>
        <Tabs.TabPane tab="商品信息" key="1">
          <GoodsDetailForm
            detail={detail}
            form={form}
            tabkey={tabkey}
            merchantList={merchantList}
          ></GoodsDetailForm>
        </Tabs.TabPane>
        <Tabs.TabPane tab="投放规则" key="2">
          <RegularDetail detail={detail}></RegularDetail>
        </Tabs.TabPane>
        <Tabs.TabPane tab="审核记录" key="3">
          <CheckRecord recordList={recordList}></CheckRecord>
        </Tabs.TabPane>
      </Tabs>

      {/* 审核时输入 其他平台价格 */}
      {status == '0' && ['admin', 'sell'].includes(detail.auditorType) && (
        <div style={{ marginTop: 30 }}>
          <FormCondition
            formItems={formItems}
            form={form}
            initialValues={detail}
            style={{ marginTop: 10 }}
          ></FormCondition>

          {/* 审核中并且分佣模板为手动分佣时 */}
          {tabkey === 'adminAudit' && detail.divisionFlag === '1' && (
            <>
              <DescriptionsCondition
                formItems={commission}
                initialValues={detail}
              ></DescriptionsCondition>
              <div
                style={{
                  fontSize: 16,
                  color: 'rgba(0,0,0,.85)',
                  margin: '10px 0',
                  fontWeight: 'bold',
                }}
              >
                分佣配置（卡豆）
              </div>
              <FormCondition
                formItems={formCommission}
                initialValues={detail}
                form={form}
                style={{ marginTop: 10 }}
              ></FormCondition>
            </>
          )}
          {/* //审核编辑 */}
          {['adminAudit'].includes(tabkey) && (
            <>
              <div
                style={{
                  fontSize: 16,
                  color: 'rgba(0,0,0,.85',
                  margin: '10px 0',
                  fontWeight: 'bold',
                }}
              >
                商品标签
              </div>
              <FormCondition
                formItems={formTagItem}
                form={form}
                style={{ marginTop: 10 }}
              ></FormCondition>
            </>
          )}
        </div>
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
}))(SpecialGoodCheckDetail);
