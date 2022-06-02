import React, { useState, useEffect } from 'react';
import { SERVICE_TYPE, DIVISION_TEMPLATE_TYPE, COMMISSION_TYPE } from '@/common/constant';
import { NUM_PERCENTAGE } from '@/common/regExp';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';

const TemplateDetail = (props) => {
  const { visible, onClose, tabKey, tradeList } = props;
  const { show = false, detail = {} } = visible;
  detail.serviceType = tabKey;

  const [commissType, setCommissType] = useState(false);

  useEffect(() => {
    if (show) {
      setCommissType(detail.divisionTemplateType);
    }
  }, [show]);
  const formItems = [
    {
      label: '关联类目',
      name: 'classifyName',
      show: tabKey === 'commerceGoods',
    },
    {
      label: '关联行业',
      name: 'categoryName',
      show: tabKey !== 'commerceGoods',
    },
    {
      label: '类别',
      name: 'serviceType',
      render: (val) => SERVICE_TYPE[val],
    },
    {
      label: '分佣方式',
      name: 'divisionTemplateType',
      render: (val) => DIVISION_TEMPLATE_TYPE[val],
    },

    {
      label: '分佣比例', // 手动分佣需要展示
      name: 'differenceDivisionObjects',
      show: detail.divisionTemplateType === 'difference',
      render: (val, row) => {
        const COMMISSION_TYPE_new = { ...COMMISSION_TYPE[tabKey], platform: '平台分佣' };
        const { differenceDivisionObjects = {} } = row;
        return Object.keys(differenceDivisionObjects).map((key) => (
          <div key={key}>
            {COMMISSION_TYPE_new[key]}：{differenceDivisionObjects[key]}%
          </div>
        ));
      },
    },
    {
      label: '已勾选',
      name: 'manualDivisionObjects',
      show: detail.divisionTemplateType === 'manual',
      render: (val, row) => {
        const { manualDivisionObjects = [] } = row;
        return manualDivisionObjects.map((item) => <div key={item}>{COMMISSION_TYPE[item]}</div>);
      },
    },
    {
      label: '凭证',
      name: 'certificate',
      type: 'upload',
    },
  ];

  const modalProps = {
    visible: show,
    title: `模板详情`,
    onClose,
  };
  return (
    <DrawerCondition {...modalProps}>
      <DescriptionsCondition initialValues={detail} formItems={formItems}></DescriptionsCondition>
    </DrawerCondition>
  );
};
export default TemplateDetail;
