import React , {Component} from 'react';
import {Modal, Button} from 'react-bootstrap'
import {db,timestamp,feild_value} from './firebase_config';
class  Popup extends Component {
  constructor(props)
  {
    super(props);

    this.handleChange=this.handleChange.bind(this);
    this.newClass=this.newClass.bind(this);
    this.hideModal=this.hideModal.bind(this);
    this.joinClass=this.joinClass.bind(this);
    this.insertCLassToFirestore=this.insertCLassToFirestore.bind(this);
    this.randomString=this.randomString.bind(this);
   
  this.state={
    c_name:"",
    section:"",
    subject:"",
    room:"",
    teacher:"",
    assingment: "",
    material :"",
    students : "",
    unique:"",
    c_desc:"",
    c_ref_button:"",
    form_error:"",
}
}

componentWillReceiveProps(newprops){ 
  if(newprops.editdata!==this.props.editdata)
  {
  this.setState({
     c_name:newprops.editdata.c_name,
     subject:newprops.editdata.subject,
     section:newprops.editdata.section,
     c_desc:newprops.editdata.c_desc,
     room:newprops.editdata.room,
   })
  }
  }
  newClass()
  {
    if(!this.state.c_name)
    {
      this.setState({form_error:'name'})
    }else if(!this.state.section)
    {
      this.setState({form_error:'section'})
    }else if(!this.state.subject)
    {
      this.setState({form_error:'subject'})
    }
    else if(!this.state.room)
    {
      this.setState({form_error:'room'})
    } else if(!this.state.c_desc)
    {
      this.setState({c_desc:'This classroom is cafted carefully for the students of '+this.state.subject+' '+this.state.section+',for '+this.state.c_name+' classes'}) ;
      this.randomString(5,'#aA') 
      //close modal
        this.props.onHide();
    }else
    {
      this.randomString(5,'#aA') 
    //close modal
      this.props.onHide();
    }
    this.setState({buttonState:false})
  }
   randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];


    const uniqueIdRef= db.collection("classes").where("unique","==",result);
    uniqueIdRef.get().then((doc)=> {
      console.log(doc)
        if (doc.size>0) {
         this.randomString(5,'#aA');
        }
       else {
         if(this.props.editClassId && this.props.editdata)
         {
          return this.editCLassToFirestore(result)
         }else
         {
          return this.insertCLassToFirestore(result)
         }
        
      }
   })
  }
   

   insertCLassToFirestore (uniqueId) {

    
           // create class
                var docRef = db.collection("classes");
                docRef
                .add({
                        c_name: this.state.c_name,
                        section: this.state.section,
                        subject: this.state.subject,
                        room: this.state.room,
                        created_at:timestamp,
                        image:Math.floor(Math.random() * (6 - 2) ) + 1 +".png",
                        assingment: '0',
                        material : '0',
                        author:{
                                  id:localStorage.getItem("user"),
                                  name:localStorage.getItem("userName")
                        },
                        users :{
                                      [localStorage.getItem("user")]:
                                      {
                                        id:localStorage.getItem("user"),
                                        name:localStorage.getItem("userName"),
                                        role:"teacher"
                                      }
                        },
                        unique:uniqueId,
                        c_desc:this.state.c_desc,
                        c_ref_button:{}
                }).catch(console.error)
  }
  editCLassToFirestore (uniqueId) {
    
          console.log(this.state.c_name,this.state.section,this.state.subject,this.state.room,this.state.c_desc)
          var docRef = db.collection("classes").doc(this.props.editClassId);
           
                docRef
                .update({
                        c_name: this.state.c_name,
                        section: this.state.section,
                        subject: this.state.subject,
                        room: this.state.room,
                        edited_at:timestamp,
                        c_desc:this.state.c_desc,
                        c_ref_button:{}
                }).catch(console.error)
  }


  joinClass()
  {
    if(this.state.c_code)
    {
        db.collection("classes").where("unique", "==", this.state.c_code)
        .get().then((querySnapshot)=> {
                if(querySnapshot.size>0)
                {
                      querySnapshot.forEach((document)=> {
                        const data =document.data();
                        if(data.author.id===localStorage.getItem('user'))
                        {
                          this.setState({error:"teacher"})
                        }
                        else if(eval("data.users."+localStorage.getItem('user')))
                        {
                          if(eval("data.users."+localStorage.getItem('user')+".role")==="teacher")
                          this.setState({error:"enrolled-teacher"})
                          else if(eval("data.users."+localStorage.getItem('user')+".role")==="student")
                          this.setState({error:"enrolled-student"})
                          console.log("enrolled")
                        }
                        else
                        {
                          document.ref.update({
                           [ "users."+localStorage.getItem("user")]:{
                                                       
                                                          id:localStorage.getItem("user"),
                                                          name:localStorage.getItem("userName"),
                                                          role:"student"
                                                        
                                  }
                          }); 
                          this.props.onHide()
                        }
                      });
              }else
              {
                      this.setState({error:"404"})
              }
      })
  }else this.setState({form_error:"c_code"})
  this.setState({buttonState:false})
  }
  handleChange(e){
    this.setState({[e.target.name]: e.target.value});
    
  }
  hideModal()
  {
    this.props.onHide();
  }
  
    
    render(){
        return(
            <div >
            <Modal
            {...this.props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            ref={this.props.ref}
          >

            <Modal.Body>
              {
              (!this.props.join)?
              
              (
                
                      <div>
                        
                      <div className="form-group">
                        <label htmlFor="c_name">Class name</label>
                       
                        
                        <input 
                        type="text" 
                        name="c_name"
                        className={this.state.form_error==='name'?("form-control err-form"):("form-control")}
                        id="c_name" 
                        aria-describedby="emailHelp" 
                        placeholder="Class name"
                        value={this.state.c_name} 
                        onChange={this.handleChange}  
                        onKeyUp={()=>this.setState({form_error:null})}
                        required/>
                        {
                         this.state.form_error ==='name'?
                          (
                            <div className="form-alert">Class Name is required</div>              
                          )
                         :true
                        
                        }
                       
                      </div>
                      <div className="form-group">
                        <label htmlFor="section">Section</label>
                        
                        <input 
                        type="text" 
                        className={this.state.form_error==='section'?("form-control err-form"):("form-control")}
                        id="section" 
                        placeholder="Section"
                        name="section"
                        value={this.state.section} 
                        onChange={this.handleChange}  
                        onKeyUp={()=>this.setState({form_error:null})}
                        />
                        {
                         this.state.form_error ==='section'?
                          (
                            <div className="form-alert">Section is required</div>              
                          )
                         :true
                        
                        }
                      </div>
                      <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input 
                        type="text" 
                        className={this.state.form_error==='subject'?("form-control err-form"):("form-control")}
                        id="subject" 
                        placeholder="Subject"
                        name="subject"
                        value={this.state.subject} 
                        onChange={this.handleChange}
                        onKeyUp={()=>this.setState({form_error:null})}
                        />
                        {
                         this.state.form_error ==='subject'?
                          (
                            <div className="form-alert">Subject is required</div>              
                          )
                         :true
                        
                        }
                      </div>
                      <div className="form-group">
                        <label htmlFor="room">Room</label>
                        <input 
                        type="text" 
                        className={this.state.form_error==='room'?("form-control err-form"):("form-control")}
                        id="room" 
                        placeholder="Room"
                        name="room"
                        value={this.state.room}  
                        onChange={this.handleChange}
                        onKeyUp={()=>this.setState({form_error:null})}
                        />
                        {
                         this.state.form_error ==='room'?
                          (
                            <div className="form-alert">Room No. is required</div>              
                          )
                         :true
                        
                        }
                      </div>
                      <div className="form-group">
                        <label htmlFor="room">Class Description</label>
                        <input 
                        type="text" 
                        className={this.state.form_error==='desc'?("form-control err-form"):("form-control")}
                        id="c_desc" 
                        placeholder="Class Description"
                        name="c_desc"
                        value={this.state.c_desc} 
                        onChange={this.handleChange}
                        onKeyUp={()=>this.setState({form_error:null})}
                        />
                        {
                         this.state.form_error ==='desc'?
                          (
                            <div className="form-alert">Class Description is required</div>              
                          )
                         :true
                        
                        }
                      </div>
                      {/* <button type="submit" className="btn btn-primary" onClick={this.newClass}>Submit</button> */}
                      <div className="row modal-button-container">
                        <Button className="col btn modal-btn theme-bg text-light text-center" disabled={this.state.buttonState} onClick={()=>this.setState({buttonState:true},this.newClass)}>
                        Submit
                        </Button>
                        <Button className="col btn modal-btn bg-light text-dark text-center" onClick={()=>this.setState({error:null,form_error:null,buttonState:null},this.hideModal)}>
                        Cancel
                        </Button>
                      </div>
                      </div>
            ):(
                  <div>
                  <div className="form-group">
                  <label htmlFor="c_code">Class Code</label>
                  <input 
                  type="text" 
                  className={this.state.form_error==='c_code'?("form-control err-form"):("form-control")}
                  id="c_code" 
                  placeholder="Class Code"
                  name="c_code"
                  value={this.state.c_code} 
                  onChange={this.handleChange}
                  onKeyUp={()=>this.setState({form_error:null})}
                  />
                  {
                         this.state.form_error ==='c_code'?
                          (
                            <div className="form-alert">Class Code is required</div>              
                          )
                         :true
                        
                  }
                </div>
                
                {this.state.error ==='teacher'?
                (
                  <div className="bg-danger text-light form-alert my-4 p-2 text-center">Teachers can't enroll in class</div>              
                ):this.state.error ==='enrolled-teacher'?
                (
                  <div className="bg-danger text-light form-alert my-4 p-2 text-center">Already enrolled as teacher</div>              
                ):this.state.error ==='enrolled-student'?
                (
                  <div className="bg-danger text-light form-alert my-4 p-2 text-center">Already enrolled as student</div>              
                )
               :this.state.error ==='404'?
                ( <div className="bg-danger text-light form-alert my-4 p-2 text-center">Class Not Found</div>):(false)}

                  <div className="row modal-button-container">
                  <Button className="col btn modal-btn theme-bg text-light text-center" disabled={this.state.buttonState} onClick={()=>this.setState({buttonState:true,error:null},this.joinClass)}>
                  Submit
                  </Button>
                  <Button className="col btn modal-btn bg-light text-dark text-center" disabled={this.state.buttonState} onClick={()=>this.setState({error:null,buttonState:null,form_error:null},this.hideModal)}>
                  Cancel
                  </Button>
                </div>

                </div>
              
              
            )
            
            
              
            }
             
              
            </Modal.Body>
          </Modal>
          
     

          </div>
        );
    }
}

export default Popup ;