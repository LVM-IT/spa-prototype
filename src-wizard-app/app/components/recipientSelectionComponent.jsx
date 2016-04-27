import React from "react";

class SingleRecipientComponent extends React.Component {

    isChecked(roleId, propName){
        if(roleId ===1){
            return this.props.r1[propName];
        }else{
            return this.props.r2[propName];
        }
    }

    selectCopy(event){
        this.props.onCopyChanged(parseInt(event.target.value), !!event.target.checked);
    }

    selectOriginal(event){
        this.props.onOriginalChanged(parseInt(event.target.value), !!event.target.checked);
    }

    render() {
        return (
            <tr>
                <td>{this.props.recipient.empfaengerName}</td>
                <td>{this.props.recipient.rolle}</td>
                <td>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" value={this.props.recipient.rolleId} checked={this.isChecked.bind(this)(this.props.recipient.rolleId, 'original')} onChange={this.selectOriginal.bind(this)}/>
                            Original
                        </label>
                    </div>
                </td>
                <td>
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" value={this.props.recipient.rolleId} checked={this.isChecked.bind(this)(this.props.recipient.rolleId, 'copy')} onChange={this.selectCopy.bind(this)} />
                            Kopie
                        </label>
                    </div>
                </td>
                <td>
                    <select className="form-control">
                        <option>Rechnungen</option>
                    </select>
                </td>
            </tr>
        );
    }
}

class RecipientSelectionComponent extends React.Component {
    render() {
        var recipients = this.props.recipients.map(recipient=> {
            return (
                <SingleRecipientComponent key={recipient.rolleId} recipient={recipient} r1={this.props.r1} r2={this.props.r2} onOriginalChanged={this.props.onOriginalChanged.bind(this)} onCopyChanged={this.props.onCopyChanged.bind(this)}/>
            );
        });
        return (
            <div className="row">
                <div className="col-md-10 col-md-offset-1">
                    <table className="table table-bordered table-responsive">
                        <thead>
                            <tr>
                                <th>Empfänger</th>
                                <th>Rolle</th>
                                <th>Original</th>
                                <th>Kopie</th>
                                <th>Versandart</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipients}
                        </tbody>
                    </table>
                </div>
            </div>);
    }
}

export default RecipientSelectionComponent;
