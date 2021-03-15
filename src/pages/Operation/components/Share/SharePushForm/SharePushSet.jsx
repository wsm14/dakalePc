import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { NUM_PATTERN } from '@/common/regExp';
import { SHARE_TIME_TYPE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';

/**
 * 发布设置
 */
const SharePushSet = (props) => {
  const { form, dispatch, loading, platformBean, detail } = props;

  const [totalBean, setTotalBean] = useState({ pnum: 0, bnum: 0 }); // 计算总卡豆
  const [promotionMoney, setPromotionMoney] = useState(0); // 服务费比例
  const [beanFlag, setBeanFlag] = useState(false); // 是否使用充值卡豆

  useEffect(() => {
    setTotalBean({ pnum: detail.personBeanAmount || 0, bnum: detail.beanAmount || 0 });
    setBeanFlag(detail.usePlatformBeanFlag);
    fetchShareGetPlatformBean();
    fetchPromotionMoneyGet();
  }, []);

  // 获取商家卡豆数
  const fetchShareGetPlatformBean = () => {
    dispatch({
      type: 'shareManage/fetchShareGetPlatformBean',
      payload: {
        merchantId: detail.merchantId,
      },
    });
  };

  // 行业推广费比例
  const fetchPromotionMoneyGet = () => {
    dispatch({
      type: 'sysTradeList/fetchPromotionMoneyGet',
      payload: {
        categoryId: detail.topCategoryId[0],
      },
      callback: (val) => setPromotionMoney(val.promotionFee),
    });
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const formItems = [
    {
      title: '卡豆打赏',
      label: '目标曝光量',
      name: 'personBeanAmount',
      suffix: '人',
      onChange: (e) => setTotalBean({ ...totalBean, pnum: Number(e.target.value) }),
      addRules: [{ pattern: NUM_PATTERN, message: '应为整数数字' }],
    },
    {
      label: '单次曝光打赏',
      name: 'beanAmount',
      suffix: '卡豆',
      onChange: (e) => setTotalBean({ ...totalBean, bnum: Number(e.target.value) }),
      addRules: [{ pattern: NUM_PATTERN, message: '应为整数数字' }],
    },
    {
      title: '时间设置',
      label: '投放时长',
      name: 'rewardCycle',
      type: 'radio',
      select: SHARE_TIME_TYPE,
    },
    {
      label: '时间选择',
      name: 'rewardStartTime',
      type: 'rangePicker',
    },
    {
      title: `投放总数 ${totalBean.pnum * totalBean.bnum}`,
      label: '平台预存卡豆',
      name: 'usePlatformBeanFlag',
      type: 'switch',
      loading: loading,
      onChange: setBeanFlag,
      extra: loading ? <Spin indicator={antIcon} /> : `可减${platformBean}卡豆`,
    },
  ];

  /**
   * 统计内容
   * 若勾选平台预存卡豆，则 实付 = (总需卡豆数 - 平台预存卡豆) * 推广费率 ，实时计算
   * 若未勾选平台预存卡豆，则 实付 = 总需卡豆数 * 推广费率
   * 推广费率的百分比按照运营后台行业的不同变化
   */
  const totalDom = () => {
    // 总数
    const allTotal = beanFlag
      ? totalBean.pnum * totalBean.bnum - Number(platformBean)
      : totalBean.pnum * totalBean.bnum;
    // 推广费率
    const freeNum = Number(promotionMoney) / 100;
    // 实付
    const payNum =
      beanFlag && Number(platformBean) > totalBean.pnum * totalBean.bnum
        ? 0
        : allTotal * (1 - freeNum);
    // 推广费
    const pMoney =
      beanFlag && Number(platformBean) > totalBean.pnum * totalBean.bnum ? 0 : allTotal * freeNum;
    return (
      <div style={{ width: '100%', backgroundColor: '#f6fbff', padding: 20, borderRadius: 5 }}>
        <div style={{ fontSize: 16 }}> 实付：{payNum}卡豆</div>
        <div>
          推广费（{promotionMoney}%）：{pMoney}卡豆
        </div>
        <div>余额：{platformBean}卡豆</div>
      </div>
    );
  };

  return (
    <FormCondition form={form} formItems={formItems} initialValues={detail}>
      {totalDom()}
    </FormCondition>
  );
};

export default connect(({ shareManage, loading }) => ({
  platformBean: shareManage.platformBean,
  loading: loading.effects['shareManage/fetchShareGetPlatformBean'],
}))(SharePushSet);
