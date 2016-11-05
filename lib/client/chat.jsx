/* eslint-env browser */
/**
 * @fileOverview Chat client entry point
 * Thanks to Tony Spiro (https://github.com/tonyspiro) for the original frontend idea and code
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import S from 'shorti'
import _ from 'lodash'
import io from 'socket.io-client'

class Chat extends React.Component {
  constructor() {
    super()
    this.state = {
      user: null,
      history: []
    }
  }

  componentDidMount() {
    setTimeout(() => {
      ReactDOM.findDOMNode(this.refs.User).focus()
    }, 200)
    fetch('/history').then((res) => {
      res.json().then((json) => {
        this.pushMessages(json)
      })
    })
    let socket = io()
    socket.on('msg', (msg) => {
      if (!this.state.user || this.state.user.name !== msg.user.name) {
        this.pushMessages([msg])
      }
    })
  }

  componentDidUpdate() {
    if (this.refs.Message)
      ReactDOM.findDOMNode(this.refs.Message).focus()
    if (this.refs.MessagesScrollArea)
      ReactDOM.findDOMNode(this.refs.MessagesScrollArea).scrollTop = ReactDOM.findDOMNode(this.refs.MessagesScrollArea).scrollHeight
  }

  pushMessages(messages) {
    let history = this.state.history
    history.push(...messages)
    this.setState({
      user: this.state.user,
      history: history
    })
  }

  postMessage() {
    let msg_body = ReactDOM.findDOMNode(this.refs.Message).value.trim()
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
        this.pushMessages([json])
        ReactDOM.findDOMNode(this.refs.Message).value = ''
      })
    })
  }

  signUp() {
    let name = ReactDOM.findDOMNode(this.refs.User).value.trim()
    if (!name)
      return
    ReactDOM.findDOMNode(this.refs.User).value = ''
    fetch('/signup', {
      method: 'POST',
      body: JSON.stringify({name: name})
    }).then((res) => {
      if (!res.ok) {
        this.refs.Signup.validationState = 'error'
      } else {
        this.refs.Signup.validationState = ''
        res.json().then((json) => {
          this.setState({
            user: json,
            history: this.state.history
          })
        })
      }
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
    let form_input
    if (!this.state.user) {
      form_input = (
        <FormGroup ref='Signup'>
          <ControlLabel ref='Banner'>Hi, what is your name?</ControlLabel>
          <FormControl type='text' ref='User' />
        </FormGroup>
      )
    } else {
      form_input = (
        <FormGroup ref='Post'>
          <ControlLabel ref='Banner'>Hello { this.state.user.name }, type a message:</ControlLabel>
          <FormControl type='text' ref='Message' />
        </FormGroup>
      )
    }

    let list
    if (this.state.history) {
      list = _.sortBy(this.state.history, (msg) => { return msg.created_at }).map((msg) => {
        return (
          <li style={ { listStyle: 'none', ...S('mb-5') } } key={ msg.id }>
            <strong>{ msg.user.name }</strong> { msg.body }
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
          <div ref='MessagesScrollArea' style={ scroll_area_style }>
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