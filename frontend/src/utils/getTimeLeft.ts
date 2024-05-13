export default function getTimeLeft(endingTime : Date ){
    const currentTime = new Date();
    const diff = endingTime.getTime() - currentTime.getTime();
    const DAYMS = 1000*60*60*24;
    const HOURMS = 60*60*1000;
    const MINMS = 60*1000;
    const days = Math.floor(diff / DAYMS);
    const hrs =  Math.floor((diff - (days*DAYMS)) / HOURMS);
    const mins = Math.floor((diff - (days*DAYMS) - (hrs * HOURMS)) / MINMS);
    const timeLeft = ((days < 10) ? ("0" + days) : days) + ":" + ((hrs < 10) ? ("0" + hrs) : hrs) + ":" + ((mins < 10) ? ("0" + mins) : mins) ;
    return timeLeft;
}