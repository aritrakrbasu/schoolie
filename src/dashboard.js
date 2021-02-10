import React , {Component} from 'react';
import {db} from './firebase_config';
import './App.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBook ,faPenAlt, faTrashAlt,faShareAlt} from '@fortawesome/free-solid-svg-icons';
import { faFrownOpen} from '@fortawesome/free-regular-svg-icons';
import Popup from './modal';
import Alert from './component/custom_alert'
import Sidebar from './component/sidebar';
import SideAlert from './component/small_alert';

class Dashboard extends Component {
    constructor(props)
    {
        super(props);
        this.createClass = React.createRef();
        this.deleteClass=this.deleteClass.bind(this);
        this.copyClass=this.copyClass.bind(this);
        this.state={
            classes:null,
            showModal : false,
            join:null
        }
    }
    componentDidMount()
    {
        var ClassroomRef = db.collection('classes')
        .where("users."+localStorage.getItem("user")+".id", "==", localStorage.getItem("user"))
       

   


       ClassroomRef
    .onSnapshot((querySnapshot) =>{
        var classes=[];
                querySnapshot.forEach(doc =>{
                    console.log(doc)
                    const data = doc.data();
                    const id   =doc.id;
                    const json ={
                        data:data,
                        id:id
                    }
                    classes.push(json)
                    console.log(classes)
                })
                this.setState({classes:classes})
            
    })
}
    deleteClass()
    {
        this.setState({deleteDocumentId:null,showAlert:false})
        db.collection('classes').doc(this.state.deleteDocumentId).delete();
    }
    copyClass(classID)
    {
        if(navigator.share){
			navigator.share({
				title:'Join my Schoolie class with class code',
				url:classID,
			}).then(
				console.log("thanks for sharing")
			).catch(console.error);
		}else
		{
            this.setState({copied:true})
			var textField = document.createElement('textarea')
			textField.innerText = classID
			document.body.appendChild(textField)
			textField.select()
			document.execCommand('copy')
			textField.remove()
		}
    }
  render(){

    let closeModal = () => this.setState({showModal:false,join:null,showAlert:false,deleteDocumentId:null});
    let closeCopyModal = () => this.setState({copied:null});
    return(
        <div>
   <Sidebar/>
    <main-container>
        {/* <div className="container-fluid p-4">
        <h1 className="big-header"> Progress</h1>
            <div className="row">
                <div className="col-lg-6 py-2">
                    <div className="container bg-white border-round p-4 text-center box-shadow">
                        <div className="container-header">
                            <h1 className="small-header">Statistics </h1>
                        </div>
                        <img src="https://spark.adobe.com/sprout/api/images/978c76de-15ac-4f1f-8a13-55cda19813e0" alt="" className="img-fluid w-50" />
                    </div>
                </div>
                <div className="col-lg-6 py-2">
                    <div className="container bg-white border-round p-4 text-center box-shadow">
                        <div className="container-header">
                            <h1 className="small-header">Statistics </h1>
                        </div>
                        <img src="https://spark.adobe.com/sprout/api/images/978c76de-15ac-4f1f-8a13-55cda19813e0" alt="" className="img-fluid w-50" />
                    </div>
                </div>
            </div>
            
        </div> */}
        <div className="container-fluid p-4">
        <h1 className="big-header d-block">My classes
								<span className="float-right small-text sm-100">
									<button className="theme-btn theme-bg text-white btn mx-2 sm-m-1 sm-text" onClick={() => this.setState({showModal:true})}>Create Class </button>
									<button className="theme-btn bg-dark text-white btn mx-2 sm-m-1 sm-text" onClick={() => this.setState({showModal:true,join:"true"})}>Join Class </button>
								</span>
		</h1>
            <div className="row">
              
                { 
                this.state.classes ?
                ( this.state.classes.length > 0?
                (

                this.state.classes && this.state.classes.map( classes =>{
                    return(

                       <div className="col-lg-3 py-2 col-md-6" key={classes.id}>
                       <div className="container bg-white border-round pt-4 pl-4 pr-4 pb-0 box-shadow">
                           <div className="course-heading-small">{classes.data.c_name}
                               <a className="theme-btn theme-bg text-white btn float-right" href={"dashboard/class/c/"+classes.id}>Check</a>
                           </div>
                           <div className="container-teacher theme-text">
                               <span>By</span><h1> {classes.data.author.name} </h1>
                           </div>
                           
                               {classes.data.author.id===localStorage.getItem("user")?
                               (
                                <div className="tags">
                                <span className="m-1">{Object.keys(classes.data.users).length -1 } students</span>
                               <span className="bg-danger px-2 m-1 text-white"><strong>Class code </strong>:{classes.data.unique}</span>
                               </div>
                               ):
                               ( 
                                <div className="tags">
                                <span>Subject : {classes.data.subject}</span>
                               
                               </div>
                               )
                                }
                           <div className="row">
                               <img src={"img/"+classes.data.image} className="class-img" alt="class decoration" />
                           </div>
                           <div className="class-stats">
                               <ul>
                                   <li><FontAwesomeIcon icon={faBook} /> {classes.data.material} </li>
                                   <li><FontAwesomeIcon icon={faPenAlt} /> {classes.data.assingment}</li>
                                   {classes.data.author.id===localStorage.getItem("user")?
                                   (
                                       <span className="teacher-icon-dash">
                                           <div className="d-md-none w-100"></div>
                                        <button className="theme-btn bg-danger text-white btn float-right mx-1 sm-classes-btn" id={classes.id} onClick={()=>this.setState({showAlert:true,deleteDocumentId:classes.id})} ><FontAwesomeIcon icon={faTrashAlt}/></button>
                                        <button className="theme-btn theme-bg text-white btn float-right mx-1 sm-classes-btn" onClick={()=>this.copyClass(classes.data.unique)} ><FontAwesomeIcon icon={faShareAlt}/></button>
                                        </span>
                                   ):
                                   (true)
                                    }
                               </ul>
                           </div>
                       </div>

                   </div>
                    )
                })
                )
                :
                (<div className="text-center nothing text-dark w-100">Nothing to show <FontAwesomeIcon icon={faFrownOpen}/></div>)
            
                ):
                (
                    <div className="col-lg-3 col-md-6  py-2">
                    <div className=" bg-white border-round p-4 box-shadow">
									<div className="loading-big"></div>
									<div className="loading-small"></div>
									<div className="loading-image"></div>
									<div className="loading-big"></div>
									<div className="loading-big"></div>	
					</div>
					</div>
                )
  } 
            </div>
            
        </div>
        
    </main-container>
    <Popup show={this.state.showModal} join={this.state.join} onHide ={closeModal} ref={this.createClass.current}/>
    <Alert show={this.state.showAlert} onHide ={closeModal} onConfirm={this.deleteClass} />
    <SideAlert show={this.state.copied} onHide={closeCopyModal}/>
    </div>
    );
  }
}

export default Dashboard;
