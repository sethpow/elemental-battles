import React, { Component } from 'react';
// Components
import Button from '../Button/Button';

export default class Login extends Component {
    constructor(props) {
        // Inherit constructor
        super(props);
        // State for form data and error message
        this.state = {
          form: {
            username: '',
            key: '',
          },
        }
        
        // Bind functions
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Runs on every keystroke to update the React state
    handleChange(event) {
        const { name, value } = event.target;
        const { form } = this.state;

        this.setState({
            form: {
            ...form,
            [name]: value,
            },
        });
    }

    // Handle form submission to call api
    handleSubmit(event) {
        // Stop the default form submit browser behaviour
        event.preventDefault();

        // TODO: submit transactions to smart contract
    }

    render() {
        // Extract data from state
        const { form } = this.state;

        return (
        <div className="Login">
            <div className="title">Elemental Battles - powered by EOSIO</div>
            <div className="description">Please use the Account Name and Private Key generated in the previous page to log into the game.</div>
            <form name="form" onSubmit={this.handleSubmit}>
            <div className="field">
                <label>Account name</label>
                <input
                    type="text"
                    name="username"
                    value={ form.username }
                    placeholder="All small letters, a-z, 1-5 or dot, max 12 characters"
                    onChange={ this.handleChange }
                    pattern="[\.a-z1-5]{2,12}"
                    required
                    autoComplete = "off"
                />
            </div>
            <div className="field">
                <label>Private key</label>
                <input
                    type="password"
                    name="key"
                    value = { form.key }
                    onChange={ this.handleChange }
                    pattern="^.{51,}$"
                    required
                />
            </div>
            <div className="bottom">
                <Button type="submit" className="green">
                { "CONFIRM" }
                </Button>
            </div>
            </form>
        </div>
        )
    }
}