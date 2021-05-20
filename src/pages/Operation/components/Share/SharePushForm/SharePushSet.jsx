import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Spin, Alert, Button } from 'antd';
import { LoadingOutlined, ExclamationCircleFilled, SyncOutlined } from '@ant-design/icons';
import { NUM_INT } from '@/common/regExp';
import { SHARE_TIME_TYPE } from '@/common/constant';
import QuestionTooltip from '@/components/QuestionTooltip';
import FormCondition from '@/components/FormCondition';

/**
 * 发布设置
 */
const SharePushSet = (props) => {
  const {
    form,
    dispatch,
    loading,
    setAllowPush,
    getMerchantIdInfo,
    platformBean,
    promotionFee,
    bean,
    ruleBean,
    detail,
  } = props;

  const [totalBean, setTotalBean] = useState({ pnum: 0, bnum: 0 }); // 计算总卡豆
  const [beanFlag, setBeanFlag] = useState(false); // 是否使用充值卡豆
  const [timeSelect, setTimeSelect] = useState(false); // 投放时长

  useEffect(() => {
    setTotalBean({ pnum: detail.beanPersonAmount || 0, bnum: detail.beanAmount || 0 });
    setBeanFlag(detail.usePlatformBeanFlag);
    setTimeSelect(detail.rewardCycle);
    fetchGetSubsidyRoleBean();
  }, []);

  // 获取行业规则下卡豆数
  const fetchGetSubsidyRoleBean = () => {
    dispatch({
      type: 'baseData/fetchGetSubsidyRoleBean',
      payload: {
        categoryId: detail.categoryNode[0],
        subsidyRole: 'merchant',
        subsidyType: 'video',
      },
    });
  };

  // 定时投放不超过当前时间31天
  const disabledDate = (current) =>
    (current && current < moment().endOf('day').subtract(1, 'day')) ||
    current > moment().add(31, 'days');

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
      name: 'beanPersonAmount',
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
      checkedChildren: `${platformBean}卡豆`,
      unCheckedChildren: `${platformBean}卡豆`,
      loading,
      onChange: setBeanFlag,
      extra: `可减${totalBean.pnum * (totalBean.bnum > ruleBean ? ruleBean : totalBean.bnum)}卡豆`,
    },
    {
      title: '发布设置',
      label: '定时发布（可选）',
      name: 'timedPublishTime',
      type: 'dataPicker',
      visible: timeSelect === '0',
      rules: [{ required: false }],
      format: 'YYYY-MM-DD HH:mm',
      showTime: true,
      disabledDate,
    },
  ];

  /**
   * 统计内容
   * 若勾选平台预存卡豆，则 实付 = (总需卡豆数 - 可减卡豆) *(1 + 推广费率) ，实时计算
   * 若未勾选平台预存卡豆，则 实付 = 总需卡豆数 * 推广费率
   * 推广费率的百分比按照运营后台行业的不同变化
   */
  const totalDom = () => {
    const bnum = totalBean.bnum > ruleBean ? ruleBean : totalBean.bnum; // 单次打赏实际计算数值
    const allPay = totalBean.pnum * totalBean.bnum; // 总需卡豆数
    const rulePay = totalBean.pnum * bnum; // 可减卡豆数
    const freeNum = Number(promotionFee) / 100; // 推广费率
    const nowPayNum = beanFlag ? allPay - rulePay : allPay; // 实际需要卡豆
    const payNum = nowPayNum > 0 ? nowPayNum * (1 + freeNum) : 0; // 实付
    const pMoney = nowPayNum * freeNum; // 推广费
    const pushStatus = payNum > bean; // 是否允许发布
    setAllowPush(pushStatus);
    return (
      <Alert
        style={{ height: 90 }}
        message={
          <div>
            <div style={{ fontSize: 16 }}> 实付：{payNum.toFixed(0)}卡豆</div>
            <div>
              推广费（{promotionFee}%）：{pMoney.toFixed(0)}卡豆
            </div>
            <div>余额：{loading ? <Spin indicator={antIcon} size="small" /> : `${bean}卡豆`}</div>
          </div>
        }
        action={
          pushStatus ? (
            <span>
              <ExclamationCircleFilled style={{ margin: '5px 5px 0 0', color: '#ff4d4f' }} />
              卡豆不足！请先联系商家充值或平台补贴卡豆。
              <div style={{ textAlign: 'center', marginTop: 5 }}>
                <Button
                  type="primary"
                  icon={<SyncOutlined />}
                  onClick={() => getMerchantIdInfo(detail.merchantId)}
                  loading={loading}
                >
                  刷新余额/平台补贴卡豆数
                </Button>
              </div>
            </span>
          ) : (
            ''
          )
        }
        type={pushStatus ? 'error' : 'success'}
      />
    );
  };

  return (
    <FormCondition form={form} formItems={formItems} initialValues={detail}>
      {totalDom()}
    </FormCondition>
  );
};

export default connect(({ shareManage, baseData, loading }) => ({
  ruleBean: baseData.ruleBean,
  platformBean: shareManage.platformBean,
  bean: shareManage.bean,
  promotionFee: shareManage.promotionFee,
  loading:
    loading.effects['shareManage/fetchShareGetPlatformBean'] ||
    loading.effects['shareManage/fetchShareGetAccountBean'],
}))(SharePushSet);
