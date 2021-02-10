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
class LessonSection extends Component {

    constructor(props)
    {
		super(props)
		this.deleteLesson=this.deleteLesson.bind(this);
        this.state={
			class_details:null,
			lessontype:true,
			assingment:false,
			study_material:false,
			copied:false,
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
    componentDidMount()
    {
        const url=window.location.href;
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
		console.log(class_id)

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
  render(){
    return(
        <div className="container-fluid py-4" id="lessons">
								<h1 className="big-header d-block">Lessons</h1>
								<div className="container-fluid lesson-conatiner">
									<div className="row">
									{this.state.class_details?.author.id===localStorage.getItem("user")?(
									
									<div className="col-lg-4 py-2">
									<button className="btn m-0 p-0 w-100" onClick={() => this.setState({lessontype:!this.state.lessontype})}>
										<div className="container lesson-item theme-bg text-white border-round p-4 box-shadow text-center  add-lesson">
									<span><FontAwesomeIcon icon={faPlus} /></span>
									<h2> Add lessons </h2>
									</div></button>
									<div className="container-fluid d-absolute">
									<ul className="lesson-menu bg-white" hidden={this.state.lessontype}>
										<li><button className="btn" onClick={() => this.setState({showModal:true,lessontype:true,assingment:true})}>Assingment</button></li>
										<li><button className="btn" onClick={() => this.setState({showModal:true,lessontype:true,study_material:true})}>Study Material</button></li>
									</ul>
									</div>
									</div>
									
									):(true)}
									{ 

									this.state.lessons && this.state.lessons.length > 0?
									(

									this.state.lessons && this.state.lessons.map( lessons =>{

									return(
									<div className="col-lg-4 py-2" key={lessons.id}>
													<a href={this.state.class_id+"/l/"+lessons.id}>	
														<div className="container lesson-item bg-white border-round p-4 box-shadow">
															<div className="course-heading-small">{lessons.data.l_title}</div>
															<div className="container-teacher theme-text">
																<span>By</span><h1>{lessons.data.author.name} </h1>
															</div>
															
														
												
													{lessons.data.author.id===localStorage.getItem("user")?
													(
													<span>
													<button className="theme-btn bg-danger text-white btn float-right m-2" 
													onClick={()=>this.deleteLesson(lessons.id)} ><FontAwesomeIcon icon={faTrashAlt}/></button>
			
													</span>
													):false}
													</div>
														</a>
													
									</div>
									)
									})):(true)
									}
												
									</div>
								</div>
						</div>

    )
}
}

export default LessonSection;
