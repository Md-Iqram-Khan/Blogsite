const User = require('../models/User')
const Profile = require('../models/Profile')
const fs = require('fs')

exports.uploadProfilePics = async (req, res, next) => {
    if( req.file){
        try{
            let oldProfilePic = req.user.profilePics
            let profile = await Profile.findOne({ user: req.user._id})
            let profilePics = `/upload/${req.file.filename}`
            if(profile){
                await User.findOneAndUpdate(
                    {user: req.user._id},
                    {$set: {profilePics}}
                )
            }

            await User.findOneAndUpdate(
                {_id: req.user._id},
                {$set: {profilePics}}
            )
            
            if(oldProfilePic !== '/upload/default.png'){
                fs.unlink(`public${oldProfilePic}`, err => {
                    if (err) 
                    console.log(err);
                })
            }
            res.status(200).json({
                profilePics
            })

        } catch(e){
           res.status(500).json({
               profilePics: req.user.profilePics
           })
        }
    } else {
        res.status(500).json({
            profilePics: req.user.profilePics
        })
    }
}

exports.removeProfilePics =  (req, res, next) => {
    try{
        let defaultProfile = '/upload/default.png'
        let currentProfilePics = req.user.profilePics
   
      fs.unlink(`public${currentProfilePics}`, async (err) => {
        let profile = await Profile.findOne({ user: req.user._id})
        if(profile) {
            await Profile.findOneAndUpdate(
                    {user: req.user._id},
                    {$set: {profilePics: defaultProfile}}        
            )
        }

        await User.findOneAndUpdate(
            {_id: req.user._id},
            {$set: {profilePics: defaultProfile}}
        )
      })  

      res.status(200).json({
          profilePics: defaultProfile
      })

    } catch(e){
        console.log(e);
            res.status(500).json({
                message: 'Can not remove Profile Pic'
            })
    }
}

exports.postImageUploadController = (req, res, next) => {
    if(req.file) {
       return res.status(200).json({
            imgUrl : `/upload/${req.file.filename}`
        })
    }
    return res.status(500).json({
        message: 'Server errror'
    })
}