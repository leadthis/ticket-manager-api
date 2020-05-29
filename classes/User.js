class User extends Classes
{
    static table = "user";
    static entity = "usr";
    static fields = [ "id", "name", "email", "password", "status" ];

    static HashPassword(pass, salt){
        var md5 = require('md5');
        pass = md5(pass + "-" + salt);
        return pass;
    }

}

module.exports = User;