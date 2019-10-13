const express = require('express');
const router = express.Router();
const UserSchema = require('../models/user');

router.post('/signup', (req, res) => {
    let user = new UserSchema();
  
    const { dataObj } = req.body;
  
    if (!dataObj.username || !dataObj.password) {
      return res.json({
        success: false,
        error: 'INVALID INPUTS',
      });
    }
    user.username = dataObj.username;
    user.password = dataObj.password;
    user.email = dataObj.email;
    user.save((err,user) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({success: true , user : user});
    });
});

router.post('/login', (req, res) => {
    let user = new UserSchema();
    const { dataObj } = req.body;
  
    if (!dataObj.username || !dataObj.password) {
      return res.json({
        success: false,
        error: 'INVALID INPUTS',
      });
    }
    const query = { username: dataObj.username , password: dataObj.password }; 
    UserSchema.find(query,(err,user) => {
        if (err) return res.json({ success: false, error: err });
        if(user && user[0]){
            return res.json({success: true , user : user[0]});
        }
        else{
            return res.json({ success: false, error: err });   
        }
        
    });
});

module.exports = router;