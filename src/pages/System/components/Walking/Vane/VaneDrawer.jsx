import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { VANE_URL_TYPE } from '@/common/constant';
import { VANE_ICON ,VANE_BANNER} from '@/common/imgRatio';
import aliOssUpload from '@/utils/aliOssUpload';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const VaneDrawer = (props) => {
  const { dispatch, cRef, visible, onClose, loading, tradeList } = props;

  const { show = false, type = 'add', detail = {} } = visible;
  const [form] = Form.useForm();
  const [showPop, setShowPop] = useState(false); // 显示气泡
  const [showUrl, setShowUrl] = useState(false); // 显示选择框或者URL

  const allProps = {
    add: {
      title: '新增',
      api: 'walkingManage/fetchWalkManageVaneAdd',
    },
    edit: {
      title: '修改',
      api: 'walkingManage/fetchWalkManageVaneEditDel',
    },
    detail: {
      title: '详情',
    },
  }[type];

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const { image, bubbleFlag = 0, categoryId = [], windVaneParamObject = {}, jumpType } = values;
      const windVaneParam = {
        categoryId: categoryId && categoryId[categoryId.length - 1],
        ...windVaneParamObject,
      };
      // 上传图片到oss -> 提交表单
      aliOssUpload(image).then((res) => {
        dispatch({
          type: allProps.api,
          payload: {
            configWindVaneId: detail.configWindVaneId,
            ...values,
            jumpType,
            nativeJumpType: jumpType === 'native' ? 'category' : '',
            bubbleFlag: Number(bubbleFlag),
            image: res.toString(),
            windVaneParamObject: jumpType === 'native' ? windVaneParam : '',
          },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      });
    });
  };
  useEffect(() => {
    fetchTradeList();
  }, []);

  // 获取行业选择项
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
    });
  };

  const formItems = [
    {
      label: '显示名称',
      name: 'name',
      maxLength: 6,
    },
    {
      label: '显示图标',
      type: 'upload',
      name: 'image',
      maxFile: 1,
      extra: '请上传80*80尺寸png、jpeg格式图片',
      imgRatio: VANE_ICON,
    },
    {
      label: '显示气泡',
      type: 'switch',
      name: 'bubbleFlag',
      onChange: setShowPop,
      show: false,
    },
    {
      label: '气泡内容',
      name: 'bubbleContent',
      visible: showPop,
      maxLength: 2,
    },
    {
      label: '跳转类型',
      type: 'radio',
      name: 'jumpType',
      select: VANE_URL_TYPE,
      onChange: (e) => {
        setShowUrl(e.target.value);
      },
      render: (val) => VANE_URL_TYPE[val],
    },
    {
      label: '原生跳转类型',
      name: 'nativeJumpType',
      visible: false,
      show: false,
    },
    {
      label: '链接',
      name: 'jumpUrl',
      visible: showUrl === 'url',
      show: showUrl === 'url',
    },
    {
      label: '选择行业',
      type: 'cascader',
      name: 'categoryId',
      changeOnSelect: true,
      select: tradeList,
      fieldNames: { label: 'categoryName', value: 'categoryIdString', children: 'childList' },
      show: false,
      visible: showUrl === 'native',
      onChange: (val, option) => {
        let categoryName = option[0].categoryName;
        if (val.length > 1) {
          categoryName = option[1].categoryName;
        }
        form.setFieldsValue({ windVaneParamObject: { categoryName } });
      },
    },
    {
      label: '行业名称',
      name: ['windVaneParamObject', 'categoryName'],
      hidden: true,
    },
    {
      label: 'banner图:',
      name: 'bannerIng',
      type: 'upload',
      extra:'请上传702*140尺寸png、jpeg格式图片',
      // maxFile: 1,
      imgRatio: VANE_BANNER,
    },
  ];

  const modalProps = {
    title: allProps.title,
    visible: show,
    onClose,
    afterCallBack: () => {
      setShowPop(Boolean(detail.bubbleFlag));
      setShowUrl(detail.jumpType || false);
    },
    footer: type !== 'detail' && (
      <Button onClick={fetchGetFormData} type="primary" loading={loading}>
        确认
      </Button>
    ),
  };

  return (
    <DrawerCondition {...modalProps}>
      {type === 'detail' ? (
        <DescriptionsCondition initialValues={detail} formItems={formItems}></DescriptionsCondition>
      ) : (
        <FormCondition initialValues={detail} formItems={formItems} form={form} />
      )}
    </DrawerCondition>
  );
};

export default connect(({ walkingManage, loading, sysTradeList }) => ({
  tradeList: sysTradeList.list.list,
  navigation: walkingManage.navigation,
  loading: loading.models.walkingManage,
}))(VaneDrawer);
