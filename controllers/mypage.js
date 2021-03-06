const User = require('../models/index.js').users;
const Room = require('../models/index.js').rooms;
const Guest = require('../models/index.js').guests;
const Followlist = require('../models/index.js').sequelize.models.followlist;
const jwt = require('jsonwebtoken');

const authUser = (req, userid) => {
    let token = req.headers['authorization'];
    const splited = token.split(' ')[1];
    const userData = jwt.verify(splited, process.env.ACCESS_SECRET);
    console.log(userData)
    return userid === String(userData.id);
};

module.exports = {
    followers: async (req, res) => {
        const userid = req.params.userid;
        if (authUser(req, userid)) {
            const followerIDs = await Followlist.findAll({
                where: { followed_id: userid },
            });

            const followers = followerIDs.map(async (el) => {
                await User.findOne({ where: { id: el } });
            });
            res.status(200).send({
                data: followers,
                message: 'ok',
            });
        } else {
            res.status(401).send();
        }
    },
    followings: async (req, res) => {
        const userid = req.params.userid;

        if (authUser(req, userid)) {
            const followingIDs = await Followlist.findAll({
                where: { following_id: userid },
            });

            const followings = followingIDs.map(async (el) => {
                await User.findOne({ where: { id: el } });
            });
            res.status(200).send({
                data: followings,
                message: 'ok',
            });
        } else {
            res.status(401).send();
        }
    },
    follow: async (req, res) => {
        let email = req.body.email;
        let userid = req.params.userid;

        if (authUser(req, userid)) {
            const newFollowing = await User.findOne({
                where: { email: email },
                attributes: ['id'],
            });
            if (newFollowing.length === 0 || !newFollowing) {
                res.status(404).send({
                    message: '?????? ???????????? ???????????? ????????? ????????????.',
                });
            } else {
                await Followlist.create({
                    followed_id: newFollowing,
                    following_id: user,
                });
                const user = await User.findOne({
                    where: { id: userid },
                    attributes: ['id'],
                });
                const followerIDs = await Followlist.findAll({
                    where: { followed_id: userid },
                });

                const followers = followerIDs.map(async (el) => {
                    await User.findOne({ where: { id: el } });
                });
                res.status(200).send({
                    data: followers,
                    message: 'ok',
                });
            }
        } else {
            res.status(401).send();
        }
    },
    unfollow: async (req, res) => {
        let email = req.body.email;
        let userid = req.params.userid;

        if (authUser(req, userid)) {
            let unfollowUser = await User.findOne({
                where: { email: email },
                attributes: ['id'],
            });

            let numOfDeleted = await Followlist.destroy({
                where: { followed_id: unfollowUser, followed_id: userid },
            });

            if (numOfDeleted === 0 || !numOfDeleted) {
                res.status(404).send({
                    message: '??????????????? ?????? ????????? ??????????????? ??? ????????????.',
                });
            } else {
                const followingIDs = await Followlist.findAll({
                    where: { following_id: userid },
                });

                const followings = followingIDs.map(async (el) => {
                    await User.findOne({ where: { id: el } });
                });
                res.status(200).send({
                    data: followings,
                    message: 'ok',
                });
            }
        } else {
            res.status(401).send();
        }
    },
    newpwd: async (req, res) => {
        let userid = req.params.userid;
        let oldpwd = req.body.oldpwd;
        let newpwd = req.body.newpwd;
        if (authUser(req, userid)) {
            let password = await User.findOne({
                attributes: ['password'],
                where: {
                    id: userid,
                },
            });
            if (password !== oldpwd) {
                res.status(401).send({
                    message: '?????? ??????????????? ?????? ?????????????????????.',
                });
            } else if (
                newpwd ===
                'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
            ) {
                res.status(422).send({
                    message: '??????????????? ???????????? ??? ??? ????????????.',
                });
            } else {
                await User.update(
                    {
                        password: newpwd,
                    },
                    {
                        where: {
                            id: userid,
                            password: oldpwd,
                        },
                    }
                );
                res.status(200).send({ message: 'ok' });
            }
        } else {
            res.status(401).send();
        }
    },
    profile: async (req, res) => {
        let userid = req.params.userid;
        console.log(req)
        console.log('req.body???????????? ??????',req.body)
        console.log('????????? ????????????',userid)
        if (authUser(req, userid)) {
            let newImage = req.body.new_profile;
            console.log(newImage)

            // await User.update({ lastName: "Doe" }, {
            //     where: {
            //       lastName: null
            //     }
            //   });

            await User.update(
                { profile_image: newImage },
                {
                    where: { id: userid },
                }
            );

            res.status(200).send({ message: 'ok' });
        } else {
            res.status(401).send();
        }
    },
    comment: async (req, res) => {
        let userid = req.params.userid;
        console.log('req.body???????????? ??????',req.params.userid)
        console.log('???????????????',userid)
        if (authUser(req, userid)) {
            let newComment = req.body.new_comment;

            await User.update(
                { comment: newComment },
                {
                    where: { id: userid },
                }
            );
            let user = await User.findOne({ where: { id: userid } });
            res.status(200).send({ data: user, message: 'ok' });
        } else {
            res.status(401).send();
        }
    },
};
