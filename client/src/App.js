import React, { Component } from 'react';
import axios from 'axios';
import './App.css'
import Login from './User/Login'
import Register from './User/Register'
import PostComment from './Comments/PostComment'
const baseUrl = 'http://localhost:3001';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLoggedIn: false,
      userData: null,
      errorMsg: null,
      commentList: [],
      editData: null,
      replyData: null,
      comment: ''
    };
    this.commentTxtInput = React.createRef();
  }

  componentDidMount() {
    this.getDataFromDb();
  }

  

  getDataFromDb = () => {
    axios.get(`${baseUrl}/api/getAllComments`)
    .then((data) => {
      let Comments = [];
      data.data.data.forEach(comment => {
        if(!comment.parent_comment_id){
          const childComments = data.data.data.filter((com)=>{return comment._id === com.parent_comment_id});
          Comments.push({
            parentComment : comment,
            childComments: childComments
          })
        }
      });
      console.log('Comments',Comments)
      this.setState({
        commentList : Comments
      })
    })
  };

  userLogin = (type,obj) => {
    if(!obj.username || !obj.password){
      return;
    }
    let url;
    if(type==='login'){
      url = `${baseUrl}/api/login`
    }
    else if(type === 'signup'){
      url = `${baseUrl}/api/signup`
    }
    axios.post(url, {
      dataObj : obj
    }).then((response)=>{
      console.log('response',response)
      if(response && response.data && response.data.success){
        this.setState({
          userLoggedIn : true,
          userData : response.data.user,
          errorMsg: null
        })
      }
      else{
        this.setState({
          errorMsg : 'No user found'
        })
      }
    }).catch((err)=>{
      console.log('err',err)
      this.setState({
        errorMsg : 'Some error occured. Please try again'
      })
    });
  };

  submit = () => {
    const {userLoggedIn,userData, editData, replyData, comment} = this.state;
    if(editData && Object.keys(editData).length>0){
      editData.comment = comment;
      this.post('edit',editData)
      return;
    }
    if(replyData && Object.keys(replyData).length>0){
      const obj = {
        comment : comment,
        parent_comment_id : replyData.parent_comment_id ? replyData.parent_comment_id : replyData._id,
        username : userData.username
      }
      this.post('reply',obj);
      return;
    }
    if(!comment){
      return;
    }
    if(!userLoggedIn){
      this.setState({
        errorMsg : 'Please login to post comment'
      })
      return;
    }
    axios.post(`${baseUrl}/api/post/comment`, {
      comment: comment,
      username: userData.username,
    }).then((response)=>{
      if(response && response.data && response.data.comment){
        this.getDataFromDb();
        this.setState({
          errorMsg: null,
          editData: null,
          replyData: null,
          comment: ''
        })
      }
      else{
        this.setState({
          errorMsg : 'No user found'
        })
      }
    }).catch((err)=>{
      console.log('err',err)
      this.setState({
        errorMsg : 'Some error occured. Please try again'
      })
    });
  };

  post = (type,obj) => {
    let url = '';
    if(type==='edit'){
      url = `${baseUrl}/api/edit/comment`; 
    }
    else if(type ==='reply'){
      url = `${baseUrl}/api/reply/comment`; 
    }
    
    axios.post(url, {
      commentObj: obj,
    }).then((response)=>{
      if(response && response.data && response.data.success ){
        this.getDataFromDb();
        this.setState({
          errorMsg: null,
          editData: null,
          replyData: null,
          comment: ''
        })
      }
      else{
        this.setState({
          errorMsg : "Couldn't edit your comment"
        })
      }
    }).catch((err)=>{
      console.log('err',err)
      this.setState({
        errorMsg : 'Some error occured. Please try again'
      })
    });
  };

  editOrReply = (type,commentObj) => {
    this.commentTxtInput.current.focus();
    if(type==='edit'){
      this.setState({
        comment: commentObj.comment,
        editData : commentObj
      })
    }
    else if(type==='reply'){
      this.setState({
        comment: '',
        replyData : commentObj
      })
    }
  };

  logout = () => {
    this.setState({
      userLoggedIn : false,
      userData : null,
      errorMsg: null
    })
  };

  render() {
    const { commentList, errorMsg, userLoggedIn, userData } = this.state;
    return (
      <div className="row">
        <div className="col">
          {
            userLoggedIn ? 
            <div>
              <h2>Welcome {userData.username} </h2>
              <button onClick={() => this.logout()}>
                LOGOUT
              </button>
            </div>
             : 
             <div>
              <Register userLogin={this.userLogin} />
              <h3 style={{ textAlign: 'center' }}>OR</h3>
              <Login userLogin={this.userLogin} />
             </div>
          }
          <div>
            {errorMsg ? <h4>{errorMsg}</h4> : null}
          </div>
        </div>
        <div className="col">
          <h1 style={{ textAlign: 'center' }}>Comments</h1>
            <input
                type="text"
                style={{ width: '90%', height: '50px', textAlign:'center' }}
                onChange={(e) => this.setState({ comment: e.target.value })}
                placeholder="Type in your comment here"
                ref={this.commentTxtInput}
                value={this.state.comment}
            />
            <button style={{ width: '10%' }} onClick={() => this.submit()}>
                Submit
            </button>
          <div>
            <hr></hr>
            {commentList.length <= 0
              ? 'No Comments yet'
              : commentList.map((comment) => (
                <div key={comment.parentComment._id}>
                  <div style={{marginTop:'10px'}}>
                    <span>{comment.parentComment.username.toUpperCase()}</span>
                    <span style={{ float: 'right' }}>{new Date(comment.parentComment.updatedAt).toLocaleString()}</span>
                    <div className='box'>{comment.parentComment.comment}</div>
                    <div>
                      {userData && userData.username === comment.parentComment.username ?<button style={{ width: '10%' }} onClick={() => this.editOrReply('edit',comment.parentComment)}>Edit</button>:null}
                      {userData ?<button style={{ width: '10%' }} onClick={() => this.editOrReply('reply',comment.parentComment)}>Reply</button>:null}
                    </div>
                  </div>
                  {
                    comment.childComments.length > 0 ? 
                    comment.childComments.map((cc) => (
                      <div key={cc._id} style={{marginTop:'10px',textAlign:'-webkit-right'}}>
                        <span>{cc.username.toUpperCase()}-</span>
                        <span style={{ float: 'right' }}>{new Date(cc.updatedAt).toLocaleString()}</span>
                        <div className='box-dotted'>{cc.comment}</div>
                        <div>
                          {userData && userData.username === cc.username ?<button style={{ width: '10%' }} onClick={() => this.editOrReply('edit',cc)}>Edit</button>:null}
                          {userData ?<button style={{ width: '10%' }} onClick={() => this.editOrReply('reply',cc)}>Reply</button>:null}
                        </div>
                      </div>
                    ))
                    : null
                  }
                </div>   
                ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;