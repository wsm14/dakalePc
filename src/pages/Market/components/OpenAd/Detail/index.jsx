import React from 'react';
import { BANNER_JUMP_TYPE } from '@/common/constant';
import DescriptionsCondition from '@/components/DescriptionsCondition';

const OpenAdForm = (props) => {
  const { detail = {} } = props;

  const formItems = [
    {
      label: '广告主名',
      name: 'launchOwner',
    },
    {
      label: '广告内容',
      type: 'upload',
      name: 'url',
    },
    {
      label: '广告说明',
      name: 'launchDesc',
    },
    {
      label: '展示时间',
      name: 'startDate',
      render: (val) => `${val} ~ ${detail.endDate}`,
    },
    {
      label: '跳转事件',
      name: 'jumpUrlType',
      render: (val) => BANNER_JUMP_TYPE[val],
    },
    {
      label: '跳转内容',
      name: 'jumpUrl',
      show: !!detail.jumpUrlType,
      render: (val, row) => {
        const { jumpUrlType, nativeJumpName, param = {} } = row;
        return {
          H5: val,
          inside: `${nativeJumpName}${param.scenesName ? ' -' + param.scenesName : ''}`,
        }[jumpUrlType];
      },
    },
  ];

  return <DescriptionsCondition initialValues={detail} formItems={formItems} />;
};

export default OpenAdForm;
