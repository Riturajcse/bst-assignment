import User from '../models/User'
import Resource from '../models/Resource'
import PromptService from './PromptService'
import Role from '../models/Role'

enum ALLACTIONS {
    READ,
    WRITE,
    DELETE
}

enum AllRoles {
    ADMIN,
    USER
}
class Utility {
    constructor() {
    }

    private Users: Array<User> = [];
    private Resources: Array<Resource> = [];
    private loggedInUser:User;
    private userRoles:any[];

    //populating users
    public registerUsers(): void {
        const adminUser = new User('admin', 'admin@gmail.com', '1234', [AllRoles.ADMIN, AllRoles.USER] );
        const normalUser = new User('user1', 'user1@gmail.com', '1234', [AllRoles.USER]);
        this.Users.push(adminUser);
        this.Users.push(normalUser);
    }

    //populating resources
    public createResouces(): void {
        let res1Map = new Map<any, any>();
        res1Map.set(AllRoles.ADMIN,[ALLACTIONS.READ, ALLACTIONS.WRITE, ALLACTIONS.DELETE]);
        let res1 = new Resource('Res1', res1Map);
        this.Resources.push(res1);
        let res2Map = new Map<any, any>();
        res2Map.set(AllRoles.ADMIN,[ALLACTIONS.READ, ALLACTIONS.WRITE, ALLACTIONS.DELETE]);
        res2Map.set(AllRoles.USER,[ALLACTIONS.READ]);
        let res2 = new Resource('Res2', res2Map);
        this.Resources.push(res2);
        let res3Map = new Map<any, any>();
        res3Map.set(AllRoles.ADMIN,[ALLACTIONS.READ, ALLACTIONS.WRITE, ALLACTIONS.DELETE]);
        res3Map.set(AllRoles.USER,[ALLACTIONS.READ,ALLACTIONS.WRITE, ALLACTIONS.DELETE]);
        let res3 = new Resource('Res3', res3Map);
        this.Resources.push(res3);
    }

    public login(email: String, pass: String): any {
        let foundUser:User;
        this.Users.forEach(user=> {
            if (user.email === email && user.pwd === pass) {
                foundUser = user;
            } 
        });
        if (foundUser) {
            this.loggedInUser = foundUser;
            this.userRoles = foundUser && this.loggedInUser.roles.map(role => AllRoles[role.roleType]);
            this.displayChoices();
        } else {
            console.log('Invalid email or password');
            this.changeUser();
        }
    }

    public changeUser() {
        const messageObj = [
            {
                name: 'email',
                message: 'Enter user email:',
                type: null, 
            },
            {
                type: 'password',
                name: 'password',
                message: 'Enter user password:'
            }
        ]
        PromptService.displayMessages(messageObj).then(answers => {
            this.login(answers.email, answers.password);
        });
    }

    public viewRoles (): void {
        const userRoles = this.loggedInUser.roles.map(role => AllRoles[role.roleType]);
        console.log('Roles are: ', JSON.stringify(userRoles));
        this.displayChoices();
    }

    public createUser (): void {
        const messageObj = [
            {
                name: 'name',
                message: 'Please enter user name:',
                type: null, 
                default: '0',
            },
            {
                name: 'email',
                message: 'Please enter user email:',
                default: '0',
            },
            {
                name: 'pwd',
                message: 'Please enter user password:',
                type: 'password', 
                default: '0',
            },
            {
                name: 'roleTypes',
                message: 'Please select role types:',
                type: 'checkbox',
                choices: ['ADMIN','USER'],
                default: '0',
            }
        ];
        PromptService.displayMessages(messageObj).then(answers => {
            const {email,name,pwd,roleTypes} = answers;
            const newRoles = roleTypes.map(role => AllRoles[role]);
            const newUser = new User(name, email, pwd, newRoles);
            this.Users.push(newUser);
            this.displayChoices();
        });
    }

    public listUsers (): void {
        const allUsers =  this.Users.map(user => user.name);
        console.log('Users are: ', JSON.stringify(allUsers));
        this.displayChoices();
    }

    public exitProgram(): void {
        process.exit();
    }

    public editUserRole (): void {
        let allUsers =  this.Users.map(user => user.email);
        allUsers = allUsers.filter(user => user !== this.loggedInUser.email);
        const messageObj = [
            {
                name: 'email',
                message: 'Please select user:',
                type: 'checkbox', 
                choices: allUsers,
                default: '0',
            },
            {
                name: 'roleTypes',
                message: 'Please select new role types for the user:',
                type: 'checkbox',
                choices: ['ADMIN','USER'],
                default: '0',
            }
        ];
        PromptService.displayMessages(messageObj).then(answers => {
            const {email, roleTypes} = answers;
            const newRoles = roleTypes.map(role => AllRoles[role]);
            const userRoles = newRoles.map(role => new Role(role));
            this.Users.forEach(user=> {
                if (user.email === email[0]) {
                    user.roles = userRoles;
                } 
            });

            this.displayChoices();
        });
    }

    public accessResource (): void {
        const resourceNames = this.Resources.map(resource => resource.name);
        const messageObj = [
            {
                name: 'actionType',
                message: 'Please enter action type:',
                type: 'checkbox', 
                choices: ['READ','WRITE','DELETE'],
                default: '0',
            },
            {
                name: 'resourceName',
                message: 'Please enter resource name:',
                type: 'checkbox', 
                choices: resourceNames,
                default: '0',
            },
        ];
        PromptService.displayMessages(messageObj).then(answers => {
            const requestedAction = ALLACTIONS[answers.actionType[0]];
            const resource = this.Resources.find(res => res.name === answers.resourceName[0]);
            const userRoles = this.loggedInUser.roles.map(role => role.roleType);
            let permissionGranted:boolean = false;
            userRoles.forEach(userRole => {
               if (resource.accessObj.has(userRole)) {
                   let allowedActions = resource.accessObj.get(userRole);
                   if (allowedActions.indexOf(requestedAction) != -1 && !permissionGranted) {
                       permissionGranted = true;
                       console.log('Permission granted!');
                   }
               }
            })
            if (!permissionGranted) {
                console.log('Permission denied!');
            }
            this.displayChoices();
        });
    }

    public displayChoices(): void {
        const isAdmin = this.userRoles.indexOf(AllRoles[0]) !== -1;
        let messageObj = [];
        if (isAdmin) {
            messageObj.push(            {
                name: 'options',
                message: '\nPress 1 for login as another user\nPress 2 for creating new user\nPress 3 for getting users list\nPress 4 for editing user role\nPress 5 for accessing resource\nPress 6 for exit\n:',
                type: null, 
            });
        } else {
            messageObj.push(            {
                name: 'options',
                message: '\nPress 1 for login as another user\nPress 2 for viewing your roles\nPress 3 for accessing resource\nPress 4 for exit:',
                type: null, 
            });
        }
        PromptService.displayMessages(messageObj).then(answers => {
            this.processInput(parseInt(answers.options), isAdmin);
        });
    }

    public processInput(input:Number, isAdmin:Boolean) :any {
        if (isAdmin) {
            switch(input) {
                case 1:
                    this.changeUser();
                    break;
                case 2:
                    this.createUser();
                    break;
                case 3:
                    this.listUsers();
                    break;
                case 4:
                    this.editUserRole();
                    break;
                case 5:
                    this.accessResource();
                    break;
                case 6:
                    this.exitProgram();
                    break;
                default:
                    console.log('Invalid input');
                    this.displayChoices();

            }  
        } else {
            switch(input) {
                case 1:
                    this.changeUser();
                    break;
                case 2:
                    this.viewRoles();
                    break;
                case 3:
                    this.accessResource();
                    break;
                case 4:
                    this.exitProgram();
                    break;
                default:
                    console.log('Invalid input');
                    this.displayChoices();
            }
        }
    }
}

export default Utility;