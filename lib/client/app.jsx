/* eslint-env browser */
import React from 'react'
import ReactDOM from 'react-dom'
import { Input } from 'react-bootstrap'
import S from 'shorti'
import _ from 'lodash'

class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
      history: []
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.refs.user.refs.input.focus()
    }, 100)
    fetch('/history').then((res) => {
      res.json().then((json) => {
        this.setState({
          user: this.state.user,
          history: json
        })
      });
    })
  }

  componentDidUpdate() {
    if (this.refs.message)
      this.refs.message.refs.input.focus()
    if (this.refs.messages_scroll_area)
      this.refs.messages_scroll_area.scrollTop = this.refs.messages_scroll_area.scrollHeight
  }

  postMessage() {
    let msg_body = this.refs.message.refs.input.value.trim()
    if (!msg_body)
      return
    let msg = {
      user: this.state.user,
      body: msg_body
    }
    fetch('/post', {
      method: 'POST',
      body: JSON.stringify(msg)
    }).then((res) => {
      res.json().then((json) => {
        let history = this.state.history
        history.push(json)
        this.setState({
          user: this.state.user,
          history: history
        })
        this.refs.message.refs.input.value = ''
      })
    })
  }

  signUp() {
    let name = this.refs.user.refs.input.value.trim()
    if (!name)
      return
    this.refs.user.refs.input.value = ''
    fetch('/signup', {
      method: 'POST',
      body: JSON.stringify({name: name})
    }).then((res) => {
      res.json().then((json) => {
        this.setState({
          user: json,
          history: this.state.history
        })
      })
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    if (this.state.user)
      this.postMessage()
    else
      this.signUp()
  }

  render() {
    let form_input;
    if (!this.state.user) {
      form_input = (
        <div>
          Hi, what is your name?<br />
          <Input type="text" ref="user" />
        </div>
      )
    } else {
      form_input = (
        <div>
          Hello { this.state.user.name }, type a message:<br />
          <Input type="text" ref="message" />
        </div>
      )
    }

    let list;
    if (this.state.history) {
      list = _.sortBy(this.state.history, (msg) => { return msg.created_at }).map((msg) => {
        return (
          <li style={ { listStyle: 'none', ...S('mb-5') } } key={ msg.id }>
            <b>{ msg.user.name }</b><br/>
            { msg.body }
          </li>
        )
      })
    }
    const scroll_area_style = {
      ...S('h-' + (window.innerHeight - 140)),
      overflowY: 'scroll'
    }

    return (
      <div>
        <div style={ S('pl-15') }>
          <div ref="messages_scroll_area" style={ scroll_area_style }>
            <ul style={ S('p-0') }>{ list }</ul>
          </div>
        </div>
        <div style={ S('absolute b-0 w-100p pl-15 pr-15') }>
          <form onSubmit={ this.handleSubmit.bind(this) }>
            { form_input }
          </form>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Chat />, document.getElementById('chat'))