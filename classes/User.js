class User extends Classes
{
    static table = "user";
    static entity = "usr";
    static fields = [ "id", "name", "email", "password", "status" ];
}

module.exports = User;