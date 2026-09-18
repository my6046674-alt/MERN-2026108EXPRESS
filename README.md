## EXpress.js

- IT is a node.js API/backend framework
- Used to build API (Application program interface)
- It Simplies the HTTP module of node .js
- minimalist , fast and unopinionated framework


## API
- API format: JSON (javascript object Notation)
- Rest api (Representational state transfer)

### JSON
- js Object => JSON.stringify()=> JSON
- JSON => JSON.parse()=> js Object

## HTTP Methods
1. Get- Read/fetch
2. Post- Create
3. Put- Update
4. Delete- Delete
5. Patch- Partial update

## Layered Architecture

1. API Layer
    a. Routes : Handle routes /endpoints
    b. Controllers: Handle request/response
    c. Middlewares: Handle request/response, logging, Auth

2. Business logic layer
    a. Services

3. Data logic layer
      a. Model

4. Database layer


## MongoDB
- Non-relational database 
- Data are stored in collections & documents 
- Database: Main container, all collections are stored here 
- Collection : Equivalent to table of relational database 
- Document: Equivalent to Row 
- Field: Equivalent to column


## Tools used
- Locally: MongoDB compass
- Cloud: MongoDB Atlas

## Run MongoDB in compass
- Open mongoDB compass
- Setup a new connection (mongodb://localhost:27017)[mongodb://localhost:202717]

## MongoDB Queries
- show dbs :- show list of database
- use <dbname> :- use existing db or create a new one
- show collections :- shows list of collections in that db

1. create
- db.users.insertOne({name:"Ram"})
- db.users.insertMany([{name::"Hari"}, {name:"sita"}])

2. Read
db.users.find({age:20}) Returns multiple result if exists
db.users.findOne({age:20})

3. update
db.users.updateOne({name:"Ram"}, {$set:{age:40}})

4. Delete
db.users.deleteOne({name:"Ram"}, {$set:{age:40}})

## Complex filters
$eq:db.users.find({name: {$eq:"Hari"}})
$ne:db.users.find({name: {$ne:"Hari"}}) not equal to ne
$gt/gte:db.users.find({name: {$gt:50}})
$lt/lte:db.users.find({name: {$lt:50}})
$and:db.users.find({$and:[{name:"Hari"}, {age:20} ]})
$and:db.users.find({$or:[{name:"Hari"}, {age:20} ]}) 
$in:db.users.find({name:{$in: ["Hari", "Rohan"]}}) (multiple users coming)

a. limit:db.users.find().limit(2)
b. skip:db.users.find().skip(1).limit(2)
c. sort:db.users.find().sort({name:1})

## Mongoose
- ODM of MondoDB for node.js
- create schema
- validate schema
- create models using schema
- Relationship 

# Cryptography

## Encryption

- Encryption : Converting readable text to unreadable/cipher text
- for e.g: hello -> aihehkkshherhs-

- Decryption: Converting cipher text to readable text
- for e.g : aijsoerachhlh- -> hello


## Types
- Symmetric : Same key is used for encryption and decryption 
- Assymetric: Different keys are used for encryption and decryption , public/private key

## Hashing
- One way encryption
- Convert the readable text to cipher text but not back to readable
- Hashing always returns same cipher
- hello => 123243432sadhdhgrh

## Salt

- Adding random characters in the hash
- hello -> du377ehdhdhgei948484
- hello -> hdgeb28838320208282


## Authentication & Authorization

1. Authentication : who you are ? Logged in user
2. Authorization :  What you can do ? User role

## JSon web Token (JWT)

- Self verified
- Temper proof
- Use for both authentication & authorization

## JST Structure
- Header
- Payload
- Signature

## Storage
1. Cookie Storage
- Size : 4KB
- Storage: Server & Browser
- Expiry : Cookie expiry

2. Local Storage
- Size: 5-10 MB
- Storage: only Browser
- Expiry: Never

3. Session Storage
- Size: 5MB
- Storage: ONLY Browser
- Expiry : On tab close


## Auth process
1. Login/Register success
2. Generate token (jwt)
3. Store token: Cookie, Session, Local storage
4. Append the token in every request to handle auth
5. Verify the token and authenticate/authorize user

## Middleware

- Function that lies between request and response
- Function that has access of both request and response objects
- It has additional functionality to go next() middleware call

Browser----------Request--------->Server
Middleware, Middleware, Middleware
server------------Response-------->Browser


### Usage
- Logging
- Authentication & Authorization
- Request & Response Object modification
- Error handling
- Data validation


### File upload

1. File with data -> Send using FormData
2. Use `multer` package to handle FormData
    - When file is sent through FormData, multer handles it
    - Store the file temporarily, local folder or Ram
    - Upload the file
    - Remove the file after successful upload
    - File can be single or multiple
3. Cloudinary: Upload file to cloudinary (store your file here)
    - Signin/Signup to cloudinary
    - Create an API key or Use existing API key
    - Use cloudinary sdk, use your api key here
4. Receive the file Url from uploaded file in cloudinary
5. Store the Url in database

## Reset password

## Forgot password
1. User requests for forgot password
2. User inputs email address
3. Using email address, find the user, create a reset password link and token
4. Send the reset password Link to the email


## Rest password
1. User clicks on the reset password link from the received email
2. The link contains the reset-password route with token
3. User inputs new password
4. Send request for reset password with the new password and token
5. verify the user and token
6. Update the password


## MongoDB Aggregation
- Performing operation in multiple documents (table)
- complex queries 
- Filtering in multiple documents
- Data formatting

1. $match => Filtering
2. $lookup=> Left Join
3. $unwind=> Inner join
4. $project=> Data formatting
5. $group=> Complex grouped operation









 

