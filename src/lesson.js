import React , {Component} from 'react';
import {db,storage,feild_value} from './firebase_config'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {ProgressBar} from 'react-bootstrap';
import { faTrashAlt,faAngleLeft, faPlus, faPen, faTimes} from '@fortawesome/free-solid-svg-icons';
import Alert from './component/custom_alert';
import Sidebar from './component/sidebar';
import AddLesson from './addlesson';


class LessonPage extends Component {

    constructor(props){
      super(props);
      this.selectFile=this.selectFile.bind(this);
      this.deleteLesson=this.deleteLesson.bind(this);
      this.selectLessondel=this.selectLessondel.bind(this);
      this.handleChangeFiles=this.handleChangeFiles.bind(this);
      this.submitAssingment=this.submitAssingment.bind(this);
      this.unsubmitAssingment=this.unsubmitAssingment.bind(this);
      this.state={
          lesson_details:null,
          urls:[]
      }
     
    }
    componentDidMount(){
        const url=this.props.history.location.pathname;
        const url_Det=url.split("/");
       
        const classId=url_Det[4];
        const lessonId=url_Det[6];
        this.setState({classId:classId,lessonId:lessonId})
        const LessonRef=db.collection("classes").doc(classId).collection('lessons').doc(lessonId);
		LessonRef
    	.onSnapshot((doc)=> {
            if(doc.exists)
			{
                const data=doc.data();
                this.setState({lesson_details:data})
                if(data.type==='assingment')
                {
                    const SubmittedAnswerRef=db.collection("classes").doc(classId).collection('lessons').doc(lessonId).collection('essentials').doc('answers');
                    var keys = [];
                    SubmittedAnswerRef.onSnapshot((data)=> {
                        const submitted_by = data.data()
                        for(var key in submitted_by)
                        {
                             keys.push(key);
                             if(key===localStorage.getItem('user')) this.setState({submitted_data:submitted_by[key]})
                             else this.setState({submitted_data:null})
                        }
                        this.setState({submitted_by:keys});
                    })

                }
			}
			else{
				this.props.history.push("/dashboard/class/c/"+classId);

			}
        })
    }
    deleteLesson()
    { 
        db.collection("classes").doc(this.state.classId).collection('lessons').doc(this.state.lessonId).delete();
    }
    handleChangeFiles(e)
    {
        var files=[]
        if(this.state.files)
        {
            files=[...this.state.files]
        }
            files.push(e.target.files[0])
            this.setState({files:files});
        
    }

    selectFile(e)
    {
      e.preventDefault();
      document.getElementById("file_upload").click()
    }
    selectLessondel(index)
    {
      var del_index =index.index;
      var files = [...this.state.files]; // make a separate copy of the array
        files.splice(del_index-1, 1);
        this.setState({files: files});    
    }
    submitAssingment()
    {
        this.setState({turnin:true});
        const uploadFile=this.state.files;
            if(uploadFile)
            {
                uploadFile.forEach((files,index)=>{
                index = index + 1;
                const uploadTask=storage.ref().child(localStorage.getItem('user')+'/'+files.name).put(files);
                uploadTask.on('state_changed',
                (snapshot) =>{
                //progress
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.setState({["progress"+index]:progress})
                } ,
                (error)=>{
                //error
                console.log(error);
                },
                ()=>{
                storage.ref().child(localStorage.getItem('user')+'/'+files.name).getDownloadURL().then(url =>
                    {
                        var urls=[]
                        if(this.state.urls)
                        {
                            urls=[...this.state.urls]
                        }
                        urls.push(url)
                    console.log(urls)
                    this.setState({urls:urls},()=>{
                        if(this.state.files.length === this.state.urls.length)
                        {
                            var docRef = db.collection("classes").doc(this.state.classId).collection("lessons").doc(this.state.lessonId).collection('essentials').doc('answers');
                            const user =localStorage.getItem('user')
                            docRef
                            .set({
                                    [user] : this.state.urls
                                }).then(this.setState({urls:null,files:null})).then( this.setState({turnin:null}))
                        
                        }
                    })
                    })
            
                })
            }
            )
            }
    }
    unsubmitAssingment()
    {
        if(this.state.submitted_data)
        {
            var docRef = db.collection("classes").doc(this.state.classId).collection("lessons").doc(this.state.lessonId).collection('essentials').doc('answers');
            this.state.submitted_data.forEach(downloadurl=>
                {
                    storage.refFromURL(downloadurl).delete().then(
                        docRef.update({
                        [localStorage.getItem('user')]:feild_value.delete()
                    })
                    );
                })
        }
        
    }
    render()
        {
            let closeModal =()=>this.setState({alert:false,editcall:false})
            return(
                <div>
                    <Sidebar />
				<main-container>
                {this.state.lesson_details ?
                (
                    <div>
						<div class="container-fluid class-intro bg-white box-shadow p-4 ">
                        <a href={"/dashboard/class/c/"+this.state.classId}><span><FontAwesomeIcon icon={faAngleLeft} class="fa-2x back-arrow text-dark"/></span></a>
							<div class="row py-4">
							<div class="col-lg-8">
								<h1 class="big-header">{this.state.lesson_details.l_title}</h1>
								<div class="container-teacher-large theme-text">
											<span>By</span><h1> {this.state.lesson_details.author.name}</h1>
								</div>
								<p class="intro-p pre-formated">{this.state.lesson_details.l_desc}</p>
								
							</div>
                            {(this.state.lesson_details.author.id !==localStorage.getItem('user') && this.state.lesson_details.type==='assingment')?
                            (	
                                <div class="col-lg-4 border-black submit-assingment">
									<div class="container pt-2 text-center ">
									<h1 class="small-header text-center my-4">Submit Assingment</h1>
                                    <input 
								  type="file" 
								  class="form-control my-4" 
								  id="file_upload" 
								  placeholder="Lesson Description"
								  name="files"
								  onChange={this.handleChangeFiles}  
								   hidden/>
									
                                    <div class="container-fluid p-0 m-0">
								<ul class="student-upload">
               
               
               
                {this.state.files && this.state.files.map((files,index)=>{
                  index = index + 1;
                  var files_type=files.type.split('/');
								 return( 	<li><div class="row">
										<div class="col-lg-2 p-0">
                      {
                      files_type[0]==='image'?
                      (
                        <img src="/img/broken_image.png" alt=""/>
                      )
                      :
                      files_type[0]==='application'?(files_type[1]==='html'?( <img src="/img/html-5.png.png" alt="" />):files_type[1]==='pdf'?(<img src="/img/test.png" alt=""/>):files_type[1]==='vnd.ms-powerpoint'?(<img src="/img/ppt.png" alt=""/>):files_type[1]==='vnd.openxmlformats-officedocument.presentationml.presentation'?(<img src="/img/ppt.png" alt=""/>):files_type[1]==='msword'?(<img src="/img/doc.png" alt=""/>):files_type[1]==='vnd.openxmlformats-officedocument.wordprocessingml.document'?(<img src="/img/doc.png" alt=""/>):files_type[1]==='vnd.ms-excel'?(<img src="/img/xls.png" alt=""/>):files_type[1]==='vnd.openxmlformats-officedocument.spreadsheetml.sheet'?(<img src="/img/xls.png" alt=""/>):(<h3>FILE</h3>))
                      :
                      true
                      }




										</div>
										<div class="col-8">
											<h1 class="selected-file-name"> {files.name} </h1>
                      {files_type[0]==='image'?(<div className="tags-large">
                                <span class="mr-2 mt-2"> {files_type[0]} </span>
                                </div>)
                                 :files_type[0]==='application'?(files_type[1]==='html'?( <div className="tags-large">
                                 <span class="mr-2 mt-2">HTML </span>
                                 </div>):files_type[1]==='pdf'?(<div className="tags-large">
                                <span class="mr-2 mt-2"> PDF </span>
                                </div>):files_type[1]==='vnd.ms-powerpoint'?(<div className="tags-large">
                                <span class="mr-2 mt-2"> PPT</span>
                                </div>):files_type[1]==='vnd.openxmlformats-officedocument.presentationml.presentation'?(<div className="tags-large">
                                <span class="mr-2 mt-2">PPT</span>
                                </div>):files_type[1]==='msword'?(<div className="tags-large">
                                <span class="mr-2 mt-2"> Word </span>
                                </div>):files_type[1]==='vnd.openxmlformats-officedocument.wordprocessingml.document'?(<div className="tags-large">
                                <span class="mr-2 mt-2"> Word </span>
                                </div>):files_type[1]==='vnd.ms-excel'?(<div className="tags-large">
                                <span class="mr-2 mt-2"> Excel </span>
                                </div>):files_type[1]==='vnd.openxmlformats-officedocument.spreadsheetml.sheet'?(<div className="tags-large">
                                <span class="mr-2 mt-2">Excel</span>
                                </div>):(<h3>FILE</h3>))
                                :true}
											
										</div>
										<div class="col-2">
										<button name={index} class="btn bg-transparent lesson-select-del" onClick={()=>this.selectLessondel({index})}><FontAwesomeIcon icon={faTimes}/></button>
											
										</div>
                                        <div class="col-12">
                                        
                                        </div>
									</div>
                                    <ProgressBar animated now={this.state["progress"+index]} />
                                    </li>)
                  })
                }
									
								</ul>
							</div>
                                {(this.state.submitted_by && this.state.submitted_by.includes(localStorage.getItem('user')))?
                                (<button class="btn theme-bg my-2 text-light w-100 border-round" onClick={this.unsubmitAssingment}>Unsubmit</button>):(
                                    <span>
                                    <button class="btn w-100 my-2 border-round border-black" onClick={this.selectFile} ><FontAwesomeIcon icon={faPlus}/> Add Classwork</button>
                                <button class="btn theme-bg my-2 text-light w-100 border-round" onClick={this.submitAssingment} disabled={this.state.turnin}>Turn In</button>
                                </span>)
                                
                            
                                 }
									
									</div>
                                </div>
                            ):(false)}
							
                            
							</div>
                            {
                            this.state.lesson_details.author.id===localStorage.getItem("user") ?
							(
                                <span>
								<button className="theme-btn bg-danger mx-2 text-white btn float-right"
								onClick={()=>this.setState({alert:true})} ><FontAwesomeIcon icon={faTrashAlt}/></button>
								<button className="theme-btn bg-dark mx-2 text-white btn float-right"
								onClick={()=>this.setState({editcall:true})} ><FontAwesomeIcon icon={faPen}/></button>
							</span>	
							):
							(
							false
							)
						
  							}
						</div>
						<div class="container-fluid py-4">
						<div class="header-div">
								<h1 class="big-header d-block">Files</h1>
						</div>
								<div class="container-fluid">
									<div class="row">
                                    {this.state.lesson_details.files	&& this.state.lesson_details.files.map(files =>
                                    {
                                    return(

												<div class="col-lg-4  py-2">
													<a href={files.url} target="_blank" rel="noopener noreferrer">	
													
														<div class="container lesson-module border-round p-4 box-shadow">
														<div class="row">
														<div class="col-2 lesson-module-icon">
                                                            {
                                                                files.type.split('/')[0] ==='image'?
                                                                (<img src="/img/broken_image.png" class="img-fluid" alt="" />):
                                                                files.type.split('/')[1] ==='application'?
                                                                (<img src="/img/doc.png" class="img-fluid" alt="" />):
                                                                (false)
                                                            }
														</div>
														<div class="col-10"> 
															<div class="course-heading-very-small">{files.name.split('.')[0]}</div>
															<div class="container-teacher theme-text">
															</div>
															
														</div>
														</div>
													
													</div>
													</a>
												</div>
                                    )})}
												
											
									</div>
												
									</div>
								</div>
                                </div>
                ):(true)}
				</main-container>
                <Alert show={this.state.alert} onConfirm={this.deleteLesson} onHide={closeModal} />
                <AddLesson show={this.state.editcall} lessonDetails ={this.state.lesson_details} onHide={closeModal} />
                </div>
                )
        }
}
export default LessonPage;
