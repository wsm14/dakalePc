/**
 * 正则表达式
 */

// 以字母数字下划线组成,6-24位
export const WORD_NUM_PATTERN = new RegExp(/^[A-Za-z0-9_]{6,24}$/);

// 电话号码
export const PHONE_PATTERN = new RegExp(
  /^1[3456789]\d{9}$/,
);

// 全数字
export const NUM_PATTERN = new RegExp(/^\d+$/);

// 大于0的正整数
export const NUM_INT = new RegExp(/^\+?[1-9]\d*$/);

// 判断是否有空格
export const SPACE_PATTERN = new RegExp(/^[^\s]+$/);

// 限制逗号最多两个
export const COMMA_TWO_PATTERN = new RegExp(/^([^,]*,?[^,]*){0,2}$/);

// 不允许逗号开头结尾
export const COMMA_SE_PATTERN = new RegExp(/([^!,])(?<![,])$/);

// 判断url
export const URL_PATTERN = new RegExp(
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
);
