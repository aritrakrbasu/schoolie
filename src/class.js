import React , {Component} from 'react';
import {db} from './firebase_config';
import './App.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrashAlt, faAngleLeft, faPlus, faPen, faShareAlt} from '@fortawesome/free-solid-svg-icons';
import AddLesson from './addlesson';
import Alert from './component/custom_alert';
import Popup from './modal';
import SideAlert from './component/small_alert';
import Sidebar from './component/sidebar';
import LessonSection from './lessonSection';
import Participants from './Participants';
class ClassPage extends Component {

    constructor(props)
    {
		super(props)
		this.deleteClass=this.deleteClass.bind(this);
		this.deleteLesson=this.deleteLesson.bind(this);
		this.shareClass=this.shareClass.bind(this);
        this.state={
			class_details:null,
			lessontype:true,
			assingment:false,
			study_material:false,
			copied:false,
			pageState:'lesson', 
        }

	}
	deleteLesson(id)
	{
		console.log(id)
		if(this.state.class_id)
		{
		db.collection('classes').doc(this.state.class_id).collection('lessons').doc(id).delete();
		}
	}
	deleteClass()
    {
				db.collection('classes').doc(this.state.docid).delete();
    }
    componentDidMount()
    {
        const url=this.props.history.location.pathname;
        const class_det=url.split("/c/");
        const class_id=class_det[1];
        this.setState({class_id:class_id})
		const classesRef=db.collection("classes").doc(class_id);
		
		classesRef
    	.onSnapshot((doc)=> {
			if(doc.exists)
			{
			const data =doc.data();
			const docid =doc.id;
			this.setState({class_details:data,docid:docid})
			}
			else{
				this.props.history.push("/dashboard");

			}
    	});
		

		//var classStudentRef = db.collection('classes').where("students", "array-contains", localStorage.getItem("user"));
        
		var LessonRef=db.collection("classes").doc(class_id).collection('lessons');
		LessonRef
		.onSnapshot((querySnapshot) =>{
			var Lessons=[];
					querySnapshot.forEach(doc =>{
						const data=doc.data()
						const lessonid=doc.id
						const json={
							data:data,
							id:lessonid
						}
						Lessons.push(json)
					})
					this.setState({lessons:Lessons})
		})
	}
	shareClass(classID)
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
	//console.log(this.state.lesson_details)
	let closeModal = () => this.setState({showModal:false,join:null,study_material:false,assingment:false,question:false,alert:false,editcall:false});
	let closeCopiedAlert= () => this.setState({copied:false})
    return(
        <div>
       <Sidebar />
				{this.state.class_details ?
				(
				<main-container>
						<div className="container-fluid class-intro bg-white box-shadow p-4 ">
							<a href="/dashboard"><span><FontAwesomeIcon icon={faAngleLeft} className="fa-2x back-arrow text-dark"/></span></a>
							<div className="row py-4">
							<div className="col-lg-8">
								<h1 className="big-header">{this.state.class_details.c_name}</h1>
								<div className="container-teacher-large theme-text">
											<span>By</span><h1>{this.state.class_details.author.name} </h1>
								</div>
								{this.state.class_details.author.id===localStorage.getItem("user")?
                               (
                                <div className="tags">
                                <span className="mr-2 mt-2">{Object.keys(this.state.class_details.users).length-1} students</span>
                               <span className="bg-danger px-2 mr-2 mt-2 text-white"><strong>Class code </strong>:{this.state.class_details.unique}</span>
                               </div>
                               ):
                               ( 
                                <div className="tags">
                                <span>Subject : {this.state.class_details.subject}</span>
                               
                               </div>
                               )
                                }
								{this.state.class_details.c_desc ?
								(
									<div className="description py-2">
										<p className="intro-p">{this.state.class_details.c_desc}</p>
									</div>
								):
								(	<div className="description py-2">
										<button className="btn"><FontAwesomeIcon icon={faPlus}/> Add Description</button>
									</div>
								)}
								
								
								<a className="theme-btn theme-bg text-white btn" href="#lessons">Continue Lesson</a>
								{/* <a className="theme-btn border-black text-dark btn" href="#">Github </a> */}
							</div>
								<div className="col-lg-4">
								<img src={"/img/" +this.state.class_details.image}  alt="class decoration"className="img-fluid" />
								</div>
							</div>
							{this.state.class_details.author.id!==localStorage.getItem("user") ?
							(
							<div className="row px-3">
								<h1 className="small-header d-block">My progress</h1>
									<div className="prog">
										<div className="done theme-bg"></div>
									</div>
							</div>
							):
							(
							<span>
								<button className="theme-btn bg-danger mx-2 text-white btn float-right"
								onClick={()=>this.setState({alert:true})} ><FontAwesomeIcon icon={faTrashAlt}/></button>
								<button className="theme-btn bg-dark mx-2 text-white btn float-right"
								onClick={()=>this.setState({editcall:true})} ><FontAwesomeIcon icon={faPen}/></button>
								<button className="theme-btn bg-dark mx-2 text-white btn float-right"
								onClick={()=>this.shareClass(this.state.class_details.unique)} ><FontAwesomeIcon icon={faShareAlt}/></button>
							</span>	
							)
						
  							}

						</div>
						{this.state.pageState=='lesson' && <LessonSection />}
						{this.state.pageState=='participants' && <Participants data={this.state.class_details.users} />}
						
						<div id="container-floating">
    <div class="nd3 nds" data-original-title="participants" data-placement="left" data-toggle="tooltip">
	<a href="javascript:void(0)" onClick={() =>this.setState({pageState:'participants'})}> <p class="letter"><i class="fas fa-users"></i></p></a>
        <div class="quick-term">Participants</div>
    </div>

	<div class="nd1 nds" data-original-title="lessons" data-placement="left" data-toggle="tooltip">
	<a href="javascript:void(0)" onClick={() =>this.setState({pageState:'lesson'})}> <p class="letter"><i class="fas fa-file-signature"></i></p></a>

        <div class="quick-term">Lessons</div>
    </div>

    <div data-original-title="Create" data-placement="left" data-toggle="tooltip" id="floating-button" onclick="newmail()">
        <p class="plus">+</p>
        <img class="edit" src="http://itagroup.hs.llnwd.net/o40/csg/pse-demo/arrow.png" />
    </div>
</div>
				</main-container>
				):true
  }
  <AddLesson show={this.state.showModal} docid={this.state.docid} question={this.state.question?1:null} assingment={this.state.assingment?1:null} study_material={this.state.study_material?1:null} onHide ={closeModal} />
  <Alert show={this.state.alert} onConfirm={this.deleteClass} onHide={closeModal} />
  <Popup show={this.state.editcall} editdata={this.state.class_details} editClassId={this.state.docid} onHide ={closeModal} />
  <SideAlert show={this.state.copied} onHide ={closeCopiedAlert}  />
                </div>

    )
}
}

export default ClassPage;
