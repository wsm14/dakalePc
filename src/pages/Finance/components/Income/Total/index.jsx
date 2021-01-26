import React, { useState } from 'react';
import { connect } from 'umi';
import { Statistic } from 'antd';
import { Pie } from '@/components/Charts';
import numeral from 'numeral';
import QuestionTooltip from '@/components/QuestionTooltip';
import totalImg from './img/total.png';
import shadowImg from './img/shadow.png';
import styles from './style.less';

const IncomeTotal = ({ totalBean, loading }) => {
  // 自定义legend
  const [chartData, setChartData] = useState([
    {
      value: 0,
      type: '广告佣金（卡豆）',
      checked: true,
      color: '#FABF4B',
      tip: '交易佣金(卡豆) = 扫码支付/核销订单/哒人带货平台服务费*圈层佣金比例',
    },
    {
      value: 0,
      type: '交易佣金（卡豆）',
      checked: true,
      color: '#5F96F4',
      tip: '广告佣金(卡豆) = 发分享平台服务费*圈层佣金比例',
    },
  ]);

  // 点击图例切换数据
  const hanleLegendClick = (lengendItem) => {
    const { type, checked } = lengendItem;
    // 图表展示 图例 新数据
    const lengendNew = chartData.map((item) => ({
      ...item,
      checked: item.type === type ? !checked : item.checked,
    }));
    setChartData(lengendNew);
  };

  // 图表配置
  const chartProps = {
    legend: false,
    layout: 'horizontal',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'spider',
      style: {
        lineHeight: 20,
      },
      content: '{name}\n {value}',
    },
    color: ({ type }) => {
      if (type === '交易佣金（卡豆）') {
        return '#5F96F4';
      }
      return '#FABF4B';
    },
    tooltip: false,
    interactions: false,
    statistic: {
      title: false,
      content: {
        style: {
          fontSize: 20,
          fontWeight: 400,
          color: '#333333',
        },
        formatter: () => '占比',
      },
    },
  };

  return (
    <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center' }}>
      <div>
        {/* 图片 */}
        <img src={totalImg} style={{ width: 104, height: 100, marginLeft: 25 }}></img>
        <div style={{ paddingLeft: 5, marginTop: 9 }}>
          {/* 标题 */}
          <QuestionTooltip
            type="quest"
            placement="top"
            title="【总】收益(卡豆)"
            overlayStyle={{ maxWidth: 350 }}
            iconStyle={{ color: '#999999', fontSize: 12, marginLeft: 5 }}
            content={'总收益卡豆 = 交易佣金(卡豆) + 广告佣金(卡豆)'}
          ></QuestionTooltip>
          {/* 统计总收益 */}
          <Statistic
            value={totalBean}
            loading={loading}
            valueStyle={{
              fontSize: 30,
              color: '#5F91FF',
              fontWeight: 500,
              paddingLeft: 5,
            }}
          />
        </div>
      </div>
      <div className={styles.pie_block}>
        <div style={{ height: 200, width: 500, position: 'relative' }}>
          <Pie {...chartProps} data={chartData.filter((item) => item.checked)} />
          {/* 检查是否 有数据显示 有则显示阴影 无则隐藏阴影 */}
          {chartData.some((item) => item.checked) && (
            <img
              src={shadowImg}
              style={{ width: 176, height: 218 }}
              className={styles.shadowImg}
            ></img>
          )}
        </div>
        {/* 自定图例 */}
        <ul className={styles.legend}>
          {chartData.map((item, i) => (
            <li key={item.type} onClick={() => hanleLegendClick(item)}>
              <span
                className={styles.dot}
                style={{
                  backgroundColor: !item.checked ? '#aaa' : item.color,
                }}
              />
              <span className={styles.legendTitle}>
                <QuestionTooltip
                  type="quest"
                  placement="top"
                  title={item.type}
                  overlayStyle={{ maxWidth: 350 }}
                  iconStyle={{ color: '#999999', fontSize: 12 }}
                  content={item.tip}
                ></QuestionTooltip>
              </span>
              <span className={styles.value}>{numeral(item.value).format('0,0')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default connect(({ platformIncome, loading }) => ({
  ...platformIncome,
  loading: loading.effects['platformIncome/fetchPlatformInconme'],
}))(IncomeTotal);
