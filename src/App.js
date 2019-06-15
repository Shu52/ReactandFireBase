import React, { Component } from "react";
import "./App.css";
import firebase, { auth, provider } from "./firebase.js";

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: "",
      username: "",
      items: [],
      user: null,
      allUser:{}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this); // <-- add this line
    this.logout = this.logout.bind(this); // <-- add this line
  }

  componentDidMount() {
    const itemsRef = firebase.database().ref("items");
    itemsRef.on("value", snapshot => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          title: items[item].title,
          user: items[item].user
        });
      }
      this.setState({
        items: newState
      });
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
  
  login() {
    auth.signInWithPopup(provider) 
      .then((result) => {
        const user = result.user;
        const allUser = result;
        console.log(allUser.additionalUserInfo.profile);
        console.log(allUser.additionalUserInfo);
        console.log(allUser);
        if (allUser != null) {
          
            console.log("Sign-in provider: " + allUser.credential.providerId);
            console.log("  Provider-specific UID: " + allUser.user.Qb.providerData[0].uid);
            console.log("  Name: " + allUser.additionalUserInfo.profile.name);
            console.log("  Email: " + allUser.additionalUserInfo.profile.email);
            console.log("  Photo URL: " + allUser.additionalUserInfo.profile.picture);
          
        }
        this.setState({
          user,
          allUser
        });
      });
  }

  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref("items");
    const item = {
      title: this.state.currentItem,
      user: this.state.username
    };
    itemsRef.push(item);
    this.setState({
      currentItem: "",
      username: ""
    });
  }

  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }

  



  render() {
    return (
      <div className="app">
        <header>
          <div className="wrapper">
            <h1>Fun Food Friends</h1>
            {this.state.user ? (
              <img src = {this.state.allUser.additionalUserInfo.profile.picture} alt="User Pic"></img>):(<p></p>)}

            {this.state.user ? (
              
              <button onClick={this.logout}>Log Out</button>
            ) : (
              <button onClick={this.login}>Log In</button>
            )}
          </div>
        </header>
        <div className="container">
          <section className="add-item">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="What's your name?"
                onChange={this.handleChange}
                value={this.state.username}
              />
              <input
                type="text"
                name="currentItem"
                placeholder="What are you bringing?"
                onChange={this.handleChange}
                value={this.state.currentItem}
              />
              <button>Add Item</button>
            </form>
          </section>
          <section className="display-item">
            <div className="wrapper">
              <ul>
                {this.state.items.map(item => {
                  return (
                    <li key={item.id}>
                      <h3>{item.title}</h3>
                      <p>
                        Brought By: {item.user}
                        <button onClick={() => this.removeItem(item.id)}>
                          Remove Item
                        </button>
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
          <p> </p>
        </div>
      </div>
    );
  }
}
export default App;
