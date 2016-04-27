import React from "react";
class ActionButtonsComponent extends React.Component {




    render() {
        return (
            <div className="row">
                <div className="col-md-6 col-md-offset-3 text-center">
                    <button className="btn" onClick={this.props.cancelAndClose.bind(this)}>Abbrechen</button>
                    {this.props.hasPrevious.bind(this)() ?
                        <button className="btn" onClick={this.props.previousStep.bind(this)}>Zurück</button> : null}
                    {this.props.canFinish.bind(this)() ? null : <button className="btn btn-primary"
                                                             disabled={!this.props.hasNext.bind(this)() || !this.props.isCurrentStepValid.bind(this)()}
                                                             onClick={this.props.nextStep.bind(this)}>Weiter</button>}
                    {this.props.canFinish.bind(this)() ?
                        <button className="btn btn-primary" onClick={this.props.onFinish.bind(this)}>Fertigstellen</button> : null}
                </div>

            </div>
        );
    }
}

export default ActionButtonsComponent;
