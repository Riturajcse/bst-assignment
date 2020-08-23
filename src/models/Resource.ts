class Resource {
    public name : String
    public accessObj: Map<any,any>
    constructor(name:String, accessObj: Map<any,any>){
        this.name = name
        this.accessObj = accessObj
    }
}

export default Resource