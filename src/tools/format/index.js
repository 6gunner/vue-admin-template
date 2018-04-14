/**
 * Created by KY on 2017/10/20.
 */
//不四舍五入，直接截取
Number.prototype.toFixed = function (n) {
  if (n > 20 || n < 0) {
    throw new RangeError('toFixed() digits argument must be between 0 and 20');
  }
  const number = this;
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString();
  }
  if (typeof (n) == 'undefined' || n == 0) {
    return number.toString();
  }

  let result = number.toString();
  const arr = result.split('.');

  // 整数的情况
  if (arr.length < 2) {
    result += '.';
    for (let i = 0; i < n; i += 1) {
      result += '0';
    }
    return result;
  }

  const integer = arr[0];
  const decimal = arr[1];
  if (decimal.length == n) {
    return result;
  }
  if (decimal.length < n) {
    for (let i = 0; i < n - decimal.length; i += 1) {
      result += '0';
    }
    return result;
  }
  result = integer + '.' + decimal.substr(0, n);
  // const last = decimal.substr(n, 1);
  //
  // // 四舍五入，转换为整数再处理，避免浮点数精度的损失
  // if (parseInt(last, 10) >= 5) {
  //   const x = Math.pow(10, n);
  //   result = (Math.round((parseFloat(result) * x)) + 1) / x;
  //   result = result.toFixed(n);
  // }

  return result;
}


Date.prototype.format = function (fmt) {
  let o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

Date.prototype.fromDateAndTime = function (date, time) {
  this.setTime(0);
  this.setYear(parseInt(date / 10000));
  this.setDate((date % 10000) % 100);
  let month = parseInt((date % 10000) / 100) - 1
  this.setMonth(month);
  if (time) {
    this.setHours(parseInt(time / 10000));
    this.setMinutes(parseInt((time % 10000) / 100));
    this.setSeconds((time % 10000) % 100);
  } else {
    this.setHours(0)
    this.setMinutes(0)
    this.setSeconds(0)
  }
  return this;
}

/**
 *
 * @param formatType
 * @param format
 * @param value
 * @param fixType 1 四舍五入 2 向下 3 向上
 * @returns {*}
 */
const format = function (formatType, format, value, fixType) {
  //默认取整
  fixType || (fixType = 1)
  if (formatType == 'datetime') {
    let date;
    if (_.isString(value)) {
      let arr = value.split(' ');
      date = new Date().fromDateAndTime(arr[0], arr[1]);
    }
    else {
      date = new Date(value);
    }
    return date.format(format);
  } else if (formatType == 'date') {
    if (typeof value !== 'number') {
      return value
    }
    let date = new Date().fromDateAndTime(value, 0);
    return date.format(format);
  } else if (formatType == 'time') {
    let date = new Date().fromDateAndTime(0, value);
    return date.format(format);
  } else if (formatType == 'number') {//$0.00###%
    let end = '';
    let isSplit = format[0] == '$';
    let index = format.indexOf('.'); //小数点是否存在
    if (format.indexOf('%') > -1) {
      end = '%';
      value *= 100;
      format = format.substring(index + 1, format.length - 1);
    }
    else if (format.indexOf('‰') > -1) {
      end = '‰';
      value *= 1000;
      format = format.substring(index + 1, format.length - 1);
    }
    else if (format.indexOf('‱') > -1) {
      end = '‱';
      value *= 10000;
      format = format.substring(index + 1, format.length - 1);
    } else {
      format = format.substring(index + 1);
    }
    if (index == -1) {
      if (fixType == 1)
        value = Number(value).toFixed(0)
      else if (fixType == 2) {
        value = Math.floor(Number(value));
      } else if (fixType == 3) {
        value = Math.ceil(Number(value));
      }
    } else {
      //如果是小数
      let decimalFormat = format;
      let num = Math.pow(10, decimalFormat.length);
      if (fixType == 1)
        value = Number(value).toFixed(decimalFormat.length);
      else if (fixType == 2)
        value = Math.floor(Number(value) * num) / num;
      else if (fixType == 3)
        value = Math.ceil(Number(value) * num) / num;
      value = value + "";
      let decimalIndex = decimalFormat.length,
        valueIndex = value.length,
        isSpliced = false;
      while (decimalIndex > 0) {
        decimalIndex--;
        valueIndex--;
        if (decimalFormat[decimalIndex] == '0' || value[valueIndex] != '0') {
          isSpliced = true;
          break;
        }
      }
      isSpliced ? valueIndex++ : valueIndex--;
      value = value.substring(0, valueIndex);
    }
    //小数点前面的值判断是否需要千分位隔开
    if (isSplit) {
      index = value.indexOf('.');
      if (index == -1) {
        value = value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      } else {
        let istr = value.substr(0, index);
        value = istr.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + value.substr(index);
      }
    }
    return value + end;
  }
}

export default format
