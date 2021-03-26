import React, { useEffect } from 'react';
import Pie from '@ant-design/charts/lib/pie';

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
    label = {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
      },
    },
    tooltip = {
      domStyles: {
        'g2-tooltip-value': {
          marginLeft: '15px',
        },
      },
    },
    statistic = {},
    legend = {},
    layout, // horizontal
    flipPage = false, // 图例分页
    interactions = [{ type: 'element-active' }],
  } = props;

  const legends = { layout, position: 'right', flipPage, itemSpacing: 8, useHtml: true, ...legend };

  const config = {
    data,
    radius, // 外环
    innerRadius, // 内环
    angleField, // 值
    colorField, // 分类项
    appendPadding: 10,
    padding: 'auto',
    // 提示文本
    tooltip,
    // 内环文本
    statistic: {
      title: { customHtml: title || '总计', style: { fontSize: 14 }, offsetY: -10 },
      content: { style: { fontSize: 25, fontWeight: 400 } },
      ...statistic,
    },
    // 图例
    legend: typeof legend === 'boolean' ? legend : legends,
    // 文字
    label,
    interactions,
    ...props,
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

  return <Pie {...config} chartRef={ref}></Pie>;
};

export default PieChart;
