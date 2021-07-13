import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Button, Tabs, Alert, Form, notification } from 'antd';
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
  const { show = false, index, detail = {}, status, ownerIdString, auditIdString } = visible;
  const [merchantTaglist, setMerchantTaglist] = useState([]);
  const [platTaglist, setPlatTaglist] = useState([]);
  const [visibleRefuse, setVisibleRefuse] = useState(false);
  const [merchantList, setMerchantList] = useState([]);
  const [recordList, setRecordList] = useState({});

  const { goodsTagList = [], categoryIdString = '' } = detail;
  console.log(detail, 'detail12222');

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

  // 0-待审核 1-已通过 2-已驳回 3-已关闭

  const [form] = Form.useForm();

  useEffect(() => {
    if (show) {
      getTagList();
      // getTagsMerchant();
      // getTagsPlat();

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

  // //获取商品标签
  // const getTagsMerchant = () => {
  //   dispatch({
  //     type: 'goodsTag/fetchGoodsTagList',
  //     payload: {
  //       tagType: 'merchant',
  //     },
  //     callback: (list) => {
  //       setMerchantTaglist(list);
  //     },
  //   });
  // };
  // //平台标签
  // const getTagsPlat = () => {
  //   dispatch({
  //     type: 'goodsTag/fetchGoodsTagList',
  //     payload: {
  //       tagType: 'platform',
  //     },
  //     callback: (list) => setPlatTaglist(list),
  //   });
  // };

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
      let tags = [...merTags, ...platTags];
      const { provinceBean = '', districtBean = '', darenBean = '' } = serviceDivisionDTO;
      const pBean = Number(provinceBean) * 100;
      const dBean = Number(districtBean) * 100;
      const daBean = Number(darenBean) * 100;
      const totalFee = (Number(provinceBean) + Number(districtBean) + Number(darenBean)).toFixed(2);
      //金额转卡豆
      const serDivisionDTO = { provinceBean: pBean, districtBean: dBean, darenBean: daBean };
      const payload = {
        auditId: auditIdString,
        ownerId: ownerIdString,
        serviceDivisionDTO: detail.divisionFlag === '1' ? serDivisionDTO : '',
        otherPlatformPrice: otherPlatformPrice,
        goodsTags: tags && tags.toString(),
      };
      //手动分佣判断
      if (detail.divisionFlag === '1') {
        if (totalFee > Number(detail.commission)) {
          notification.info({
            message: '温馨提示',
            description: '分佣金额之和不能大于佣金总额',
          });
          return;
        }
      }
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
      render: (val) => (val ? val + '元' : ''),
    },
  ];

  const formCommission = [
    {
      label: '省代分佣金额（元）',
      name: ['serviceDivisionDTO', 'provinceBean'],
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      label: '区县分佣金额（元）',
      name: ['serviceDivisionDTO', 'districtBean'],
      type: 'number',
      precision: 2,
      min: 0,
    },
    {
      label: '哒人分佣金额（元）',
      name: ['serviceDivisionDTO', 'darenBean'],
      type: 'number',
      precision: 2,
      min: 0,
    },
  ];

  const formTagItem = [
    {
      label: '商家商品标签',
      type: 'select',
      mode: 'multiple',
      name: 'merTags',
      select: merchantTaglist,
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
      fieldNames: { label: 'tagName', value: 'configGoodsTagId' },
    },
  ];

  const handleTabChange = (val) => {
    if (val === '3') {
      dispatch({
        type: 'baseData/fetchGetLogDetail',
        payload: {
          type: 'audit',
          key: 'audit',
          identificationId: auditIdString,
        },
        callback: (list) => {
          setRecordList(list);
        },
      });
    }
  };

  const handleErr = () => {};

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
          {detail.divisionFlag === '1' && ['adminAudit'].includes(tabkey) && (
            <>
              <DescriptionsCondition
                formItems={commission}
                initialValues={detail}
              ></DescriptionsCondition>

              <div
                style={{
                  fontSize: 16,
                  color: 'rgba(0,0,0,.85',
                  margin: '10px 0',
                  fontWeight: 'bold',
                }}
              >
                分佣配置
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
