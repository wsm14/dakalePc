import React, { useState, useEffect } from 'react';
import lodash from 'lodash';
import { Button, InputNumber } from 'antd';
import { MreSelect, MreSelectShow } from '@/components/MerUserSelectTable';
import FormCondition from '@/components/FormCondition';

const SubsidyRecycleBean = (props) => {
  const { form, detail } = props;

  const [visible, setVisible] = useState(false); // 选择店铺弹窗
  const [mreList, setMreList] = useState({ keys: [], list: [] }); // 选择店铺后回显的数据
  const [mreNumber, setMreNumber] = useState({}); // 店铺回收卡豆数 暂存输入值
  const [mreTotal, setMreTotal] = useState(0); // 店铺回收卡豆数

  // 设置form表单值 店铺id
  useEffect(() => {
    const newData = lodash.pickBy(mreNumber, (value, key) => mreList.keys.includes(key));
    const recycleList = Object.keys(newData).map((item) => ({
      merchantId: item,
      recycleBean: newData[item] || 0,
    }));
    setMreTotal(lodash.sumBy(recycleList, 'recycleBean'));
    form.setFieldsValue({ recycleList });
  }, [mreList, mreNumber]);

  const formItems = [
    {
      label: '任务名称',
      name: 'taskName',
    },
    {
      label: '角色',
      name: 'role',
      type: 'select',
      select: { merchant: '店铺' },
    },
    {
      label: '适用店铺',
      name: 'merchantIds',
      type: 'formItem',
      formItem: (
        <Button type="primary" ghost onClick={() => setVisible(true)}>
          选择店铺
        </Button>
      ),
    },
    {
      label: '适用店铺',
      type: 'noForm',
      formItem: (
        <MreSelectShow
          key="MreTable"
          {...mreList}
          setMreList={setMreList}
          otherColumns={[
            {
              fixed: 'right',
              title: '回收卡豆数',
              dataIndex: 'recycleBean',
              render: (val, record) => (
                <InputNumber
                  value={mreNumber[record.userMerchantIdString]}
                  precision={0}
                  min={0}
                  onChange={(val) =>
                    setMreNumber(({ sum, ...other }) => ({
                      ...other,
                      [record.userMerchantIdString]: val,
                    }))
                  }
                ></InputNumber>
              ),
            },
          ]}
        ></MreSelectShow>
      ),
    },
    {
      label: '回收卡豆数',
      name: 'recycleList',
      type: 'formItem',
      formItem: <>{mreTotal}</>,
    },
    {
      label: '回收凭证',
      name: 'certificate',
      type: 'upload',
      maxFile: 1,
    },
  ];

  return (
    <>
      <FormCondition form={form} formItems={formItems} initialValues={detail}></FormCondition>
      <MreSelect
        keys={mreList.keys}
        visible={visible}
        mreList={mreList.list}
        onOk={(val) => setMreList(val)}
        onCancel={() => setVisible(false)}
      ></MreSelect>
    </>
  );
};

export default SubsidyRecycleBean;
