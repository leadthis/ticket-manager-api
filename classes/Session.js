class Session extends Classes
{
    static table = "session";
    static entity = "ssn";
    static fields = [ "id", "user", "last_date" ];
}

module.exports = Session;