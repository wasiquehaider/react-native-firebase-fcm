npm install

On POSTMAN
Make a POST REQUEST to https://fcm.googleapis.com/fcm/send
In the Header add two properties according to key and value
1) Authorization     |     key= your server legacy key from Firebase Cloud Messaging
2) Content-Type      |     application/json
3) Run this Payload

{
 "to" : "YOUR_FCM_TOKEN",
 "notification" : {
 "body" : "Great match! Between Portugal and Denmark, Portugal won a Thriller 3-0",
 "title" : "Portugal vs. Denmark",
 "content_available" : true,
 "priority" : "high",
 "show_in_foreground": true,
  "sound": "default",
  "vibrate": 500
 },
 "data" : {
 "body" : "Great match! Between Portugal and Denmark, Portugal won a Thriller 3-0",
 "title" : "Portugal vs. Denmark",
 "content_available" : true,
 "priority" : "high",
 "show_in_foreground": true,
 "sound": "default",
 "vibrate": 10000
 } 
}
