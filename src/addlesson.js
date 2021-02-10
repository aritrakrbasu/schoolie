import React , {Component} from 'react';
import {Modal} from 'react-bootstrap'
import {db,timestamp,storage} from './firebase_config';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes, faPlus} from '@fortawesome/free-solid-svg-icons';
class  AddLesson extends Component {
  constructor(props)
  {
    super(props);
    this.hideModal=this.hideModal.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.handleChangeFiles=this.handleChangeFiles.bind(this);
    this.AddLesson=this.AddLesson.bind(this);
    this.selectLessondel=this.selectLessondel.bind(this);
    this.AddLesson_firestore=this.AddLesson_firestore.bind(this);
    this.selectFile=this.selectFile.bind(this);
    this.state={
      docid:"",
      files:"",
      urls:[],
      title:"",
      description:"",
      points:"",
      due_date:"",
      youtube_links:"",
      setting:"",
      created_at:"",
      
    }
  }
  AddLesson()
  {
    const doc_id=this.props.docid;
    const uploadFile=this.state.files;
    if(uploadFile)
    {//.map
    uploadFile.forEach(files =>
      {
        const uploadTask=storage.ref().child(localStorage.getItem('user')+'/'+files.name).put(files);
        uploadTask.on('state_changed',
        (snapshot) =>{
          //progress
    
        } ,
        (error)=>{
          //error
          console.log(error);
        },
        ()=>{
          //complete
         
          storage.ref().child(localStorage.getItem('user')+'/'+files.name).getDownloadURL().then(url =>
            {
              var urls=[]
              if(this.state.urls)
              {
                urls.push(...this.state.urls)
              }
              console.log(this.state.urls)
              console.log(urls)
                 
              const file={
                name:files.name,
                url:url,
                type:files.type
              }
            
              urls.push(file)

              this.setState({urls:urls},()=>{
                      console.log("files="+this.state.files.length,"urls="+this.state.urls.length)
                      if(this.state.files.length === this.state.urls.length)
                      {
                          this.AddLesson_firestore(doc_id)
                      }
              })
            })
    
        })
      })
    }else
    {
      this.AddLesson_firestore(doc_id)
    }
   
  
  }
  componentWillReceiveProps(newprops){ 
    if(newprops.lessonDetails!==this.props.lessonDetails)
    {
      this.setState({
        title:newprops.lessonDetails.l_title,
        description:newprops.lessonDetails.l_desc,
      })
    }
}

  AddLesson_firestore(doc_id)
  {
    var type="";
    if(this.props.assingment)
    {
      type='assingment'
    }else if(this.props.study_material)
    {
      type='study_material'
    }else if(this.props.question)
    {
      type='question'
    }
    var docRef = db.collection("classes").doc(doc_id).collection("lessons");
    docRef
    .add({
      l_title:this.state.title,
      l_desc:this.state.description,       
      files:this.state.urls,
      youtube_links:this.state.youtube_links,
      type:type,
      author:{
                id:localStorage.getItem("user"),
                name:localStorage.getItem("userName")
              },
      setting:{
        score_assingned:this.state.points,
        due_date:this.state.due_date
      },
      created_at:timestamp,
    }).then(
      this.setState({title:null,description:null,points:null,due_date:null,files:null,youtube_links:null,setting:null,created_at:null,urls:null}),
      this.props.onHide()
    )
    
  }
  handleChange(e)
  {
    this.setState({[e.target.name]: e.target.value});
  }

  
  handleChangeFiles(e)
  {
    var files=[]
    if(this.state.files)
    {
       files.push(...this.state.files)
    }
      files.push(e.target.files[0])
      this.setState({files:files});
    
  }
 
  hideModal()
  {
    this.props.onHide();
  }
  selectLessondel(index)
  {
    var del_index =index.index;
    var files = [...this.state.files]; // make a separate copy of the array
      files.splice(del_index-1, 1);
      this.setState({files: files});    
  }
  selectFile(e)
  {
    e.preventDefault();
    document.getElementById("file_upload").click()
  }
    
    render(){
        return(
            <div>
            <Modal
            {...this.props}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            ref={this.otpModalRef}
            dialogClassName="modal-full"
          >

            <Modal.Body>
              <div>
            <div className="container-fluid">
            <div className="row modal-head">
            <button className="btn fa-large" onClick={this.hideModal}> <FontAwesomeIcon icon ={faTimes} size='2x'/></button>
            <button className="theme-bg text-white btn m-4 float-right" onClick={this.AddLesson} disabled ={!this.state.title}>Add Lesson</button>
            </div>
					<div className="row">
						<div className="col-lg-9  p-4">
							<h1 className="big-header">Add lesson</h1>
							<form className="add-lesson">
							 <label className="m-0" for="section"> Title</label>
								 <input 
								  type="text" 
								  className="form-control" 
								  id="title" 
								  placeholder="Lesson Title"
								  name="title"
								  value={this.state.title} 
								  onChange={this.handleChange}  
								  />
							<label className="m-0" for="section"> Description</label>
								 <textarea 
								  type="text" 
								  className="form-control" 
								  id="description" 
								  placeholder="Lesson Description"
								  name="description"
								  value={this.state.description} 
								  onChange={this.handleChange}  
								  rows="5"></textarea>


                   <input 
                    type="file" 
                    className="form-control my-4" 
                    id="file_upload" 
                    placeholder="Lesson Description"
                    name="files"
                    onChange={this.handleChangeFiles}  
                    hidden/>

                 
							</form>
              <button className="btn w-100 my-2 border-round border-black" onClick={this.selectFile}><FontAwesomeIcon icon={faPlus}/> Add files</button>
              <div className="container-fluid p-0 m-0">
								<ul className="selected-files">
                {this.state.files && this.state.files.map((files,index)=>{
                  index = index + 1;
                  var files_type=files.type.split('/');
								 return( 	<li key={index}><div className="row">
										<div className="col-lg-2 selected-icon p-0">
                      {
                      files_type[0]==='image'?
                      (
                        <img src="/img/broken_image.png" alt=""/>
                      )
                      :
                      files_type[0]==='application'?(files_type[1]==='html'?( <img src="/img/html-5.png.png" alt=""/>):files_type[1]==='pdf'?(<img src="/img/test.png" alt=""/>):files_type[1]==='vnd.ms-powerpoint'?(<img src="/img/ppt.png" alt=""/>):files_type[1]==='vnd.openxmlformats-officedocument.presentationml.presentation'?(<img src="/img/ppt.png" alt=""/>):files_type[1]==='msword'?(<img src="/img/doc.png" alt=""/>):files_type[1]==='vnd.openxmlformats-officedocument.wordprocessingml.document'?(<img src="/img/doc.png" alt=""/>):files_type[1]==='vnd.ms-excel'?(<img src="/img/xls.png" alt=""/>):files_type[1]==='vnd.openxmlformats-officedocument.spreadsheetml.sheet'?(<img src="/img/xls.png" alt=""/>):(<h3>FILE</h3>))
                      :
                      true
                      }
										</div>
										<div className="col-9">
											<h1 className="selected-file-name"> {files.name} </h1>
                      {files_type[0]==='image'?(<div className="tags-large">
                                <span className="mr-2 mt-2"> {files_type[0]} </span>
                                </div>)
                                 :files_type[0]==='application'?(files_type[1]==='html'?( <div className="tags-large">
                                 <span className="mr-2 mt-2">HTML </span>
                                 </div>):files_type[1]==='pdf'?(<div className="tags-large">
                                <span className="mr-2 mt-2"> PDF </span>
                                </div>):files_type[1]==='vnd.ms-powerpoint'?(<div className="tags-large">
                                <span className="mr-2 mt-2"> PPT</span>
                                </div>):files_type[1]==='vnd.openxmlformats-officedocument.presentationml.presentation'?(<div className="tags-large">
                                <span className="mr-2 mt-2">PPT</span>
                                </div>):files_type[1]==='msword'?(<div className="tags-large">
                                <span className="mr-2 mt-2"> Word </span>
                                </div>):files_type[1]==='vnd.openxmlformats-officedocument.wordprocessingml.document'?(<div className="tags-large">
                                <span className="mr-2 mt-2"> Word </span>
                                </div>):files_type[1]==='vnd.ms-excel'?(<div className="tags-large">
                                <span className="mr-2 mt-2"> Excel </span>
                                </div>):files_type[1]==='vnd.openxmlformats-officedocument.spreadsheetml.sheet'?(<div className="tags-large">
                                <span className="mr-2 mt-2">Excel</span>
                                </div>):(<h3>FILE</h3>))
                                :true}
											
										</div>
										<div className="col-1">
										<button name={index} className="btn bg-transparent lesson-select-del" onClick={()=>this.selectLessondel({index})}><FontAwesomeIcon icon={faTimes}/></button>
											
										</div>
									</div></li>)
                  })
                }
									
								</ul>
							</div>


						</div>
						<div className="col-lg-3">
              {this.props.assingment?(
						<div className="container-fluid p-4">
						<h1 className="big-header">Settings</h1>
							<form className="add-lesson">
							 <label className="m-0" for="section"> Points</label>
								 <input 
								  type="text" 
								  className="form-control" 
								  id="points" 
								  placeholder="points"
								  name="points"
								  value={this.state.points} 
								  onChange={this.handleChange}  
								  />
							<label className="m-0" for="section"> Due Date</label>
								 <input 
								  type="date" 
								  className="form-control" 
								  id="due_date" 
								  placeholder="due_date"
								  name="due_date"
								  value={this.state.due_date} 
								  onChange={this.handleChange}  
								  />
							</form>
						</div>
            )
            :true
            }
					</div>
				</div>
        </div>
        </div>
            </Modal.Body>
          </Modal>
          
     

          </div>
        );
    }
}

export default AddLesson ;