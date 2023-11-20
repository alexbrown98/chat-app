# Real-time chat room
This is a project to get familiar with AWS serverless services, mainly Lambda, API Gateway and DynamoDb.

Connections are made using Websockets managed by API Gateway and Lambda functions. Session and user data is stored in a DynamoDb table. Users can choose a username and connect to the chat room, where they can speak with other users and see who is onlne.

To use, simply run 
npm start

![pic1](https://github.com/alexbrown98/chat-app/blob/master/public/screenshot.png)
