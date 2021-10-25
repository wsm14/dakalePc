import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import CITYJSON from '@/common/cityJson';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const HotCityDrawer = (props) => {
  const { dispatch, childRef, visible, onClose, loading } = props;

  const { show = false, detail = [], dictionaryId } = visible;
  const [form] = Form.useForm();
  const [cityArr, setCityArr] = useState([]);

  const cityInfo = detail.map((item) => {
    return item.cityCode;
  });

  // 提交
  const fetchGetFormData = () => {
    // console.log(cityArr);
    // console.log(childRef);
    dispatch({
      type: 'walkingManage/fetchHotCityPageConfigChange',
      payload: {
        dictionaryId,
        extraParam: cityArr,
      },
      callback: () => {
        childRef.current.fetchGetData();
        onClose();
      },
    });
  };

  const formItems = [
    {
      label: '选择热门城市',
      name: 'cityName',
      type: 'tags',
      rules: [{ required: false }],
      select: CITYJSON.filter((item) => item.level === '2'),
      fieldNames: { label: 'name', value: 'id' },
      onChange: (val, group) =>
        // console.log(group, 'group'),
        setCityArr(
          group.map(({ option }) => ({
            cityCode: option.id,
            cityName: option.name,
          })),
        ),
    },
  ];

  const modalProps = {
    title: '新增',
    visible: show,
    onClose,
    afterCallBack: () => {
      setCityArr(detail);
    },
    // closeCallBack: () => {
    //   setCateList([]);
    // },
    footer: (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      <FormCondition formItems={formItems} form={form} initialValues={{ cityName: cityInfo }} />
    </DrawerCondition>
  );
};

export default connect(({ walkingManage, loading }) => ({
  loading: loading.models.walkingManage,
}))(HotCityDrawer);
