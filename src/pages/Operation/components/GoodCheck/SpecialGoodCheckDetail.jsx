import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Button, Tabs, Alert, Form, notification } from 'antd';
import DrawerCondition from '@/components/DrawerCondition';
import GoodsDetailForm from './Detail/GoodsDetail';
import RegularDetail from './Detail/RegularDetail';
import CheckRecord from './Detail/CheckRecord';
import ExtraButton from '@/components/ExtraButton';
import FormCondition from '@/components/FormCondition';
import CheckRefuseDraw from './Detail/CheckRefuseDraw'

const SpecialGoodCheckDetail = (props) => {
  const {
    visible,
    onClose,
    onEdit,
    total,
    getDetail,
    loading,
    fetchSpecialGoodsVerify,
    dispatch,
    cRef
  } = props;
  const { show = false, index, detail = {}, status } = visible;
  const [merchantTaglist, setMerchantTaglist] = useState([]);
  const [platTaglist, setPlatTaglist] = useState([]);
  const [visibleRefuse,setVisibleRefuse] =useState(false)

  const [form] = Form.useForm();

  const handleEdit = () => {
    onClose(), onEdit();
  };

  useEffect(() => {
    getTagsMerchant();
    getTagsPlat();
  }, []);

  //获取商品标签
  const getTagsMerchant = () => {
    dispatch({
      type: 'goodsTag/fetchGoodsTagList',
      payload: {
        tagType: 'merchant',
      },
      callback: (list) => {
        setMerchantTaglist(list);
      },
    });
  };
  const getTagsPlat = () => {
    dispatch({
      type: 'goodsTag/fetchGoodsTagList',
      payload: {
        tagType: 'platform',
      },
      callback: (list) => setPlatTaglist(list),
    });
  };

  // 审核通过
  const handleVerifyAllow = () => {
    const { specialGoodsId, merchantIdStr } = detail;
    if (!form.getFieldValue('otherPlatformPrice')) {
      notification.info({
        message: '温馨提示',
        description: '请输入其他平台价格',
      });
    }
    form.validateFields().then((values) => {
      fetchSpecialGoodsVerify({ ...values, specialGoodsId, merchantIdStr, status: 1 });
    });
  };

  const btnList = [
    // {
    //   auth: 'edit',
    //   onClick: handleEdit,
    //   text: '编辑',
    //   show: ['1', '2'].includes(status),
    // },
    {
      auth: 'check',
      onClick: handleVerifyAllow,
      text: '审核通过',
      show: ['3'].includes(status),
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
        {['3'].includes(status) && (
          <Button
            style={{ marginLeft: 8 }}
            danger
            onClick={() =>
              setVisibleRefuse({
                show: true,
                detail: detail,
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

  const formCommission = [
    {
      label: `佣金总额`,
      name: 'commission',
      type: 'number',
      precision: 2,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
    },
    {
      label: '省代佣金',
      name: 'provinceFee',
      type: 'number',
      precision: 2,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
    },
    {
      label: '区县佣金',
      name: 'districtFee',
      type: 'number',
      precision: 2,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
    },
    {
      label: `哒人分佣金额`,
      name: 'darenFee',
      type: 'number',
      precision: 2,
      min: 0,
      max: 999999.99,
      formatter: (value) => `￥ ${value}`,
    },
  ];

  const formTagItem = [
    {
      label: '商家商品标签',
      type: 'tags',
      name: 'merchantParentFee',
      select: merchantTaglist,
      fieldNames: { label: 'tagName', value: 'configGoodsTagId' },
    },
    {
      label: '平台商品标签',
      name: 'userParentFee',
      type: 'tags',
      select: platTaglist,
      fieldNames: { label: 'tagName', value: 'configGoodsTagId' },
    },
  ];

  return (

    <DrawerCondition {...modalProps}>
      {/* 驳回原因 */}
      {status == '4' && <Alert message={`驳回原因：${detail.failureReason}`} type="error" banner />}
      {/* 信息展示 */}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="商品信息" key="1">
          <GoodsDetailForm detail={detail} form={form}></GoodsDetailForm>
        </Tabs.TabPane>
        <Tabs.TabPane tab="投放规则" key="2">
          <RegularDetail detail={detail}></RegularDetail>
        </Tabs.TabPane>
        <Tabs.TabPane tab="审核记录" key="3">
          <CheckRecord detail={detail}></CheckRecord>
        </Tabs.TabPane>
      </Tabs>

      {/* 审核时输入 其他平台价格 */}
      {status == '3' && (
        <>
          <FormCondition
            formItems={formItems}
            form={form}
            style={{ marginTop: 10 }}
          ></FormCondition>

          {/* 审核中并且分佣模板为手动分佣时 */}
          <div
            style={{ fontSize: 16, color: 'rgba(0,0,0,.85', margin: '10px 0', fontWeight: 'bold' }}
          >
            分佣配置
          </div>
          <FormCondition
            formItems={formCommission}
            form={form}
            style={{ marginTop: 10 }}
          ></FormCondition>
          <div
            style={{ fontSize: 16, color: 'rgba(0,0,0,.85', margin: '10px 0', fontWeight: 'bold' }}
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
      <CheckRefuseDraw cRef={cRef} visible={visibleRefuse} onClose={()=>setVisibleRefuse(false)} onCloseF={onClose}></CheckRefuseDraw>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['specialGoodsCheck/fetchSpecialGoodsAuditDetail'],
}))(SpecialGoodCheckDetail);
