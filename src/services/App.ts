import User from '../models/User'
import Utility from './UtilityService'

const UtilityService = new Utility();

class App {
    public UtilityService:Utility;
    public userRoles : any[]

    constructor() {
        this.UtilityService = new Utility()
        this.init()
    }

    public login(email: String, pass: String): void {
        UtilityService.login(email, pass);
    }

    public displayChoices():void {
        UtilityService.displayChoices();
    }

    private init(): void {
        UtilityService.registerUsers();
        UtilityService.createResouces();
    }
}

export default App;