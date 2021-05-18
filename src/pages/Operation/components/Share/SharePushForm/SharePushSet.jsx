import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { NUM_INT } from '@/common/regExp';
import { SHARE_TIME_TYPE } from '@/common/constant';
import QuestionTooltip from '@/components/QuestionTooltip';
import FormCondition from '@/components/FormCondition';

/**
 * 发布设置
 */
const SharePushSet = (props) => {
  const { form, dispatch, loading, platformBean, detail } = props;

  const [totalBean, setTotalBean] = useState({ pnum: 0, bnum: 0 }); // 计算总卡豆
  const [promotionMoney, setPromotionMoney] = useState(0); // 服务费比例
  const [beanFlag, setBeanFlag] = useState(false); // 是否使用充值卡豆
  const [timeSelect, setTimeSelect] = useState(false); // 投放时长

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
        categoryId: detail.categoryNode[0],
      },
      callback: (val) => setPromotionMoney(val.promotionFee || 0),
    });
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const formItems = [
    {
      title: '打赏设置',
      label: '阅读时长',
      name: 'length',
      suffix: 's',
      disabled: true,
    },
    {
      title: '卡豆打赏',
      label: '投放时长',
      name: 'rewardCycle',
      type: 'radio',
      select: SHARE_TIME_TYPE,
      onChange: (e) => setTimeSelect(e.target.value),
    },
    {
      label: '时间选择',
      name: 'rewardStartTime',
      type: 'rangePicker',
      visible: timeSelect === '1',
    },
    {
      label: '单次曝光打赏',
      name: 'beanAmount',
      suffix: '卡豆/人',
      onChange: (e) => setTotalBean({ ...totalBean, bnum: Number(e.target.value) }),
      addRules: [{ pattern: NUM_INT, message: '应为大于0的整数数字' }],
    },
    {
      label: '目标曝光量',
      name: 'personBeanAmount',
      suffix: '人',
      onChange: (e) => setTotalBean({ ...totalBean, pnum: Number(e.target.value) }),
      addRules: [{ pattern: NUM_INT, message: '应为大于0的整数数字' }],
    },
    {
      title: `总需 ${totalBean.pnum * totalBean.bnum}卡豆`,
      label: (
        <QuestionTooltip
          placement="bottom"
          title="平台营销卡豆"
          overlayStyle={{ maxWidth: 300 }}
          content={`平台营销卡豆包含：
          1. 商家在账户激活后平台发放的启动营销卡豆；
          2. 商家邀请的家店激活成功后平台奖励给商家的卡豆；
          3. 其他平台根据活动情况发放给商家的卡豆。
        为防止商家将平台发放的营销卡豆用作他处（平台营销卡豆仅可用于商家发布视频/图文或邀请用户到店打卡），哒卡乐将限制「平台营销卡豆」可用于抵扣「打赏卡豆」的卡豆上限，该平台营销卡豆的最终解释权归哒卡乐所有。`}
        ></QuestionTooltip>
      ),
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
        : allTotal * (1 + freeNum);
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
