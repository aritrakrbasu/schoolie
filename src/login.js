import React , {Component} from 'react';
import {fire,provider} from './firebase_config';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
class Login extends Component {

  constructor(props){
    super(props);
    this.login = this.login.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.googleLogin=this.googleLogin.bind(this);

    this.state={
        email:'',
        password:''
    }
  }
  googleLogin(e)
  {

  
         fire.auth().signInWithRedirect(provider);

        fire.auth().getRedirectResult().then(function(result) {
          console.log(result)
          if (result.user) {
            window.location.href='./dashboard'
          } else if (fire.auth().currentUser) {
            window.location.href='./dashboard'
            // User already signed in.
            // Update your UI, hide the sign in button.
          } else {
            // No user signed in, update your UI, show the sign in button.
          }
        });
    
     
}

  login(e){
      
      e.preventDefault();
       
      fire.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(()=> {
       
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
         fire.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then((u) => {
            window.location.href="./dashboard"
           
        }).catch((error)=>
        {
          alert(error.message);
        });

        return;
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode , errorMessage)
      });
  }
  
  handleChange(e){
      this.setState({[e.target.name]: e.target.value});
  }

  render(){
    return(
        <div className="container-fluid">
        <div className="row">
            <div className="col-lg-6 theme-bg h-100 text-center text-light d-none d-lg-block">
    
                <div className="website_desc div-middle">
                    <div className="img-holder w-25 m-auto">
                    <img src="logo.png" className="img-fluid" alt="logo"/>
                    </div>
                    <h1> Shorten </h1>
                    <h3 className="text-white">  Your custom url shortner </h3>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="div-middle">
                <h1 className="website_head"> Login </h1>
                    <form className="login-form text-left mx-auto my-4">
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email address</label>
                             <input type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" value={this.state.email} onChange={this.handleChange} ></input>
                               
                        </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                            <input onChange={this.handleChange} value={this.state.password} type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Password"
                            ></input>
</div>                  
                        <div className="form-group text-center">
                            <button type="submit" onClick={this.login} className="btn theme-bg text-light w-25 p-2 mx-4" id="loginbtn">Login</button>
                        </div>
                        
                        <p>Don't have an account <a href="/register"> register</a></p>
                    </form>
                    <button onClick={this.googleLogin}>Google Login</button>
                    
                </div>
            </div>
        </div> 
        </div> 
    );
  }
}

export default Login;
