import React, { Component } from 'react';

class PostComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment : ''
    };
    this.commentTxtInput = React.createRef();
  }

  render() {
    const { comment } = this.state;
    return (
        <div>
            <input
                type="text"
                style={{ width: '90%', height: '50px' }}
                onChange={(e) => this.setState({ comment: e.target.value })}
                placeholder="Type in your comment here"
                ref={this.commentTxtInput}
                value={comment}
            />
            <button style={{ width: '10%' }} onClick={() => this.props.submit(comment)}>
                Submit
            </button>
        </div>
    );
  }
}

export default PostComment;