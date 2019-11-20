const getCurrentTime = function() {
    return new Date();
};
const getCurrentTimeInSeconds = function() {
  return Math.floor(getCurrentTime().getTime() / 1000);
};

const mapSeconds = {
    's': 1,
    'm': 60,
    'h': 3600,
    'd': 86400
};
const getLifetimeAsSeconds = function(lifetime) {
    const num = parseInt(lifetime);
    const key = lifetime.replace(`${num}`, '');
    const s = mapSeconds[key];
    if(num > 0 && s) return num * s;
    return 0;
};
export default {
    getCurrentTimeInSeconds,
    getLifetimeAsSeconds
}