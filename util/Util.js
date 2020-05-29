class Util
{
    static generateId(){
        const { v1: uuid } = require('uuid');
        return uuid();
    }

    static objCount(obj){
        var count = 0;
        for(var param in obj){
            if(typeof(obj[param]) == "function")
                continue;
            
            count++;
        }
        return count;
    }
}

module.exports = Util;