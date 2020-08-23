enum AllRoles {
    ADMIN,
    USER
}
  
class Role {

    public roleType: AllRoles

    constructor(role: AllRoles) {
        this.roleType = role
    }

    getJsonObject(): Object {
        return {
            roleType: this.roleType,
        }
    }
}

export default Role