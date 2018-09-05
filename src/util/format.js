var textOfMonth = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
var dayOfWeek = ['일', '월', '화', '수', '목', '금', '토']

function getBetweenDay (sdate, edate) {
  const strStart = `${sdate.toString().substr(0, 4)}-${sdate.toString().substr(5, 2)}-${sdate.toString().substr(8, 2)}`
  const strEnd = `${edate.toString().substr(0, 4)}-${edate.toString().substr(5, 2)}-${edate.toString().substr(8, 2)}`
  function getDateObj (strDate) {
    const dateArray = strDate.split('-')
    return new Date(dateArray[0], Number(dateArray[1]) - 1, dateArray[2])
  }
  return (getDateObj(strEnd).getTime() - getDateObj(strStart).getTime()) / 86400000
}
function dateFormat (date) {
  const newDate = new Date(date)
  return `${textOfMonth[newDate.getMonth()]}.${zeros(newDate.getDate())}`
}
function dateYearFormat (date) {
  const arrDate = date.split('-')
  return `${arrDate[0].substr(2, 2)}.${arrDate[1]}.${arrDate[2]}`
}
function getDayOfWeek (date) {
  const newDate = new Date(date)
  return dayOfWeek[newDate.getDay()]
}
function zeros (n) {
  let zero = ''
  let newN = n
  newN = n.toString()
  if (newN.length < 2) {
    for (let i = 0; i < 2 - newN.length; i += 1) {
      zero += '0'
    }
  }
  return zero + newN
}
function getToday (value) {
  const today = value || new Date()
  return `${today.getFullYear()}-${zeros(today.getMonth() + 1)}-${zeros(today.getDate())}`
}
function numberFormat (number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
export default{
  getBetweenDay,
  zeros,
  getDayOfWeek,
  dateFormat,
  dateYearFormat,
  numberFormat,
  getToday
}
