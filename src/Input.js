import React, { Component } from 'react';

export default class Input extends Component {
    constructor(props)
    {
        super(props);
        this.triggerRerender = this.triggerRerender.bind(this);
    }
    triggerRerender()
    {
        this.props.onKeyUp();
    }
    render() {

        var error;

        if(this.props.error.length)
        {
            $('.tweet-your-team').addClass('movedown');
            error = <span className='error'><br/>{this.props.error[0]}</span>;
        }
        else
        {
            $('.tweet-your-team').removeClass('movedown');
        }

        return (
            <div className="summoner-name">
                <h1>
                   team <strong>#red</strong> or team <strong>#blue</strong>?
                </h1>
                <p className="match-history">
                    Based on
                    <select name="matches" id="matches" defaultValue={this.props.matches} onChange={this.triggerRerender}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                    </select> matches
                    {error}
                </p>
                <div className="input-group">
                    <input type="text" placeholder="Enter your Summoner name" {...this.props}/>
                    <select name="region" id="region" defaultValue="euw">
                        <option value="euw">EUW</option>
                        <option value="na">NA</option>
                        <option value="jp">JP</option>
                        <option value="br">BR</option>
                    </select>
                </div>
            </div>
        );
    };
}