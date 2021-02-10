import React , {Component} from 'react';
import {Modal} from 'react-bootstrap'
class Alert extends Component {
    render()
    {
        return(
            <Modal
            {...this.props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            ref={this.otpModalRef}
            dialogClassName="modal-alert"
            >
                <Modal.Body>
                        <div class="container-fluid text-center">
                            <img src="/img/close.png" class="img-fluid" alt="Delete warning" />
                            <h1 class="alert-head">Are you sure ?</h1>
                            <p class="alert-p">Do you really want to delete this class ? this process cannot be undone</p>
                        </div>
                        <div class="container-fluid text-center">
                             <button class="bg-dark text-white btn m-4 btn-large" onClick={this.props.onHide} >Cancel</button>
                             <button class="bg-danger text-white btn m-4 btn-large" onClick={this.props.onConfirm}>Delete</button>
                        </div>
                </Modal.Body>
              </Modal>

        )
    }
}
export default Alert;