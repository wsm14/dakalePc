/**
 * 正则表达式
 */
// 不能写 safari不支持 ?<=、?<!、?!、?=

// 以字母数字下划线组成,6-24位
export const WORD_NUM_PATTERN = /^[A-Za-z0-9_]{6,24}$/;

// 电话号码
export const PHONE_PATTERN = /^1[3456789]\d{9}$/;

// 全数字
export const NUM_PATTERN = /^\d+$/;

// 小数或整数 大于零
export const NUM_ALL = /^[0-9]+([.]{1}[0-9]+){0,1}$/;

// 大于0的正整数
export const NUM_INT = /^\+?[1-9]\d*$/;

// 不超过六位正整数
export const NUM_INT_MAXSIX = /^([1-9][0-9]{0,5}|0)$/;

// 不超过八位正整数
export const NUM_INT_MAXEIGHT = /^([1-9][0-9]{0,7})$/;

// 判断是否有空格
export const SPACE_PATTERN = /^[^\s]+$/;

// 限制逗号最多两个
export const COMMA_TWO_PATTERN = /^([^,]*,?[^,]*){0,2}$/;

// 不允许逗号开头结尾
// export const COMMA_SE_PATTERN = /([^!,])(?<![,])$/;

// 判断url
export const URL_PATTERN = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

// 1-99位数
export const NUM_PERCENTAGE = /^([1-9]\d?|100)$/;

export const BANK_CARD = /^([1-9]{1})(\d{13}|\d{14}|\d{18}|\d{19})$/;
