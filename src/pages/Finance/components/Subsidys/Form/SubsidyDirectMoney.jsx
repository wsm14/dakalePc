import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { SUBSIDY_TASK_ROLE } from '@/common/constant';
import FormCondition from '@/components/FormCondition';
import MreSelect from './MreSelect';
import MreSelectShow from './MreSelectShow';

const SubsidyDirectMoney = (props) => {
  const { form, detail } = props;
  // 选择店铺弹窗
  const [visible, setVisible] = useState(false);
  // 选择店铺后回显的数据
  const [mreList, setMreList] = useState({ keys: [], list: [] });

  // 设置form表单值 商户id
  useEffect(() => {
    form.setFieldsValue({ merchantIds: mreList.keys.toString() });
  }, [mreList]);

  const formItems = [
    {
      label: '任务名称',
      name: 'taskName',
    },
    {
      label: '补贴角色',
      name: 'role',
      type: 'select',
      select: Object.keys(SUBSIDY_TASK_ROLE).map((item) => ({ name: SUBSIDY_TASK_ROLE[item], value: item })),
    },
    {
      label: '适用商户',
      name: 'merchantIds',
      type: 'childrenOwn',
      childrenOwn: (
        <Button type="primary" ghost onClick={() => setVisible(true)}>
          选择店铺
        </Button>
      ),
    },
    {
      label: '适用商户',
      type: 'noForm',
      childrenOwn: (
        <MreSelectShow
          key="MreTable"
          form={form}
          {...mreList}
          setMreList={setMreList}
        ></MreSelectShow>
      ),
    },
    {
      label: '充值卡豆数',
      name: 'rechargeBeans',
      type: 'number',
      precision: 0,
      min: 0,
      max: 999999999,
    },
  ];

  return (
    <>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
      <MreSelect
        keys={mreList.keys}
        visible={visible}
        onOk={(val) => setMreList(val)}
        onCancel={() => setVisible(false)}
      ></MreSelect>
    </>
  );
};

export default SubsidyDirectMoney;
