import React from 'react'
import {Text, TouchableOpacity} from 'react-native'
import styles from "../styles";
import GenericPopUp from "./GenericPopUp";

class DeleteBtn extends React.Component {
  constructor(props) {
    super(props);

    // https://www.freecodecamp.org/news/react-changing-state-of-child-component-from-parent-8ab547436271/
    this.deletePopUpReference = React.createRef();
  }

  showDeletePopUp = () => {
    this.deletePopUpReference.current.toggleModal(true);
  };


  render() {
    const {handleDeleteAction} = this.props;
    return (
      <TouchableOpacity
        onPress={this.showDeletePopUp}
        style={[
          {
            width: '100%',
            borderRadius: 4,
            borderWidth: 1,
            marginTop: 10,
            borderColor: '#F39F86'
          }
        ]}
      >
        <Text style={styles.signInText}>Delete</Text>

        <GenericPopUp handleConfirmAction={handleDeleteAction} ref={this.deletePopUpReference}/>
      </TouchableOpacity>
    )
  }
}

export default DeleteBtn
