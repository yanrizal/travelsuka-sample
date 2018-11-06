import React from 'react';
import Modal from 'react-responsive-modal';

class ModalPopup extends React.Component {

  // onOpenModal = () => {
  //   this.setState({ open: true });
  // };

  onCloseModal = () => {
    this.props.onCloseModal({ open: false });
  };

  render() {
    return (
      <div className="modal-loading" style={{width:'150px'}}>
        <Modal open={this.props.open} onClose={this.onCloseModal} little showCloseIcon={false}>
          <img src="/img/iconmodal.png" width="85" />
          <p>Please wait</p>
          <img src="/img/loading.gif" width="100" style={{marginTop:'-20px',marginBottom:'-20px'}}/>
        </Modal>
      </div>
    );
  }

}

export default ModalPopup