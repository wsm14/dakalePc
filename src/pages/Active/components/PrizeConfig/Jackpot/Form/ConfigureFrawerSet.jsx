import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { BLINDBOX_PRIZE_TYPE } from '@/common/constant';
import DrawerCondition from '@/components/DrawerCondition';
import FormComponents from '@/components/FormCondition';
import aliOssUpload from '@/utils/aliOssUpload';
import ShareCoupon from '../components/ShareCoupon/ShareCoupon';

const ConfigureFrawerSet = (props) => {
  const { visible, onClose, dispatch, loading, childRef } = props;
  const { show = false, type = 'add', detail = {} } = visible;
  const { prize = '', prizeType = 'bean' } = detail;
  const [form] = Form.useForm();
  const [prizeTypes, setPrizeTypes] = useState();

  useEffect(() => {
    if (show && prizeType === 'platformCoupon') {
      fetchSpecialGoodsList();
    }
  }, [show]);

  // 編輯根据券编号查找平台券回显数据
  const fetchSpecialGoodsList = (data) => {
    dispatch({
      type: 'baseData/fetchPlatformCouponSelect',
      payload: {
        couponStatus: 1,
        platformCouponId: prize,
        page: 1,
        limit: 10,
      },
      callback: (list) => {
        form.setFieldsValue({ platformGiftPackRelateList: list });
      },
    });
  };

  //保存
  const handleSave = () => {
    form.validateFields().then(async (values) => {
      const {
        winPrizeImg,
        prize,
        prizeImg,
        prizeType,
        isJoinLuck,
        prizeName,
        platformGiftPackRelateList = [],
        ...other
      } = values;
      // 上传图片到oss -> 提交表单
      const winningImgList = await aliOssUpload(winPrizeImg);
      const prizeImgList = await aliOssUpload(prizeImg);
      let pName = '';
      let prizeNew = '';
      if (prizeType === 'platformCoupon') {
        pName = platformGiftPackRelateList[0].couponName;
        prizeNew = platformGiftPackRelateList[0].platformCouponId;
      } else if (prizeType === 'none') {
        pName = '谢谢惠顾';
      } else {
        pName = `${BLINDBOX_PRIZE_TYPE[prizeType]}*${prize}`;
      }
      dispatch({
        type: { add: 'prizeConfig/fetchAddPrizePool', edit: 'prizeConfig/fetchUpdatePrizePool' }[
          type
        ],
        payload: {
          ...other,
          prizeType,
          prizeTypeName:BLINDBOX_PRIZE_TYPE[prizeType],
          //卡豆，星豆，肥料，抽奖次数，成长值 prizeName（奖品名称）为prizeTypeName和prize（奖品卡豆数/数量）拼接值，2，平台券prizeName取券名称，prize 取券ID、谢谢惠顾prizeName与prize均为谢谢惠顾
          prizeName: [
            'platformCoupon',
            'none',
            'bean',
            'starBean',
            'growValue',
            'luckDrawChance',
            'manure',
          ].includes(prizeType)
            ? pName
            : prizeName,
          prize: ['platformCoupon'].includes(prizeType) ? prizeNew : prize,
          winPrizeImg: winningImgList.toString(),
          prizeImg: prizeImgList.toString(),
          isJoinLuck: isJoinLuck ? Number(isJoinLuck) : 0,
          luckPrizeIdStr: detail?.luckPrizeIdStr,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const modalProps = {
    visible: show,
    title: type === 'edit' ? '编辑' : '新增',
    onClose,
    afterCallBack: () => {
      setPrizeTypes(prizeType);
      form.setFieldsValue({ prizeType: prizeType });
    },
    footer: (
      <Button
        type="primary"
        onClick={handleSave}
        loading={
          loading.effects['prizeConfig/fetchAddPrizePool'] ||
          loading.effects['prizeConfig/fetchUpdatePrizePool']
        }
      >
        保存
      </Button>
    ),
  };
  const formItems = useMemo(
    () => [
      {
        label: '奖励类型',
        name: 'prizeType',
        type: 'radio',
        select: BLINDBOX_PRIZE_TYPE,
        disabled: type === 'edit',
        onChange: (val) => {
          form.setFieldsValue({ prize: '', prizeName: '' });
          setPrizeTypes(val.target.value);
        },
      },
      {
        label: '商品名称',
        name: 'prizeName',
        disabled: type === 'edit',
        visible: ['rightGood', 'commerce', 'actualGoods'].includes(prizeTypes),
      },
      {
        label: '卡豆数',
        name: 'prize',
        type: 'number',
        suffix: '卡豆',
        disabled: type === 'edit',
        visible: prizeTypes === 'bean',
      },
      {
        label: '数量',
        name: 'prize',
        type: 'number',
        disabled: type === 'edit',
        visible: ['starBean', 'growValue', 'luckDrawChance', 'manure'].includes(prizeTypes),
      },
      {
        label: '选择券',
        name: 'platformGiftPackRelateList',
        type: 'formItem',
        visible: prizeTypes === 'platformCoupon',
        required: true,
        formItem: (
          <>
            <ShareCoupon
              type="platformGiftPackRelateList"
              handleType={type}
              form={form}
            ></ShareCoupon>
          </>
        ),
      },
      {
        label: '中奖图',
        type: 'upload',
        name: 'winPrizeImg',
        maxFile: 1,
      },
      {
        label: '奖品图',
        type: 'upload',
        name: 'prizeImg',
        maxFile: 1,
      },
      {
        label: '是否真实奖品',
        name: 'isJoinLuck',
        type: 'switch',
      },
    ],
    [type, prizeTypes],
  );
  return (
    <DrawerCondition {...modalProps}>
      <FormComponents form={form} formItems={formItems} initialValues={detail}></FormComponents>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading,
}))(ConfigureFrawerSet);
