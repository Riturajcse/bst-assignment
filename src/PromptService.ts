import inquirer from 'inquirer';

type msgType = {
    message: String, 
    name: String,
    type?: String,
    choices?: String[]
}
class PromptService {
    constructor(){
    }

    public static displayMessages (messages: msgType[]): any {
        let allMsgs = []
        messages.forEach(msgObj => {
            let tempObj:any = {
                name: msgObj.name,
                message: msgObj.message,
                default: null
            }
            if (msgObj.type) {
                tempObj.type = msgObj.type;
            }
            if (msgObj.choices) {
                tempObj.choices = msgObj.choices;
            }
            allMsgs.push(tempObj);
        });
        return inquirer.prompt(allMsgs);        
    }
}

export default PromptService