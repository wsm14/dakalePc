import React, { useEffect } from 'react';
import { Pie } from '@ant-design/charts';

const PieChart = (props) => {
  const ref = React.useRef();

  const {
    data,
    title,
    angleField = 'value',
    colorField = 'type',
    onClick,
    radius = 1,
    innerRadius,
    label = {},
    legend = {},
    statistic = {},
    layout, // horizontal
    flipPage = false, // 图例分页
  } = props;

  const config = {
    data,
    radius, // 外环
    innerRadius, // 内环
    angleField, // 值
    colorField, // 分类项
    appendPadding: 10,
    padding: 'auto',
    // 提示文本
    tooltip: {
      domStyles: {
        'g2-tooltip-value': {
          marginLeft: '15px',
        },
      },
    },
    // 内环文本
    statistic: {
      title: { customHtml: title || '总计', style: { fontSize: 14 }, offsetY: -10 },
      content: { style: { fontSize: 25, fontWeight: 400 } },
      ...statistic,
    },
    // 图例
    legend: {
      layout,
      position: 'right',
      flipPage,
      itemSpacing: 5,
      useHtml: true,
      ...legend,
    },
    // 文字
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
      },
      ...label,
    },
    interactions: [{ type: 'element-active' }],
  };

  useEffect(() => {
    if (ref.current) {
      // 点击 point
      ref.current.on('element:click', (...args) => {
        // console.log(...args);
        onClick && onClick(...args);
      });
    }
  }, []);

  return <Pie {...config} chartRef={ref} />;
};

export default PieChart;
