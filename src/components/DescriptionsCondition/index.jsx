import React from 'react';
import { Descriptions, Typography } from 'antd';
import QuestionTooltip from '@/components/QuestionTooltip';
import ImagePreviewGroup from './ImagePreviewGroup';
import VideoPreview from './VideoPreview';
import OtherUpload from './OtherUpload';
import styles from './index.less';

const { Paragraph } = Typography;

/**
 *
 * 描述列表封装
 * 2020年8月4日 15:35:24 Dong
 *
 * @formItems 表单内容数组
 * @title 描述列表的标题，显示在最顶部
 * @extra 描述列表的操作区域，显示在右上方
 * @initialValues 默认值
 * @style Descriptions 样式
 * @bordered 是否显示边框
 * @column 一行的 DescriptionItems 数量，可以写成像素值或支持响应式的对象写法 { xs: 8, sm: 16, md: 24}
 * @children Descriptions 附加内容 显示在底部
 */

const DescriptionsCondition = (props) => {
  const {
    formItems = [],
    initialValues = {},
    bordered = true,
    column = 1,
    children,
    ...other
  } = props;

  // 逐级获取value
  const getArrKeyVal = (key) => {
    if (!initialValues) return null;
    const _len = key.length;
    let newVal = initialValues;
    for (let _key = 0; _key < _len; _key++) {
      if (!newVal) return null;
      // 当数组key 获取值时某一层不存在时直接返回null
      const valGet = newVal !== null || newVal !== undefined ? newVal[key[_key]] : null;
      newVal = valGet !== null || valGet !== undefined ? valGet : undefined;
    }
    return newVal;
  };

  // 获取参数值判断
  // 当前item 存在initialValue 的情况下 优先于全局initialValues
  const getRowVale = (rowVal, key) => {
    if (rowVal) return rowVal;
    // 参数名判断 若是数组则逐级获取参数
    return Array.isArray(key) ? getArrKeyVal(key) : initialValues[key];
  };

  // 处理返回dom结构
  const checkData = (type, value) => {
    const domShow = {
      text: value,
      number: value,
      textArea: value,
      upload: <ImagePreviewGroup url={value}></ImagePreviewGroup>,
      videoUpload: <VideoPreview url={value}></VideoPreview>,
      otherUpload: <OtherUpload url={value}></OtherUpload>,
    };
    // 类型错误返回
    if (!Object.keys(domShow).includes(type)) return 'type error';
    return domShow[type];
  };

  // 区分表单信息
  const getCheckItem = (rowItem) => {
    const {
      name, // 内容参数名
      type = 'text', // 显示类型 text upload 默认text
      fieldNames, // 参数别名 最高权重
      render, // 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据
      copy = false, // 是否允许复制 text number textArea 可复制
      initialValue: rowValue, // 显示参数
      children: rowChildren, // 额外内容在底部
    } = rowItem;

    // 获取参数名
    const valueKey = fieldNames || name;

    // 参数值获取
    const detailVal = getRowVale(rowValue, valueKey);

    // 返回处理结果 存在render 情况下优先返回，否则走类型判断
    if (render) {
      return render(detailVal, initialValues);
    } else if (detailVal === '') {
      return '';
    } else {
      if (['text', 'number', 'textArea'].includes(type) && copy) {
        return (
          detailVal && (
            <Paragraph copyable style={{ marginBottom: 0 }}>
              {detailVal}
            </Paragraph>
          )
        );
      }
      return checkData(type, detailVal);
    }
  };

  // 遍历表单
  const getFields = () =>
    formItems.map((item, i) => {
      const {
        show = true, // 是否显示 最高权重 默认显示
        label, // 内容的描述
        tips = '', // 额外提示
        span = 1, // 包含列的数量 默认1
        children: rowChildren, // 额外内容在底部
      } = item;

      // show false 不显示
      if (!show) return false;

      return (
        <Descriptions.Item
          span={span}
          label={tips ? <QuestionTooltip title={label} content={tips} /> : label}
          key={`${props.title || ''}${label}${i}`}
          className={styles.descriptions_item}
        >
          {/* 显示数据内容 默认值不存在 则显示为'--'*/}
          {Object.keys(initialValues).length ? getCheckItem(item) : rowChildren ? '' : '--'}
          {/* 额外显示dom */}
          {rowChildren && <div>{rowChildren}</div>}
        </Descriptions.Item>
      );
    });

  return (
    <>
      <Descriptions
        bordered={bordered}
        size="small"
        column={column}
        {...other}
        className={styles.descriptions_box}
      >
        {formItems.length ? getFields() : ''}
      </Descriptions>
      {children}
    </>
  );
};

export default DescriptionsCondition;
