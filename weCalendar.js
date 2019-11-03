class WeCanlendar {
  constructor () {
    this.yearArr = []
    this.monthArr = []
    this.weekDay = []
    this.gan = []
    this.zhi = []
    this.chineseZodiac = []
    this.farmDate = []
    this.today = {}
    this.lastThreeMonthDay = []
    this.currentMonthDay = []
    this.searchDay = {year: 1900, month: 1, day: 1}
    this.init()
  }
  init () {
    for (let i = 1900; i < 2051; i++) { this.yearArr.push(i) }
    for (let i = 0; i < 12; i++) { this.monthArr.push(i + 1) }
    this.weekDay = ('一二三四五六日').split('')
    this.gan = ('甲乙丙丁戊己庚辛壬癸').split('')
    this.zhi = ('子丑寅卯辰巳午未申酉戌亥').split('')
    this.chineseZodiac = ('鼠牛虎兔龙蛇马羊猴鸡狗猪').split('')
    // 后五位16进制转成2进制，不满20位补足20位
    // 17-20表示是否闰月,5-16表示12个月份,1表示30天，0表示29天
    // 第4位表示润月,1表示30天,0表示29天(在有闰月时才有意义)
    this.farmDate = [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0,
      0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2,
      0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60,
      0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60,
      0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4,
      0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0,
      0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60,
      0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5,
      0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6, 0x095b0,
      0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
      0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5,
      0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0,
      0x092d0, 0x0cab5, 0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0,
      0x15176, 0x052b0, 0x0a930, 0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6,
      0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0,
      0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0,
      0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0]
    let today = new Date()
    this.today = today
    this.searchDay = {year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate()}
    this.searchLastThreeMonthDay(this.searchDay)
  }
  reset () {
    this.lastThreeMonthDay = []
    this.currentMonthDay = []
  }
  // 根据传入的月份,查询最近三个月日历:其实只要上月和下月各取一点就可以了,这里取15天
  searchLastThreeMonthDay (searchDay) {
    // 时间格式统一使用/是为了兼容ios
    let year = searchDay.year
    let month = searchDay.month
    let prevMonthStr = month === 1 ? `${year - 1}/12/15` : `${year}/${month - 1}/15`
    let nextMonthStr = month === 12 ? `${year + 1}/1/15` : `${year}/${month + 1}/15`
    let prevTimeStamp = new Date(prevMonthStr).getTime()
    let nextTimeStamp = new Date(nextMonthStr).getTime()
    let oneDayTimeStamp = 24 * 60 * 60 * 1000
    let len = Math.floor((nextTimeStamp - prevTimeStamp) / oneDayTimeStamp)
    for (let i = 0; i < len; i++) {
      this.lastThreeMonthDay.push(this.timeStampToDate(i * oneDayTimeStamp + prevTimeStamp))
    }
    this.searchCurrentMonthDay(searchDay)
  }
  // 时间戳转日期的方法
  timeStampToDate (timeStamp) {
    let date = new Date(timeStamp)
    let dateStr = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    let weekDay = date.getDay()
    return {date: dateStr, weekDay: weekDay}
  }
  // 计算出当前月份的所有日期
  searchCurrentMonthDay (searchDay) {
    let monthStart = `${searchDay.year}/${searchDay.month}/1`
    let lastDay = new Date(searchDay.year, searchDay.month, 0).getDate()
    let monthEnd = `${searchDay.year}/${searchDay.month}/${lastDay}`
    let monthStartIdx = 0
    let monthEndIdx = 28
    for (let i = 0; i < this.lastThreeMonthDay.length; i++) {
      if (this.lastThreeMonthDay[i].date === monthStart) {
        monthStartIdx = i
      }
      if (this.lastThreeMonthDay[i].date === monthEnd) {
        monthEndIdx = i
        break
      }
    }
    // 日历表实际开头星期一
    let calStartMonIdx = monthStartIdx - this.lastThreeMonthDay[monthStartIdx].weekDay
    // 日历表实际结尾星期日
    let calEndSunIdx = monthEndIdx + (6 - this.lastThreeMonthDay[monthEndIdx].weekDay)
    for (let i = 1; i <= calEndSunIdx - calStartMonIdx + 1; i++) {
      let dateObj = this.lastThreeMonthDay[calStartMonIdx + i]
      let shortDate = (dateObj.date).split('/').pop()
      let isCurrentMonth = (calStartMonIdx + i >= monthStartIdx) && (calStartMonIdx + i <= monthEndIdx)
      let isHoliday = dateObj.weekDay === 6 || dateObj.weekDay === 0
      this.currentMonthDay.push({date: shortDate, isCurrentMonth: isCurrentMonth, isHoliday: isHoliday})
    }
  }
  // 搜索对应日期的月份时间
  search (dateStr) {
    // 处理'2019.12.12'或'2019-12-12'或'2019/12/12'格式的时间
    let dateStrFirst = dateStr.indexOf('-') >= 0 ? dateStr.replace(/-/g, '|') : dateStr
    let dateStrSecond = dateStrFirst.indexOf('-') >= 0 ? dateStrFirst.replace(/./g, '|') : dateStrFirst
    let dateStrThird = dateStrSecond.indexOf('/') >= 0 ? dateStrSecond.replace(/\//g, '|') : dateStrSecond
    let newDateArr = this.arrTransToNum(dateStrThird.split('|'))
    this.reset()
    this.searchDay = {year: newDateArr[0], month: newDateArr[1], day: newDateArr[2]}
    this.searchLastThreeMonthDay(this.searchDay)
    // 查询农历
    this.calFarmInfo(this.searchDay)
  }
  // 处理时间数组:全项处理成Number
  arrTransToNum (arr) {
    let newArr = []
    arr.forEach(item => {
      newArr.push(Number(item))
    })
    return newArr
  }
  // 查询农历方法
  calFarmInfo (searchDay) {
    let year = searchDay.year
    let month = searchDay.month
    let day = searchDay.day
    // 计算与1900/01/30日的总天数,当天是'庚子年正月初一'
    let oldTimeStamp = new Date('1900/01/30').getTime()
    let currentTimeStamp = new Date(`${year}/${month}/${day}`).getTime()
    let oneDayTimeStamp = 24 * 60 * 60 * 1000
    let len = Math.floor((currentTimeStamp - oldTimeStamp) / oneDayTimeStamp)
    console.log(len)
    this.searchCurrentFarmInfo(len)
  }
  // 遍历日期,找出当天的农历
  searchCurrentFarmInfo (len) {
    let sum = 0
    let month = 0
    let year = 0
    let lastMonthDay = 0
    let isRun = false
    for (let i = 0; i < this.farmDate.length; i++) {
      let yearInfo = (this.farmDate[i]).toString(2)
      let parseInfo = this.parsetMonthInfo(yearInfo)
      let runBigSm = parseInfo[0]
      let monthInfo = parseInfo[1]
      let runMonth = parseInfo[2]
      for (let m = 0; m < monthInfo.length; m++) {
        sum += Number(monthInfo[m]) === 0 ? 29 : 30
        if (sum >= len) {
          month = this.monthArr[m]
          console.log(lastMonthDay)
          break
        }
        lastMonthDay = sum
        // 闰月
        if (runMonth !== 0 && runMonth === m + 1) {
          sum += runBigSm === 0 ? 29 : 30
        }
        if (sum >= len) {
          isRun = true
          month = this.monthArr[m - 1]
          console.log(lastMonthDay)
          break
        }
        lastMonthDay = sum
      }
      if (sum >= len) {
        year = this.yearArr[i]
        break
      }
    }
    console.log(sum)
    console.log(month)
    console.log(year)
    
  }
  // 将存储的十六进制月份信息解析成2进制
  parsetMonthInfo (yearInfo) {
    let len = yearInfo.length
    let runMonth = parseInt(yearInfo.slice(len - 4, len), 2)
    let monthInfo = (yearInfo.slice(0, len - 4)).split('')
    if (monthInfo.length === 11) {
      monthInfo.unshift('0', '0')
    }
    if (monthInfo.length === 12) {
      monthInfo.unshift('0')
    }
    let runSmBig = Number(monthInfo.shift())
    return [runSmBig, monthInfo, runMonth]
  }
}
let weCanlendar = new WeCanlendar()
this.weCanlendar = weCanlendar
console.log(weCanlendar)