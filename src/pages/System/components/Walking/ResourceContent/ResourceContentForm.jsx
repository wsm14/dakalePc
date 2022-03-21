import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Tabs } from 'antd';
import reactCSS from 'reactcss';
import { ChromePicker } from 'react-color';
import FormCondition from '@/components/FormCondition';
import ShareCoupon from './ShareCoupon/ShareCoupon';
import BrandModuleList from './BrandModuleList/BrandModuleList';
import PlatformCouponList from './PlatformCouponList/PlatformCouponList';

const { TabPane } = Tabs;

const ResourceContentForm = (props) => {
  const { initialValues, form, resourceTemplateList, dispatch, type = 'add' } = props;
  const { backgroundColor = '' } = initialValues;

  const [displayColorPicker, setDisplayColorPicker] = useState(false); //  背景色状态
  const [color, setColor] = useState(''); //  背景色状态
  const [typeList, setTypeList] = useState([]);

  useEffect(() => {
    if (initialValues.resourceTemplateContentId) {
      handleSelectTemplate(initialValues.templateId);
      setColor(backgroundColor);
    }
  }, [initialValues]);

  // 搜索模板类型
  const handleSelectTemplate = (resourceTemplateId) => {
    dispatch({
      type: 'walkingManage/fetchGetResourceTemplateById',
      payload: {
        resourceTemplateId,
      },
      callback: (obj) => {
        setTypeList(obj.typeList);
        form.setFieldsValue({
          templateType: obj.templateType,
        });
      },
    });
  };

  const styles = reactCSS({
    default: {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `${color}`,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    },
  });

  // 暂存颜色
  const handleChange = ({ hex }) => {
    setColor(hex);
    form.setFieldsValue({
      backgroundColor: hex,
    });
  };

  const formItems = [
    {
      label: `活动名称`,
      name: 'name',
    },
    {
      label: `备注`,
      name: 'remark',
      rules: [{ required: false }],
      type: 'textArea',
      maxLength: 50,
    },
    {
      label: `关联模板名称`,
      name: 'templateId',
      type: 'select',
      select: resourceTemplateList,
      fieldNames: {
        label: 'templateName',
        value: 'resourceTemplateId',
      },
      onChange: (id) => {
        handleSelectTemplate(id);
      },
      disabled: type === 'edit',
    },
    {
      label: `模板类型`,
      name: 'templateType',
      hidden: true,
    },
    {
      label: `上传顶图`,
      name: 'topImg',
      type: 'upload',
      maxFile: 1,
      visible: typeList.includes('topImg'),
    },
    {
      label: `上传图片`,
      name: 'image',
      type: 'upload',
      maxFile: 1,
      visible: typeList.includes('image'),
    },
    {
      label: `背景色`,
      name: 'backgroundColor',
      type: 'formItem',
      required: true,
      visible: typeList.includes('backgroundColor'),
      addRules: [
        {
          validator: () => {
            if (!color) {
              return Promise.reject(`请选择背景色`);
            }
            return Promise.resolve();
          },
        },
      ],
      formItem: (
        <div>
          <div style={styles.swatch} onClick={() => setDisplayColorPicker(true)}>
            <div style={styles.color} />
          </div>
          {displayColorPicker ? (
            <div style={styles.popover}>
              <div style={styles.cover} onClick={() => setDisplayColorPicker(false)} />
              <ChromePicker color={color} disableAlpha={true} onChange={handleChange} />
            </div>
          ) : null}
        </div>
      ),
    },
    {
      label: `商品列表类型`,
      name: 'mixedList',
      type: 'formItem',
      required: true,
      visible: typeList.includes('mixedList'),
      formItem: (
        <>
          <ShareCoupon type="mixedList" form={form}></ShareCoupon>
        </>
      ),
    },
    {
      label: `商品列表类型`,
      name: 'activityGoodsTypeList',
      type: 'formItem',
      required: true,
      visible: typeList.includes('classifiedList'),
      formItem: (
        <>
          <Tabs tabPosition="left">
            <TabPane tab="特惠商品" key="1">
              <div style={{ overflow: 'auto' }}>
                <ShareCoupon type="specialGoods" form={form}></ShareCoupon>
              </div>
            </TabPane>
            <TabPane tab="电商品" key="2">
              <div style={{ overflow: 'auto' }}>
                <ShareCoupon type="commerceGoods" form={form}></ShareCoupon>
              </div>
            </TabPane>
            <TabPane tab="自我游" key="3">
              <div style={{ overflow: 'auto' }}>
                <ShareCoupon type="selfTourGoods" form={form}></ShareCoupon>
              </div>
            </TabPane>
          </Tabs>
        </>
      ),
    },
    {
      label: `商品列表类型`,
      name: 'activityGoodsTypeSelfTravelList',
      type: 'formItem',
      required: true,
      visible: typeList.includes('classifiedListSelfTravel'),
      formItem: (
        <>
          <Tabs tabPosition="left">
            <TabPane tab="自我游" key="3">
              <div style={{ overflow: 'auto' }}>
                <ShareCoupon type="selfTourGoods" form={form}></ShareCoupon>
              </div>
            </TabPane>
          </Tabs>
        </>
      ),
    },

    {
      label: `品牌列表`,
      type: 'formItem',
      visible: typeList.includes('brandSelfTravel'),
      required: true,
      formItem: (
        <BrandModuleList
          initialValues={initialValues}
          type="brandSelfTravel"
          form={form}
        ></BrandModuleList>
      ),
    },
    {
      label: `券列表`,
      type: 'formItem',
      visible: typeList.includes('couponList'),
      required: true,
      formItem: <PlatformCouponList type="couponList" form={form}></PlatformCouponList>,
    },
  ];

  return (
    <FormCondition form={form} formItems={formItems} initialValues={initialValues}></FormCondition>
  );
};

export default connect(({ walkingManage }) => ({
  resourceTemplateList: walkingManage.resourceTemplateList.list,
}))(ResourceContentForm);