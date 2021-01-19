import React from 'react'
import Alert from 'react-bootstrap/Alert'

export default class Message extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show: false
        }
    }

    componentDidUpdate(){
        if(this.props.msg.length != 0){
            if(this.state.show != this.props.show){
                this.setState({show: this.props.show})
            }
        }
    }

    componentDidMount(){
        this.setState({show: this.props.show})
    }

    render(){
        if(this.props.msg.length < 4){
            return <p></p>
        }

        return(
            <div className="container mt-3">
                <Alert variant='danger' show={this.state.show}>
                    {this.props.msg}
                </Alert>
            </div>
        )
    }
}