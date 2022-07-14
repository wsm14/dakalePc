import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Form, Button } from 'antd';
import { ChromePicker } from 'react-color';
import { MODE_TYPE } from '@/common/constant';
import CITYJSON from '@/common/cityJson';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import ShareCoupon from './components/ShareCoupon';
import styles from './style.less';

const AddNewActivitySet = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;
  const {
    show = false,
    mode,
    detail = { rightGoods: [], prizeType: 'bean', areaType: 'all' },
  } = visible;
  const { configFissionTemplateId } = detail;

  const [form] = Form.useForm();
  const prizeTypes = Form.useWatch('prizeType', form) || 'bean'; // 奖品类型
  const areaType = Form.useWatch('areaType', form) || 'all'; // 活动城市类型

  const [color, setColor] = useState(''); //  背景色状态
  const [selectGoodsData, setSelectGoodsData] = useState({}); // 商品信息
  const [displayColorPicker, setDisplayColorPicker] = useState(false); //  背景色选择面板状态

  // 新增活动
  const fetchAddNewActivityAdd = () => {
    form.validateFields().then(async (values) => {
      const {
        cityCode,
        prizeBean,
        issuedQuantity,
        mainImg = '',
        prizeImg = '',
        shareImg = '',
        friendShareImg = '',
        introductionImg = '',
        activityBeginTime: time,
        ...other
      } = values;

      const mImg = await aliOssUpload(mainImg);
      const pImg = await aliOssUpload(prizeImg);
      const sImg = await aliOssUpload(shareImg);
      const fImg = await aliOssUpload(friendShareImg);
      const iImg = await aliOssUpload(introductionImg);

      dispatch({
        type: {
          add: 'addNewActivity/fetchMarketAddNewActivityAdd',
          edit: 'addNewActivity/fetchMarketAddNewActivityEdit',
        }[mode],
        payload: {
          ...other,
          cityCode: cityCode || 'all',
          configFissionTemplateId,
          backgroundColor: color,
          prizeBean: Number(prizeBean) || undefined,
          issuedQuantity: Number(issuedQuantity) || undefined,
          activityBeginTime: moment(time[0]).format('YYYY-MM-DD HH:mm'),
          activityEndTime: moment(time[1]).format('YYYY-MM-DD HH:mm'),
          mainImg: mImg.toString(),
          prizeImg: pImg.toString(),
          shareImg: sImg.toString(),
          friendShareImg: fImg.toString(),
          introductionImg: iImg.toString(),
          prizeId: selectGoodsData?.goodsId || undefined,
        },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  const handleChange = ({ hex }) => setColor(hex);

  const formItems = [
    {
      label: '活动城市',
      name: 'areaType',
      type: 'radio',
      disabled: mode === 'edit',
      select: { all: '全国', city: '指定城市' },
    },
    {
      label: '活动城市',
      name: 'cityCode',
      type: 'select',
      disabled: mode === 'edit',
      visible: areaType === 'city',
      select: CITYJSON.filter((item) => item.level === '2'),
      fieldNames: { label: 'name', value: 'id' },
    },
    {
      label: '活动名称',
      name: 'name',
      maxLength: 15,
    },
    {
      label: '邀请条件',
      type: 'number',
      name: 'inviteNum',
      disabled: mode === 'edit',
      suffix: '位用户即可获奖',
      formatter: (value) => `邀请 ${value}`,
      parser: (value) => value.replace('邀请', ''),
    },
    {
      label: '活动时间',
      type: 'rangePicker',
      name: 'activityBeginTime',
      showTime: true,
      format: 'YYYY-MM-DD HH:mm',
      disabledDate: (time) => time && time < moment().endOf('day').subtract(1, 'day'),
    },
    {
      label: '活动规则',
      name: 'activityRuleUrl',
      placeholder: '请输入链接',
      addRules: [
        {
          type: 'url',
          message: '请输入正确链接格式',
        },
      ],
    },
    {
      title: '图片配置',
      label: '活动主页图',
      type: 'upload',
      name: 'mainImg',
      imgRatio: 750 / 600,
      extra: '请上传750*600px的jpg、png图片',
      maxFile: 1,
    },
    {
      label: '分享海报图',
      type: 'upload',
      name: 'shareImg',
      imgRatio: 750 / 1334,
      extra: '请上传750*1334px的jpg、png图片',
      maxFile: 1,
    },
    {
      label: '小程序分享图',
      type: 'upload',
      name: 'friendShareImg',
      imgRatio: 5 / 4,
      maxSize: 128,
      extra: '请上传比例为5*4，大小128kb以内的jpg图片（375*300以上）',
      maxFile: 1,
    },
    {
      label: '奖品图',
      type: 'upload',
      name: 'prizeImg',
      imgRatio: 600 / 240,
      extra: '请上传600*240px的jpg、png图片',
      maxFile: 1,
    },
    {
      label: '活动介绍图',
      type: 'upload',
      name: 'introductionImg',
      imgRatio: 686 / 800,
      extra: '请上传686*800px的jpg、png图片',
      maxFile: 1,
      rules: [{ required: false }],
    },
    {
      label: `背景色`,
      type: 'formItem',
      required: true,
      addRules: [
        {
          validator: () => {
            if (!color) {
              return Promise.reject(`请选择背景色`);
            }
            return Promise.resolve();
          },
        },
      ],
      formItem: (
        <div>
          <div className={styles.color_swatch} onClick={() => setDisplayColorPicker(true)}>
            <div className={styles.color_box} style={{ background: color }} />
          </div>
          {displayColorPicker && (
            <div className={styles.color_popover}>
              <div className={styles.color_cover} onClick={() => setDisplayColorPicker(false)} />
              <ChromePicker color={color} disableAlpha={true} onChange={handleChange} />
            </div>
          )}
        </div>
      ),
    },
    {
      label: '领奖成功跳转路径',
      type: 'select',
      name: 'successfulJumpUrl',
      rules: [{ required: false }],
      select: {
        blindIndex: '卡豆盲盒',
        userNewArtist: '新手福利页',
      },
    },
    {
      label: '奖品类型',
      name: 'prizeType',
      type: 'radio',
      disabled: mode === 'edit',
      select: { bean: '卡豆', commerce: '电商品', platformCoupon: '平台券' },
      onChange: () => setSelectGoodsData({}),
    },
    {
      label: '卡豆',
      name: 'prizeBean',
      placeholder: '请输入奖励卡豆数',
      visible: prizeTypes === 'bean',
    },
    {
      label: '商品',
      required: true,
      type: 'formItem',
      visible: ['commerce', 'platformCoupon'].includes(prizeTypes),
      addRules: [
        {
          validator: () => {
            if (!selectGoodsData.specialGoodsId) {
              return Promise.reject(`请选择商品`);
            }
            return Promise.resolve();
          },
        },
      ],
      formItem: (
        <ShareCoupon
          type={prizeTypes == 'commerce' ? 'commerceGoods' : 'platformCoupon'}
          data={selectGoodsData}
          onDel={() => setSelectGoodsData({})}
          onOk={(data) => setSelectGoodsData(data)}
        ></ShareCoupon>
      ),
    },
    {
      label: '发放数量',
      name: 'issuedQuantity',
    },
  ];

  const modalProps = {
    title: `${MODE_TYPE[mode]}活动`,
    visible: show,
    onClose,
    width: 700,
    afterCallBack: () => {
      setColor(detail.backgroundColor);
      setSelectGoodsData(detail.goodDetail || {});
    },
    closeCallBack: () => {
      setSelectGoodsData({});
      form.resetFields();
    },
    footer: (
      <Button type="primary" onClick={fetchAddNewActivityAdd} loading={loading}>
        确定
      </Button>
    ),
  };
  return (
    <DrawerCondition {...modalProps}>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
    </DrawerCondition>
  );
};

export default connect(({ loading }) => ({
  loading:
    loading.effects['addNewActivity/fetchMarketAddNewActivityAdd'] ||
    loading.effects['addNewActivity/fetchMarketAddNewActivityEdit'],
}))(AddNewActivitySet);
