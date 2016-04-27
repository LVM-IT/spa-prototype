class WizardService {


    getTemplates(vertragId) {
        return $.ajax(`http://lvm-rest-api.azurewebsites.net/vertrag/${vertragId}/briefvorlagen`, {
            dataType: 'json',
            accepts: 'application/json'
        });
    }

    getRecipients(vertragId) {
        return $.ajax(`http://lvm-rest-api.azurewebsites.net/vertrag/${vertragId}/briefempfaenger`, {
            dataType: 'json',
            accepts: 'application/json'
        });
    }
}

export default WizardService;
