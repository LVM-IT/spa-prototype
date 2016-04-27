import {Component} from 'angular2/core';
import {ValidationMessage} from '../../../../src-contract-app/lvm/models/validation.message';
import {InteractionService} from '../../services/interaction.service';

@Component({
    selector: 'modal',
    templateUrl: 'app/components/modal/modal.html'
})
export class ModalComponent {
    public hideIFrame: boolean = false;
    public isVisible: boolean = false;
    public errors: Array<ValidationMessage>;

    private _popupSource: string = 'loading.html';
    private _title: string = null;

    constructor(private _interactionService: InteractionService) {

    }

    private static appendResponseInformation(source: string, openerWidgetId: string, messageId: string) {
        source += source.indexOf('?') > 0 ? '&' : '?';
        return source + 'openerWidgetId=' + openerWidgetId + '&messageId=' + messageId;
    }

    /**
     * Show the popup
     * @param {string} source url to show
     * @param {string} title for the modal
     * @param {string} openerWidgetId Id of the widget which wanted to open the modal dialog
     * @param {string} messageId The messageId where the modal dialog should respond to
     */
    public show(source: string, title: string, openerWidgetId: string, messageId: string) {
        this.errors = null;
        this._popupSource = ModalComponent.appendResponseInformation(source, openerWidgetId, messageId);
        this._title = title;
        this.isVisible = true;
    }

    public showValidationResult(errors: Array<ValidationMessage>) {
        this._title = "Validierungsergebnis";
        this.hideIFrame = true;
        this.errors = errors;
        this.isVisible = true;
    }

    public close() {
        this.hideIFrame = false;
        this.errors = null;
        this.isVisible = false;
    }

    public highlightErrorField(fieldName: string) {
        this._interactionService.highlightField(fieldName);
        this.close();
    }
}
