class User extends Classes
{
    static table = "user";
    static entity = "usr";
    static fields = [ "id", "nome", "email", "senha", "status" ];
}

module.exports = User;