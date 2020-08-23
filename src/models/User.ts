import Role from './Role'
enum AllRoles {
    ADMIN,
    USER
}
class User {
    public name: String
    public email: String
    public roles: Array<Role>
    public pwd: String
    public ID: Number

    constructor(name?: String, email?: String, pwd?: String, roles?: Array<AllRoles>) {
        this.pwd = pwd;
        this.name = name;
        this.email = email;
        const userRoles = roles.map(role => new Role(role));
        this.roles = userRoles;
    }

    getJsonObject(): Object {
        const userRoles = this.roles.map(role => role.getJsonObject())
        return {
            email: this.email,
            name: this.name,
            pwd: this.pwd,
            role: userRoles,
            ID: this.ID
        }
    }
}

export default User;