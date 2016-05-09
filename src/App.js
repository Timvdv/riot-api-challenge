import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Data from './Data';
import Input from './Input';

//If you're on a php env change this to your own API endpoint
var match_history = 10,
       api_url = "http://timvandevathorst.nl/red-vs-blue/api.php"

export default class App extends Component {
    constructor(props)
    {
        super(props);

        //Keep this empty in production
        let sampleData = [
            // {id: 'duration', x: 20, y: 40, z: 60, color : "#2c3e50", text: "Duration:", value: 0},
            // {id: 'kills', x: 12, y: 80, z: 60, color : "#2c3e50", text: "Kills:", value: 0},
            // {id: 'wins', x: 5, y: 60, z: 60, color : "#2c3e50", text: "Wins:", value: 0},
            // {id: 'goldearned', x: 15, y: 10, z: 60, color : "#2c3e50", text: "Gold earned:", value: 0},
            // {id: 'wardplaced', x: 7, y: 25, z: 60, color : "#2c3e50", text: "Wards placed:", value: 0}
        ];

        this.state = {
            domain:{x: [0, 30], y: [0, 100]},
            match_history:  match_history,
            error: [],
            team: {
                red: {
                    score: 0,
                    data: sampleData
                },
                blue: {
                    score: 0,
                    data: sampleData
                }
            }
        };

        this.summoner_name = "";
        this.region = "euw"
        this.summoner_info = {};
        this.timeout = null;
        this.old_str = "";
        this.old_match_history = 0;

        this.handleSummonerName = this.handleSummonerName.bind(this);
        this.getSummonerId = this.getSummonerId.bind(this);
        this.getSummonerMatches = this.getSummonerMatches.bind(this);
        this.getMatchDetails = this.getMatchDetails.bind(this);
        this.updateGraphData = this.updateGraphData.bind(this);
    }
    handleSummonerName(k)
    {
        let el = ReactDOM.findDOMNode(this);

        this.state.error = [];

        //NO SPACES IN SUMMONER NAME!
        this.summoner_name = $('input').val().split(' ').join('').toLocaleLowerCase();
        this.region = $("#region").val();
        this.state.match_history = $("#matches").val();

        //Dont listen when nothing changed
        if(this.old_str == this.summoner_name && this.old_match_history == this.state.match_history)
            return;

        this.old_match_history = this.state.match_history;
        this.old_str = this.summoner_name;

        //Make sure that we only search the summoner name when the timeout is done
        if(this.timeout)
            clearTimeout(this.timeout);

        this.timeout = setTimeout(function () {
            this.getSummonerId();
        }.bind(this), 1000);
    }
    getSummonerId()
    {
        $.get(api_url + '?region='+this.region+'&summoner='+this.summoner_name, function (data)
        {
            this.state.team.red.score = 0;
            this.state.team.blue.score = 0;
            this.state.team.red.data = [];
            this.state.team.blue.data = [];

            if(data[this.summoner_name])
            {
                let summoner = data[this.summoner_name];

                this.summoner_info = {
                    id: summoner.id,
                    name: summoner.name,
                    level: summoner.level,
                    profileIconId: summoner.profileIconId,
                    revisionDate: summoner.revisionDate
                };

                this.getSummonerMatches(this.summoner_info.id);
            }
            else
            {
                this.setState({error: ['Cant find summoner name']});
            }
        }.bind(this))
    }
    getSummonerMatches(id)
    {
        $.get(api_url + '?region='+this.region+'&summoner_id='+id, function (data)
        {
            var i=0;

            if(data.totalGames)
            {
                data.matches.forEach(function (value) {

                    if(i<this.state.match_history)
                    {
                        this.getMatchDetails(value.matchId)
                    }

                    i++;
                }.bind(this));                                
            }
        }.bind(this));
    }
    getMatchDetails(id)
    {
        $.get(api_url + '?region='+this.region+'&match_id='+id, function (data)
        {
            let participant_id = this.getParticipant(data),
                team_id = this.getTeamId(data, participant_id);

            if(team_id == 100)
            {
                this.state.team.blue.score++;
            }

            if (team_id == 200)
            {
                this.state.team.red.score++;
            }

            this.updateGraphData(data, participant_id, team_id);
            this.updateState();

        }.bind(this));
    }
    getParticipant(data)
    {
        var p_id = null;
        //Check which team the player is on
        data.participantIdentities.forEach(function (value) {
            if(this.summoner_info.id == value.player.summonerId)
            {
                p_id = value.participantId;
            }
        }.bind(this));

        return p_id;
    }
    getTeamId(data, participant_id)
    {
        var team_id = null;

        //Check the team of the current participant
        data.participants.forEach(function (value) {
            if(participant_id == value.participantId)
            {
                team_id = value.teamId;
            }
        });

        return team_id;
    }
    updateGraphData(data, participant_id, team_id)
    {
        var team = team_id == 100 ? "blue" : "red",
            team_data = this.state.team[team].data,
            participant = data.participants[participant_id - 1];

        this.state.team[team].data = [
            {id: 'duration', x: 20, y: 40, z: 60, color : "#2c3e50", text: "Duration:", value: (team_data[0] && team_data[0].value ? team_data[0].value : 0) + data.matchDuration},
            {id: 'kills', x: 12, y: 80, z: 60, color : "#2c3e50", text: "Kills:", value: (team_data[1] && team_data[1].value ? team_data[1].value : 0)+ participant.stats.kills},
            {id: 'wins', x: 5, y: 60, z: 60, color : "#2c3e50", text: "Wins:", value: (team_data[2] && team_data[2].value ? team_data[2].value : 0) + (participant.stats.winner ? 1 : 0)},
            {id: 'goldearned', x: 15, y: 10, z: 60, color : "#2c3e50", text: "Gold earned:", value: (team_data[3] && team_data[3].value ? team_data[3].value : 0) + participant.stats.goldEarned},
            {id: 'wardplaced', x: 7, y: 25, z: 60, color : "#2c3e50", text: "Wards placed:", value: (team_data[4] && team_data[4].value ? team_data[4].value : 0) + participant.stats.wardsPlaced}
        ];
    }
    updateState()
    {
        this.setState({team:
        {
            red: {
                score: this.state.team.red.score,
                data: this.state.team.red.data
            },
            blue: {
                score: this.state.team.blue.score,
                data: this.state.team.blue.data
            }
        }
        });
    }
    render() {
        return (
            <div className="App">
                <Input onKeyUp={this.handleSummonerName.bind(null, this.state.team)} team={this.state.team} error={this.state.error} matches={this.state.match_history}/>

                <Data
                  team={this.state.team}
                  domain={this.state.domain} />
            </div>
        );
    };

}