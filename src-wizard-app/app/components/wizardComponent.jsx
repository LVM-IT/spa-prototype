import React from "react";
import ActionButtonsComponent from "./actionButtonsComponent";
import TemplateSelectionComponent from "./templateSelectionComponent";
import RecipientSelectionComponent from "./recipientSelectionComponent";
import SearchComponent from "./searchComponent";
import WizardService from "../services/wizardService";
import UrlService from "../services/urlService";

export default class WizardComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lasRootUrl: 'http://localhost:8000/',
            step: 0,
            templates: [],
            selectedTemplate: null,
            recipient1: { original: true, copy: false },
            recipient2: { original: false, copy: false },
            selectedRecipients: null
        };
    }

    nextStep(e) {
        e.preventDefault();
        this.setState({
            step: this.state.step + 1
        });
    }

    hasPrevious() {
        return this.state.step && this.state.step > 0;
    }

    hasNext() {
        return this.state.step < 1;
    }

    canFinish() {
        return this.state.step === 1;
    }

    onTemplateSelected(templateId) {
        this.setState({
            selectedTemplate: parseInt(templateId)
        });
    }

    onOriginalChanged(roleId, originalFlag) {
        if (roleId === 1) {
            this.setState({
                recipient1: {
                    original: originalFlag,
                    copy: this.state.recipient1.copy
                }
            });
        } else {
            this.setState({
                recipient2: {
                    original: originalFlag,
                    copy: this.state.recipient2.copy
                }
            })
        }
    }

    onCopyChanged(roleId, copyFlag) {
        if (roleId === 1) {
            this.setState({
                recipient1: {
                    original: this.state.recipient1.original,
                    copy: copyFlag
                }
            });
        } else {
            this.setState({
                recipient2: {
                    original: this.state.recipient2.original,
                    copy: copyFlag
                }
            })
        }
    }

    cancelAndClose() {
        this.widget.closePopup();
    }

    onFinish() {
        let urlService = new UrlService();
        var openerWidgetId = urlService.getQueryStringParameter('openerWidgetId');
        var messageId = urlService.getQueryStringParameter('messageId');
        var pdfUrl = this.state.lasRootUrl + "lvm-sample.pdf";
        this.widget.sendPopupResponse(openerWidgetId, messageId, { pdfUrl: pdfUrl});
        this.widget.closePopup();
    }

    isCurrentStepValid() {
        if (this.state.step === 0) {
            return this.selectedTemplate !== null;
        }
    }

    previousStep(e) {
        e.preventDefault();
        this.setState({
            step: this.state.step - 1
        });
    }

    componentWillMount() {
        let that = this;
        let wizardService = new WizardService();
        let urlService = new UrlService();
        wizardService.getTemplates(urlService.getQueryStringParameter('vertragId'))
            .done(function (data) {
                that.setState({
                    templates: data.kategorien
                })
            });
        wizardService.getRecipients(urlService.getQueryStringParameter('vertragId'))
            .done(function (data) {
                that.setState({
                    recipients: data
                });
            });
    }

    componentDidMount() {
        let that = this;
        System.import('lvm/core').then(function (lvm) {
            that.widget = new lvm.Widget(that.state.lasRootUrl);
            that.widget.register();
        });
    }

    render() {
        var contentControl = null;
        switch (this.state.step) {
            case 0:
                contentControl =
                    <TemplateSelectionComponent templates={this.state.templates}
                                                currentSelection={this.state.selectedTemplate}
                                                onTemplateSelected={this.onTemplateSelected.bind(this)}/>;
                break;
            case 1:
                contentControl =
                    <RecipientSelectionComponent recipients={this.state.recipients} r1={this.state.recipient1}
                                                 r2={this.state.recipient2}
                                                 onOriginalChanged={this.onOriginalChanged.bind(this)}
                                                 onCopyChanged={this.onCopyChanged.bind(this)}/>;
                break;
            default:
                contentControl = <TemplateSelectionComponent templates={this.state.templates}
                                                             currentSelection={this.state.selectedTemplate}
                                                             onTemplateSelected={this.onTemplateSelected.bind(this)}/>;
                break;
        }

        return (
            <div className="container-fluid">
                <h3>Bitte wählen Sie eine Briefvorlage aus:</h3>
                <SearchComponent/>
                <div className="content-row">
                    {contentControl}
                </div>
                <ActionButtonsComponent nextStep={this.nextStep.bind(this)} hasPrevious={this.hasPrevious.bind(this)}
                                        hasNext={this.hasNext.bind(this)}
                                        isCurrentStepValid={this.isCurrentStepValid.bind(this)}
                                        canFinish={this.canFinish.bind(this)}
                                        onFinish={this.onFinish.bind(this)}
                                        cancelAndClose={this.cancelAndClose.bind(this)}
                                        previousStep={this.previousStep.bind(this)}/>
            </div>
        );
    }
}
