import React , {Component} from 'react';
import {Modal, ProgressBar} from 'react-bootstrap'
class SideAlert extends Component {
    constructor(props)
    {
        super(props);
        this.state={
            timer:null
        }
    }
    componentDidMount()
    {
            var downloadTimer = setInterval(()=>{
                this.props.onHide();
            }, 6000)
           

    }
   
    render()
    {

        return(
            <Modal
            {...this.props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            ref={this.otpModalRef}
            dialogClassName="small-alert"
            animation="true"
            backdropClassName="transparent-bg"
            >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body close>
                        <div class="container-fluid text-center">
                           
                            <p class="alert-p">Classcode is copied to your clipboard</p>
                        </div>
                </Modal.Body>
                {/* <ProgressBar now={this.state.timer}/> */}
              </Modal>

        )
    }
}
export default SideAlert;