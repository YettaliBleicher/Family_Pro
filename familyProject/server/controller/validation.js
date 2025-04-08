export class Validation {
    static isHebrew(s) {
        for (let i = 0; i < s.length; i++) {
            if ((s[i] < 'א' || s[i] > 'ת') && s[i] !== ' ') {
                return false;
            }
        }
        return true;
    }

    static isEnglish(s) {
        for (let i = 0; i < s.length; i++) {
            if ((s[i] < 'a' || s[i] > 'z') && s[i] !== ' ') {
                return false;
            }
        }
        return true;
    }

    static isMail(s) {
        let atCount = 0, dotCount = 0;
        for (let i = 0; i < s.length; i++) {
            if ((s[i] < 'א' || s[i] >= 'ת') && s[i] === ' ') {
                return false;
            }
            if (s[i] === '@') {
                atCount++;
                if (atCount > 1) {
                    return false;
                }
            }
        }
        if (!s.includes('@') || s.indexOf('@') === 0) {
            return false;
        }
        for (let i = s.indexOf('@'); i < s.length; i++) {
            if (s[i] === '.') {
                if (dotCount === 0) {
                    dotCount++;
                    if (s.indexOf('@') + 1 >= i || i === s.length - 1) {
                        return false;
                    }
                }
            }
        }
        if (dotCount === 0) {
            return false;
        }
        return true;
    }

    static isNum(s) {
        for (let i = 0; i < s.length; i++) {
            if (s[i] < '0' || s[i] > '9') {
                return false;
            }
        }
        return true;
    }

    static isTel(s) {
        if (s === "") {
            return true;
        }
        for (let i = 0; i < s.length; i++) {
            if (s[i] < '0' || s[i] > '9') {
                return false;
            }
        }
        return s.indexOf('0') === 0 && s.length === 9;
    }

    static isPelepon(s) {
        for (let i = 0; i < s.length; i++) {
            if (s[i] < '0' || s[i] > '9') {
                return false;
            }
        }
        return s.indexOf('0') === 0 && s.length === 10;
    }

    static checkId(d) {
        while (d.length < 9) {
            d = '0' + d;
        }
        let sum = 0;
        for (let i = 0; i < d.length; i++) {
            let num = parseInt(d[i], 10);
            if (i % 2 === 0) {
                sum += num;
            } else {
                let doubleNum = num * 2;
                sum += doubleNum < 10 ? doubleNum : doubleNum % 10 + Math.floor(doubleNum / 10);
            }
        }
        return sum % 10 === 0;
    }

    static getNumDay(dayName) {
        const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
        return days.includes(dayName);
    }

    static getNameDay(numDay) {
        const days = ["", "ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
        return days[numDay];
    }
}
