import React , {Component} from 'react';
import { Link } from 'react-router-dom';
import {fire} from './firebase_config';


class Register extends Component {

    constructor(props){
        super(props)
        this.handleChange=this.handleChange.bind(this);
        this.register=this.register.bind(this);
        this.state={
            email:'',
            password:'',
            name:'',
            registrationError:'',
            loading:false
        }
      }
      register(e){
        e.preventDefault();
        this.setState({registrationError:""});
        this.setState({loading:true}); 
        if(this.state.password.length<6)
        {
            this.setState({registrationError:"Password must be greater than 6 characters",loading:false});
        }else
        {
            fire.auth().createUserWithEmailAndPassword(this.state.email,this.state.password).then((u) => {
                var user = fire.auth().currentUser;
                user.updateProfile({
                    displayName: this.state.name
                }).then(function() {
                   window.location.href="./dashboard"
                }, function(error) {
                    console.log(error)
                });     
                this.setState({loading:false});
                
            }).catch((error)=>
            {
                 this.setState({registrationError:error.message});
                 this.setState({loading:false});
            });
        } 
    }
      handleChange(e){
          this.setState({[e.target.name]: e.target.value});
      }
    

    render(){
        return(
                            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-6 theme-bg h-100 text-center text-light">

                        <div className="website_desc div-middle">
                            <div className="img-holder w-25 m-auto">
                            <img src="logo.png" className="img-fluid" alt="logo"/>
                            </div>
                            <h1> Schoolie </h1>
                            <h3 className="text-white">  Your virtual School </h3>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="div-middle">
                        <h1 className="website_head"> Register </h1>
                            <form className="login-form text-left mx-auto my-4" onSubmit={this.register}>
                            <div className="form-group">
                                <label for="exampleInputEmail1">Full Name</label>
                                    <input type="text" name="name" className="form-control" id="fullname" aria-describedby="name" placeholder="Enter your full name" value={this.state.name} onChange={this.handleChange} ></input>
                                    
                                </div>
                            <div className="form-group">
                                <label for="exampleInputEmail1">Email address</label>
                                    <input type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" value={this.state.email} onChange={this.handleChange} ></input>
                                    
                                </div>
                            <div className="form-group">
                                <label for="exampleInputPassword1">Password</label>
                                    <input onChange={this.handleChange} value={this.state.password} type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Password"
                                    ></input>
                </div>                  
                                <div className="form-group text-center">
                                    <button disabled={this.state.loading} type="submit" className="btn theme-bg text-light w-25 p-2 mx-2" id="loginbtn">Register</button>
                                </div>
                                <p>Have an account <Link to="/login" className="text-primary">Login Now </Link></p>
                            </form>
                            {this.state.registrationError && (<div className="alert alert-danger">{this.state.registrationError}</div>)}
                            
                        </div>
                    </div>
                </div> 
                </div> 
            );
        }
      }

export default Register;
      