import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import { VANE_URL_TYPE } from '@/common/constant';
import { VANE_ICON, VANE_BANNER, VANE_BEAN_ICON } from '@/common/imgRatio';
import { checkFileData } from '@/utils/utils';
import aliOssUpload from '@/utils/aliOssUpload';
import DescriptionsCondition from '@/components/DescriptionsCondition';
import DrawerCondition from '@/components/DrawerCondition';
import FormCondition from '@/components/FormCondition';

const VaneDrawer = (props) => {
  const { dispatch, cRef, visible, onClose, loading, tradeList, cityCode } = props;

  const { show = false, type = 'add', detail = {} } = visible;
  const { topCategoryId, version, userOs, areaType, type: tabKey } = detail;

  const [form] = Form.useForm();
  const [showPop, setShowPop] = useState(false); // 显示气泡
  const [showUrl, setShowUrl] = useState(false); // 显示选择框或者URL
  const [cateList, setCateList] = useState([]);

  const NATIVE_TYPE = {
    specialArea: '卡豆专区',
    phoneBill: '话费充值',
    memberRecharge: '会员充值',
    blindBox: '盲盒',
  };

  const allProps = {
    add: {
      title: '新增',
      api: 'walkingManage/fetchGetWindVaneManagementAdd',
      flag: 'addConfig',
    },
    edit: {
      title: '修改',
      api: 'walkingManage/fetchGetWindVaneManagementEdit',
      flag: 'updateConfig',
    },
    detail: {
      title: '详情',
    },
  }[type];

  // 提交
  const fetchGetFormData = () => {
    form.validateFields().then((values) => {
      const {
        image,
        bubbleFlag = 0,
        topCategoryId: tId = '',
        categoryId = '',
        windVaneParamObject = {},
        jumpType,
        nativeJumpType,
      } = values;
      const { bannerImage, ...other } = windVaneParamObject;
      const windVaneParam = {
        ...other,
        topCategoryId: tId && tId.toString(),
        categoryId: categoryId && categoryId.toString(),
      };
      const aImg = checkFileData(image);
      const bImg = checkFileData(bannerImage);
      // 上传图片到oss -> 提交表单
      aliOssUpload([...aImg, ...bImg]).then((res) => {
        dispatch({
          type: allProps.api,
          payload: {
            type: tabKey,
            areaType: areaType,
            flag: allProps.flag,
            userOs,
            version,
            areaCode: type === 'edit' ? detail.areaCode : cityCode,
            configWindVaneId: detail.configWindVaneId,
            ...values,
            jumpType: jumpType === 'trade' ? 'native' : jumpType,
            nativeJumpType: { trade: 'windVaneCategory', native: nativeJumpType }[jumpType],
            bubbleFlag: Number(bubbleFlag),
            image: res[0],
            windVaneParamObject:
              jumpType === 'trade'
                ? { ...windVaneParam, bannerImage: res.slice(1).toString() }
                : '',
          },
          callback: () => {
            onClose();
            cRef.current.fetchGetData();
          },
        });
      });
    });
  };

  // 获取行业选择项
  const fetchTradeList = () => {
    dispatch({
      type: 'sysTradeList/fetchGetList',
      callback: (list) => {
        if (topCategoryId && topCategoryId.length) {
          const topId = topCategoryId[0];
          list.map((items) => {
            if (items.categoryIdString == topId) {
              const childList = items.childList;
              setCateList(childList);
            }
          });
        }
      },
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
      extra:
        tabKey === 'windVane'
          ? '请上传80*80尺寸png、jpeg格式图片'
          : '请上传335*160尺寸png、jpeg、gif格式图片',
      imgRatio: tabKey === 'windVane' ? VANE_ICON : VANE_BEAN_ICON,
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
      maxLength: 5,
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
      label: '一级行业类目',
      name: 'topCategoryId',
      type: 'select',
      select: tradeList,
      visible: showUrl === 'trade',
      show: false,
      fieldNames: {
        label: 'categoryName',
        value: 'categoryIdString',
        children: 'childList',
      },
      onChange: (val, option) => {
        const childList = option.option.childList;
        const topCategoryName = option.option.categoryName;
        console.log(childList, topCategoryName);
        setCateList(childList);
        form.setFieldsValue({
          windVaneParamObject: { topCategoryName, categoryName: '' },
          categoryId: [],
        });
      },
    },
    {
      label: '二级行业类目',
      mode: 'multiple',
      type: 'select',
      name: 'categoryId',
      select: cateList,
      fieldNames: {
        label: 'categoryName',
        value: 'categoryIdString',
      },
      show: false,
      visible: showUrl === 'trade',
      rules: [{ required: false }],
      onChange: (val, option) => {
        console.log(val);
        if (val.length) {
          const categoryName = option.map((items) => items.option.categoryName).toString();
          form.setFieldsValue({ windVaneParamObject: { categoryName } });
        }
      },
    },
    {
      label: '行业名称',
      name: ['windVaneParamObject', 'topCategoryName'],
      hidden: true,
      visible: showUrl === 'trade',
      show: false,
    },
    {
      label: '行业名称',
      name: ['windVaneParamObject', 'categoryName'],
      hidden: true,
      rules: [{ required: false }],
      visible: showUrl === 'trade',
      render: (val, row) => {
        const { windVaneParamObject = {} } = row;
        return `${windVaneParamObject.topCategoryName || ''} ${val || ''}`;
      },
    },
    {
      label: 'banner图:',
      name: ['windVaneParamObject', 'bannerImage'],
      type: 'upload',
      extra: '请上传702*140尺寸png、jpeg格式图片',
      maxFile: 1,
      imgRatio: VANE_BANNER,
      visible: showUrl === 'trade',
    },
    {
      label: '跳转内容',
      type: 'select',
      name: 'nativeJumpType',
      select: NATIVE_TYPE,
      show: showUrl === 'native',
      visible: showUrl === 'native',
      render: (val) => NATIVE_TYPE[val],
    },
  ];

  const modalProps = {
    title: allProps.title,
    visible: show,
    zIndex: 1001,
    onClose,
    afterCallBack: () => {
      setShowPop(Boolean(detail.bubbleFlag));
      setShowUrl(detail.jumpType || false);
      fetchTradeList();
    },
    closeCallBack: () => {
      setCateList([]);
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
