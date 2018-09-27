function getDaysInOneMonth(year, month) {
    var d = new Date(year, month, 0);
    return d.getDate();
}

function formatDateDMY(year, month, day) {
//24 Aug 2018
    let m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec"];
    return day + " " + m[month-1] + " " + year
}

function formatTimeHHMM(time) {
//8:30am  6:00pm
    let timestamp = new Date(time);
    let hour = timestamp.getHours();
    let minutes = timestamp.getMinutes();
    minutes = (minutes === 0 ? "00" : minutes);
    let minutesNull =  (minutes === "00" ? null : minutes);

    let morningTime = hour + ':' + minutes;
    let middayTime = (hour !== 12 ? hour % 12 : hour) + ':' + minutes;
    let eveningTime = hour % 12 + ':' + minutes;

    let morningTime_minutesNull =null;
    let middayTime_minutesNull =null;
    let eveningTime_minutesNull =null;

    if (minutesNull != null) {
        morningTime_minutesNull = hour + ':' + minutes;
        middayTime_minutesNull = (hour !== 12 ? hour % 12 : hour) + ':' + minutes;
        eveningTime_minutesNull = hour % 12 + ':' + minutes;
    } else {
        morningTime_minutesNull = hour;
        middayTime_minutesNull = (hour !== 12 ? hour % 12 : hour);
        eveningTime_minutesNull = hour % 12;
    }
    return {
        hour,
        morningTime,
        middayTime,
        eveningTime,
        morningTime_minutesNull,
        middayTime_minutesNull,
        eveningTime_minutesNull,
    }
}

export default module.export = {
    getDaysInOneMonth,
    formatDateDMY,
    formatTimeHHMM,
}