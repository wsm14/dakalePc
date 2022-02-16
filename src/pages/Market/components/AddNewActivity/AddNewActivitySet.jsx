import moment from 'moment';
import aliOssUpload from '@/utils/aliOssUpload';
import React, { useState } from 'react';
import { connect } from 'umi';
import { Form, Button, Tabs } from 'antd';
import reactCSS from 'reactcss';
import { ChromePicker } from 'react-color';
import CITYJSON from '@/common/cityJson';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';
import ShareCoupon from './components/ShareCoupon';

const AddNewActivitySet = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;
  const {
    show = false,
    type,
    detail = { specialGoods: [], rightGoods: [], prizeType: 'bean', configFissionTemplateId: '' },
  } = visible;
  const { configFissionTemplateId = '', prizeType, goodsRightInfo } = detail;

  const { TabPane } = Tabs;
  const [form] = Form.useForm();
  const [tabKey, setTabKey] = useState('1'); // tab
  const [prizeTypes, setPrizeTypes] = useState('bean'); // 奖品类型
  const [cityArr, setCityArr] = useState({});
  const [displayColorPicker, setDisplayColorPicker] = useState(false); //  背景色状态
  const [color, setColor] = useState(''); //  背景色状态
  const [couponData, setCouponData] = useState({}); // 奖品权益商品的信息

  // 新增活动
  const fetchAddNewActivityAdd = () => {
    form.validateFields().then(async (values) => {
      // console.log(values);
      // return;
      const {
        specialGoods,
        rightGoods,
        mainImg = '',
        shareImg = '',
        friendShareImg = '',
        prizeImg = '',
        introductionImg = '',
        specialGoodsTitleImg = '',
        rightGoodsTitleImg = '',
        prizeBean,
        issuedQuantity,
        activityBeginTime: time,
        ...other
      } = values;
      const mImg = await aliOssUpload(mainImg);
      const sImg = await aliOssUpload(shareImg);
      const fImg = await aliOssUpload(friendShareImg);
      const pImg = await aliOssUpload(prizeImg);
      const iImg = await aliOssUpload(introductionImg);
      const sTitleImg = await aliOssUpload(specialGoodsTitleImg);
      const rTitleImg = await aliOssUpload(rightGoodsTitleImg);
      const newActivity = {
        add: 'addNewActivity/fetchMarketAddNewActivityAdd',
        edit: 'addNewActivity/fetchMarketAddNewActivityEdit',
      }[type];
      const payload = {
        ...other,
        backgroundColor: color,
        cityCode: cityArr.cityCode,
        activityBeginTime: moment(time[0]).format('YYYY-MM-DD HH:mm'),
        activityEndTime: moment(time[1]).format('YYYY-MM-DD HH:mm'),
        prizeRightGoodsIds: couponData?.specialGoodsId || undefined,
        issuedQuantity: Number(issuedQuantity) || undefined,
        prizeBean: Number(prizeBean) || undefined,
        mainImg: mImg.toString(),
        shareImg: sImg.toString(),
        friendShareImg: fImg.toString(),
        prizeImg: pImg.toString(),
        introductionImg: iImg.toString(),
        specialGoodsTitleImg: sTitleImg.toString(),
        rightGoodsTitleImg: rTitleImg.toString(),
        specialGoodsIds: specialGoods.map((item) => item.specialGoodsId).toString(),
        rightGoodsIds: rightGoods.map((item) => item.specialGoodsId).toString(),
      };
      console.log('payload', payload);
      dispatch({
        type: newActivity,
        payload:
          type === 'add'
            ? payload
            : {
                ...payload,
                configFissionTemplateId,
              },
        callback: () => {
          onClose();
          childRef.current.fetchGetData();
        },
      });
    });
  };

  // 切换tab标签页
  function callback(key) {
    setTabKey(key);
  }

  const styles = reactCSS({
    default: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `${color}`,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  const handleChange = ({ hex }) => {
    setColor(hex);
  };

  const formItems = [
    {
      label: '活动城市',
      name: 'cityCode',
      type: 'select',
      disabled: type === 'edit',
      select: CITYJSON.filter((item) => item.level === '2'),
      fieldNames: { label: 'name', value: 'id' },
      onChange: (val, group) =>
        // console.log(group, 'group'),
        setCityArr({
          cityCode: group.option.id,
          cityName: group.option.name,
        }),
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
      disabled: type === 'edit',
      suffix: '位用户即可获奖',
      formatter: (value) => `邀请 ${value}`,
      parser: (value) => value.replace('邀请', ''),
    },
    {
      label: '活动时间',
      type: 'rangePicker',
      name: 'activityBeginTime',
      end: 'activityEndTime',
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
          <div style={styles.swatch} onClick={() => setDisplayColorPicker(true)}>
            <div style={styles.color} />
          </div>
          {displayColorPicker ? (
            <div style={styles.popover}>
              <div style={styles.cover} onClick={() => setDisplayColorPicker(false)} />
              <ChromePicker color={color} disableAlpha={true} onChange={handleChange} />
            </div>
          ) : null}
        </div>
      ),
    },
    {
      label: '领奖成功跳转路径',
      type: 'select',
      name: 'successfulJumpUrl',
      select: {
        blindIndex: '卡豆盲盒',
        userNewArtist: '新手福利页',
      },
    },
    {
      label: '奖品类型',
      name: 'prizeType',
      type: 'radio',
      disabled: type === 'edit',
      select: { bean: '卡豆', rightGoods: '权益商品' },
      onChange: (e) => {
        console.log('e', e);
        setPrizeTypes(e.target.value);
      },
    },
    {
      label: '卡豆',
      name: 'prizeBean',
      placeholder: '请输入奖励卡豆数',
      visible: prizeTypes === 'bean',
    },
    {
      label: '权益商品',
      required: true,
      // name: 'prizeRightGoodsIds',
      type: 'formItem',
      visible: prizeTypes === 'rightGoods',
      addRules: [
        {
          validator: () => {
            if (!couponData.specialGoodsId) {
              return Promise.reject(`请选择权益商品`);
            }
            return Promise.resolve();
          },
        },
      ],
      formItem: (
        <>
          <ShareCoupon
            type="goodsRight"
            data={couponData}
            form={form}
            onDel={() => setCouponData({})}
            onOk={(free) => setCouponData(free)}
          ></ShareCoupon>
        </>
      ),
    },
    {
      label: '发放数量',
      name: 'issuedQuantity',
    },
  ];

  const formItemsRecommend = [
    {
      title: '标题图片配置',
      label: '特惠商品标题图片',
      name: 'specialGoodsTitleImg',
      type: 'upload',
      maxFile: 1,
      imgRatio: 368 / 110,
      rules: [{ required: false }],
    },
    {
      label: '权益商品标题图片',
      name: 'rightGoodsTitleImg',
      type: 'upload',
      maxFile: 1,
      imgRatio: 368 / 110,
      rules: [{ required: false }],
    },
    {
      label: '选择特惠商品',
      name: 'specialGoodsIds',
      type: 'formItem',
      // required: true,
      formItem: (
        <>
          <ShareCoupon type="specialGoods" form={form}></ShareCoupon>
        </>
      ),
    },
    {
      label: '选择权益商品',
      name: 'rightGoodsIds',
      type: 'formItem',
      // required: true,
      formItem: (
        <>
          <ShareCoupon type="rightGoods" form={form}></ShareCoupon>
        </>
      ),
    },
  ];

  const modalProps = {
    title: `新增活动`,
    visible: show,
    onClose,
    width: 800,
    afterCallBack: () => {
      setPrizeTypes(prizeType);
      setColor(detail.backgroundColor);
      setCouponData(goodsRightInfo);
    },
    closeCallBack: () => {
      setTabKey('1');
      setCouponData({});
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
      <Tabs activeKey={tabKey} onChange={callback}>
        <TabPane tab="活动配置" forceRender={true} key="1">
          <FormCondition
            form={form}
            formItems={formItems}
            initialValues={{ ...detail, cityName: detail.cityCode }}
          ></FormCondition>
        </TabPane>
        <TabPane tab="推荐商品" forceRender={true} key="2">
          <FormCondition
            form={form}
            formItems={formItemsRecommend}
            initialValues={detail}
          ></FormCondition>
        </TabPane>
      </Tabs>
    </DrawerCondition>
  );
};

export default connect(({ addNewActivity, loading }) => ({
  loading:
    loading.effects['addNewActivity/fetchMarketAddNewActivityAdd'] ||
    loading.effects['addNewActivity/fetchMarketAddNewActivityEdit'],
}))(AddNewActivitySet);
