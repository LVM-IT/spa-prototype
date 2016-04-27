import React from "react";

class TemplateComponent extends React.Component {
    selectTemplate(event) {
        this.props.onTemplateSelected(event.target.value);
    }

    render() {
        return (
            <div className="radio">
                <label>
                    <input type="radio" name="optionsTemplates" id={this.props.template.id} checked={this.props.currentSelection == this.props.template.id}
                           value={this.props.template.id} onChange={this.selectTemplate.bind(this)}/>
                    {this.props.template.name}
                </label>
            </div>);
    }
}

class TemplateCategoryComponent extends React.Component {

    render() {
        var templates = this.props.category.vorlagen.map(vorlage=> {
            return (<TemplateComponent key={vorlage.id} template={vorlage} currentSelection={this.props.currentSelection} onTemplateSelected={this.props.onTemplateSelected.bind(this)}/>);
        });
        return (
            <div className="panel panel-default">
                <div className="panel-heading">{this.props.category.name}
                    ({this.props.category.vorlagen.length || 'keine Vorlagen in dieser Kategorie'})
                </div>
                <div className="panel-body">
                    {templates}
                </div>
            </div>
        );
    }
}

class TemplateSelectionComponent extends React.Component {

    render() {
        var categories = this.props.templates.map(category=> {
            return (
                <TemplateCategoryComponent key={category.id} category={category} currentSelection={this.props.currentSelection} onTemplateSelected={this.props.onTemplateSelected.bind(this)}/>
            );
        });
        return (<div className="row">
            <div className="col-md-10 col-md-offset-1">
                {categories}
            </div>
        </div>);
    }
}

export default TemplateSelectionComponent;
