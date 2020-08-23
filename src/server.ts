import app from './services/App'
import PromptService from './services/PromptService'

const mainApp = new app();

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
    mainApp.login(answers.email, answers.password);
});

