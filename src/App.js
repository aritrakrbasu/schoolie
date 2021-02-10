//Importing all important files 

import React , {Component} from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.css';
import fire from './firebase_config';
import {PrivateRoute} from './privateroute';
import Login from "./login";
import Register from "./register";
import Dashboard from "./dashboard";
import ClassPage from "./class";
import LessonPage from "./lesson"
class App extends Component {

  constructor(props){
    super(props);
    this.state={
      user:{},
    }
  }


  componentDidMount(){
    this.authListener();
  }

  authListener(){
    fire.auth().onAuthStateChanged((user) => {
     // console.log(user)
      if(user)
      {
        
        localStorage.setItem('user',user.uid);
        localStorage.setItem('userName',user.displayName);
        this.setState({user});
        
      }else
      {
        
        localStorage.removeItem('user');
        localStorage.removeItem('userName');
        this.setState({user: null});
      }
    });


 

  }

  render(){


    return(
    
      <div className="App">
        <BrowserRouter>
       
        <Switch>      
          {/* <Route exact path="/" component ={Public}></Route> 
          <Route  path="/v/:id" component ={Destination}></Route> 
           */}
          <Route exact path="/login" component ={Login}></Route>   
          <Route exact path="/register" component ={Register}></Route>
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/dashboard/class/c/:classid" component={ClassPage} />
          <PrivateRoute exact path="/dashboard/class/c/:classid/l/:lessonid" component={LessonPage} />
          </Switch>

        </BrowserRouter>
      </div>
    );
  }
}

export default App;
