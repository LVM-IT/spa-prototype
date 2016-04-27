import React from "react";

class SearchComponent extends React.Component {

    render() {
        return (
            <div className="row">
                <div className="col-sm-4 col-sm-offset-8">
                    <div className="form-horizontal">
                        <div className="form-group">
                            <label htmlFor="inputSearch" className="col-sm-2 control-label">Suche</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="inputSearch"
                                       placeholder="Suchbegriff eingeben"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>);
    }
}

export default SearchComponent;


