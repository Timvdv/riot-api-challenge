import React, { Component } from 'react';

export default class Input extends Component {
    constructor(props)
    {
        super(props);
    }
    componentDidMount()
    {
        console.log("Input field ready!")
    }
    render() {

        var error;

        if(this.props.error.length)
        {
            error = "<span className='error'>{this.props.error[0]}</span>";
        }

        return (
            <div className="summoner-name">
                <h1>
                   team <strong>#red</strong> or team <strong>#blue</strong>?
                </h1>
                <p className="match-history">
                    Based on {this.props.matches} matches
                    {error}
                </p>
                <input type="text" placeholder="Enter your Summoner name" {...this.props}/>
            </div>
        );
    };
}
