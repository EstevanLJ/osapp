export function dateToString(date) {
  return date.getFullYear() + '-' +
    ((date.getMonth()+1) < 10 ? '0' : '') + (date.getMonth()+1) + '-' +
    (date.getDate() < 10 ? '0' : '') + date.getDate() + ' ' +
    (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' +
    (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':' +
    (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
}


export function formatDate(date) {
  return (date.getDate() < 10 ? '0' : '') + date.getDate() + '/' +
    ((date.getMonth()+1) < 10 ? '0' : '') + (date.getMonth()+1) + '/' +
    date.getFullYear()
}

export function formatTime(date) {
  return (date.getHours() < 10 ? '0' : '') + date.getHours() + ':' +
    (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
}