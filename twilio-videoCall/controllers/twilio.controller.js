require("dotenv").config();

var ACCOUNT_SID = process.env.ACCOUNT_SID;
var API_KEY_SID = process.env.API_KEY_SID;
var API_KEY_SECRET = process.env.API_KEY_SECRET;
var AUTH_TOKEN = process.env.AUTH_TOKEN;

const AccessToken = require("twilio").jwt.AccessToken;
const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

exports.createToken = (userName, roomName) => {
  let accessToken = new AccessToken(ACCOUNT_SID, API_KEY_SID, API_KEY_SECRET);
  accessToken.identity = userName;

  let VideoGrant = AccessToken.VideoGrant;
  let grant = new VideoGrant();
  grant.room = roomName;

  accessToken.addGrant(grant);
  let jwt = accessToken.toJwt();

  return jwt;
};

exports.createRoom = async (roomName) => {
  let roomSID = await client.video.rooms.create({ uniqueName: roomName });
  roomSID.enableTurn();
  return roomSID.sid;
};

exports.deleteRoom = (sid) => {
  client.video.rooms(sid).update({ status: "completed" });
};
