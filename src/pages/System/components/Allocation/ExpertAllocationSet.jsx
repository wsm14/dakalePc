import React from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { NUM_PATTERN } from '@/common/regExp';
import { EXPERT_TYPE, EXPERT_IS_WITHDRAW } from '@/common/constant';
import { checkFileData } from '@/utils/utils';
import { LEVEL_ICON, UP_LEVEL_ICON } from '@/common/imgRatio';
import aliOssUpload from '@/utils/aliOssUpload';
import FormCondition from '@/components/FormCondition';
import DrawerCondition from '@/components/DrawerCondition';

const ExpertAllocationSet = (props) => {
  const { visible, childRef, dispatch, onClose, loading } = props;

  const { type = 'add', show = false, detail = {} } = visible;

  const [form] = Form.useForm();

  // 哒人非必填 豆长为必填
  const fromRule = detail.type === 'douzhang';

  // 用户身份 表单显示
  const fromShow = detail.type === 'normal';

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const {
        levelExtraParamObject,
        certificate,
        teamCommission = 0,
        shareCommission = 0,
      } = values;
      const { levelIcon, upLevelIcon } = levelExtraParamObject;
      aliOssUpload([
        ...checkFileData(levelIcon),
        ...checkFileData(upLevelIcon),
        ...checkFileData(certificate),
      ]).then((res) => {
        dispatch({
          type: {
            add: 'expertAllocation/fetchExpertAllocationSave',
            edit: 'expertAllocation/fetchExpertAllocationEdit',
          }[type],
          payload: {
            ...values,
            shareCommission,
            teamCommission,
            userLevelId: detail.userLevelId,
            level: detail.level,
            nextLevel: detail.nextLevel,
            certificate: res.slice(2).toString(),
            levelExtraParamObject: {
              ...levelExtraParamObject,
              levelIcon: res.slice(0, 1).toString(),
              upLevelIcon: res.slice(1, 2).toString(),
            },
          },
          callback: () => {
            onClose();
            childRef.current.fetchGetData();
          },
        });
      });
    });
  };

  const formItems = [
    {
      label: '所属身份',
      name: 'levelKey',
      type: 'select',
      select: EXPERT_TYPE,
      disabled: true,
    },
    {
      label: `${fromShow ? '所属等级' : '等级名称'}`,
      name: 'levelName',
      disabled: fromShow,
    },
    {
      label: '等级图标',
      name: ['levelExtraParamObject', 'levelIcon'],
      type: 'upload',
      maxFile: 1,
      imgRatio: LEVEL_ICON,
    },
    {
      title: '升级条件',
      label: '升级图标',
      name: ['levelExtraParamObject', 'upLevelIcon'],
      type: 'upload',
      maxFile: 1,
      imgRatio: UP_LEVEL_ICON,
      visible: !fromShow,
    },
    {
      label: '直推用户数',
      name: ['userLevelTargetObject', 'normal'],
      suffix: '人',
      addRules: [{ pattern: NUM_PATTERN, message: '直推用户数应为整数' }],
      visible: !fromShow,
    },
    {
      label: '直推哒人数',
      name: ['userLevelTargetObject', 'daren'],
      suffix: '人',
      rules: [
        { required: fromRule, message: `请确认直推哒人数` },
        { pattern: NUM_PATTERN, message: '直推哒人数应为整数' },
      ],
      visible: !fromShow,
    },
    {
      title: '升级要求',
      label: '核销笔数要求',
      name: ['userLevelTargetObject', 'verificationCount'],
      suffix: '笔',
      rules: [{ required: false }],
      addRules: [{ pattern: NUM_PATTERN, message: '核销笔数应为整数' }],
      visible: !fromShow,
    },
    {
      label: '业绩流水要求',
      name: ['userLevelTargetObject', 'performance'],
      suffix: '元',
      rules: [{ required: false }],
      addRules: [{ pattern: NUM_PATTERN, message: '业绩流水应为整数' }],
      visible: !fromShow,
    },
    {
      title: '升级权益',
      label: '自购/分销奖励',
      name: 'shareCommission',
      suffix: '%',
      addRules: [{ pattern: NUM_PATTERN, message: '自购/分销奖励应为整数' }],
      visible: !fromShow,
    },
    {
      label: '团队奖励比例',
      name: 'teamCommission',
      suffix: '%',
      rules: [
        { required: fromRule, message: `请确认团队奖励比例` },
        { pattern: NUM_PATTERN, message: '团队奖励比例应为整数数字' },
        {
          validator: (rule, value) => {
            const shareCommission = form.getFieldValue('shareCommission');
            if (Number(value) > Number(shareCommission)) {
              return Promise.reject('不能高于自购/分销奖励');
            }
            return Promise.resolve();
          },
        },
      ],
      visible: !fromShow,
    },
    {
      title: fromShow ? '升级权益' : '',
      label: '消费抵扣(卡豆)',
      name: 'payBeanCommission',
      suffix: '%',
      addRules: [{ pattern: NUM_PATTERN, message: '消费抵扣数应为整数' }],
    },
    {
      label: '解锁奖励(卡豆)',
      name: 'unlockRewardsBean',
      rules: [{ required: false }],
      visible: !fromShow,
      addRules: [{ pattern: NUM_PATTERN, message: '解锁奖励数应为整数' }],
    },
    {
      label: '可否提现',
      name: 'isWithdraw',
      type: 'radio',
      select: EXPERT_IS_WITHDRAW,
    },
    {
      title: '月度奖金',
      label: '核销笔数要求',
      name: ['userLevelMonthBonusObject', 'verificationNum'],
      suffix: '笔',
      rules: [{ required: false }],
      addRules: [{ pattern: NUM_PATTERN, message: '核销笔数应为整数' }],
      visible: !fromShow,
    },
    {
      label: '业绩流水要求',
      name: ['userLevelMonthBonusObject', 'performanceFlow'],
      suffix: '元',
      rules: [{ required: false }],
      addRules: [{ pattern: NUM_PATTERN, message: '业绩流水应为整数' }],
      visible: !fromShow,
    },
    {
      label: '业绩达标奖金',
      name: ['userLevelMonthBonusObject', 'performanceBonus'],
      suffix: '元',
      rules: [{ required: false }],
      addRules: [{ pattern: NUM_PATTERN, message: '业绩达标奖金应为整数' }],
      visible: !fromShow,
    },
    {
      title: '激励语',
      label: '激励语',
      name: ['levelExtraParamObject', 'nextLevelInfo'],
      visible: !fromShow,
    },
    {
      title: '上传凭证',
      label: '凭证',
      name: 'certificate',
      type: 'upload',
      maxFile: 1,
      visible: !fromShow,
    },
    {
      title: '激励语',
      label: '1人激励语',
      name: ['levelExtraParamObject', 'processInfo', 0],
      visible: fromShow,
    },
    {
      label: '2人激励语',
      name: ['levelExtraParamObject', 'processInfo', 1],
      visible: fromShow,
    },
    {
      label: '3人激励语',
      name: ['levelExtraParamObject', 'processInfo', 2],
      visible: fromShow,
    },
    {
      label: '4人激励语',
      name: ['levelExtraParamObject', 'processInfo', 3],
      visible: fromShow,
    },
    {
      label: '5人激励语',
      name: ['levelExtraParamObject', 'processInfo', 4],
      visible: fromShow,
    },
    {
      label: '升级激励语',
      name: ['levelExtraParamObject', 'nextLevelInfo'],
      visible: fromShow,
    },
  ];

  const modalProps = {
    title: {
      add: `新增 - ${EXPERT_TYPE[detail.type]}`,
      edit: '修改',
    }[type],
    visible: show,
    onClose,
    footer: (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition initialValues={detail} formItems={formItems} form={form} />
    </DrawerCondition>
  );
};

export default connect(({ puzzleAd, loading }) => ({
  adRoot: puzzleAd.adRoot,
  loading:
    loading.effects['expertAllocation/fetchExpertAllocationSave'] ||
    loading.effects['expertAllocation/fetchExpertAllocationEdit'],
}))(ExpertAllocationSet);
