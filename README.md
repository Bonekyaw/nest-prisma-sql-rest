# This is Nest JS Starter Kits

This is for Backend API Development. It can be used for developing a backend as well as learning how to do.  
If you find it useful, give me a **GitHub star**, please.

In this template,

- Nest JS framework
- Typescript
- Database - as you like
- Prisma ORM
- REST api
- AuthGuard by Passport & JWT
- Authorization RolesGuard
- bcrypt
- ValidationPipe
- Nest Config
- Rate Limiting
- Logger
- file uploading
- Pagination ( offset-based & cursor-based ) etc.

In order to use it,

**Rename** .env.example file to .env file.  
For **MySQL**

```bash

DATABASE_URL="mysql://username:password@localhost:3306/mydb"

```

For **PostgreSQL**

```bash

DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"

```

Please note.  
_TOKEN_SECRET_ should be complex and hard to guess.

If you use file uploading feature in this kit,  
create nested folders `public/images` in the root directory.  
But making directories is up to you. You can configure in `src/file/config/multer.config.ts`.  
For large projects, it is the best solution to use aws S3, DigitalOcean space, etc.,
instead of using file system.

## Step by Step Installation

```bash
mkdir lucky
cd lucky
git clone https://github.com/Bonekyaw/nest-prisma-rest.git .
rm -rf .git
npm install
npm run start:dev

```

Before you run, make sure you've renamed .env file and completed required information.

I'm trying best to provide the **latest** version. But some packages may not be latest after some months. If so, you can upgrade manually one after one, or you can upgrade all at once.

```bash
npm install -g npm-check-updates
npm outdated
ncu --upgrade
npm install
```

If you find some codes not working well, please let me know your problems.

### API Endpoints

List of available routes:

`POST /api/v1/auth/register` - Register  
`POST /api/v1/auth/verify` - Verify OTP  
`POST /api/v1/auth/confirm` - Confirm password  
`POST /api/v1/auth/login` - Login  
`POST /api/v1/file/upload` - Uploading file or files  
`GET /api/v1/admins/cursor` - Get admins' list by cursor-based pagination  
`GET /api/v1/admins/offset` - Get admins' list by offset-based pagination

#### Explanation

**Auth routes**:  
`POST /api/v1/auth/register` - Register

```javascript
Request
{
  "phone": "0977******7"
}

Response
{
    "message": "We are sending OTP to 0977******7.",
    "phone": "77******7",
    "token": "3llh4zb6rkygbrah5demt7"
}
```

`POST /api/v1/auth/verify` - Verify OTP

```javascript
Request
{
  "phone": "77******7",
  "token": "3llh4zb6rkygbrah5demt7",
  "otp": "123456"
}

Response
{
    "message": "Successfully OTP is verified",
    "phone": "77******7",
    "token": "xdyj8leue6ndwqoxc9lzaxl16enm0gkn"
}
```

`POST /api/v1/auth/confirm` - Confirm password

```javascript
Request
{
  "token": "xdyj8leue6ndwqoxc9lzaxl16enm0gkn",
  "phone": "77******7",
  "password": "12345678"
}

Response
{
    "message": "Successfully created an account.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWIwZDhmNmUwNGJiOGMzNWY0MTlkNiIsImlhdCI6MTcxNzI0MzI4MCwiZXhwIjoxNzE3MjQ2ODgwfQ.dvJT2UsGsC1za3lhcu3b3OrMR8BCIKvSlbiIgoBoLJQ",
    "user_id": "1",
    "randomToken": "p1jlepl7t7pqcdgg1sm0crbgbodi67auj"
}
```

`POST /api/v1/auth/login` - Login

```javascript
Request
{
    "phone": "0977******7",
    "password": "12345678"
}

Response
{
    "message": "Successfully Logged In.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTVlMDI5NzE2ZjljYTU1NTRjYTU4NCIsImlhdCI6MTcxNzQwMjQ1OSwiZXhwIjoxNzE3NDA2MDU5fQ.tZNAwjt4rM3tiZgl1LdwfYScbPqoOnMTtaKOTI1pEXY",
    "user_id": "1",
    "randomToken": "25uzndvz1lzu65fpjn9b6suaxj8gm91k"
}
```

**File Upload routes**:  
`PUT /api/v1/file/upload` - Uploading file or files

```javascript
Request with Authorization Header
Body form-data Key = file
```

**Pagination routes**:  
`GET /api/v1/admins/cursor` - Get admins' list by cursor-based pagination  
`GET /api/v1/admins/offset` - Get admins' list by offset-based pagination  

```javascript
Request with Authorization Header
Params Key = cursor, limit (OR) page, limit
```

I promise new features will come in the future if I have much time.

If you have something hard to solve,
DM  
<phonenai2014@gmail.com>  
<https://www.facebook.com/phonenyo1986/>  
<https://www.linkedin.com/in/phone-nyo-704596135>

## Find more other Starter kits of mine ?

`Nest JS for REST Api`

[Nest JS + Prisma ORM - REST api](https://github.com/Bonekyaw/nest-prisma-sql-rest) - Now you are here

`Nest JS for Graphql Api`

[Nest JS + Prisma ORM - Graphql api](https://github.com/Bonekyaw/nest-prisma-graphql)

`Node Express JS For REST Api`

[Express + Prisma ORM + mongodb - rest api](https://github.com/Bonekyaw/node-express-prisma-mongodb)  
 [Express + Prisma ORM + SQL - rest api](https://github.com/Bonekyaw/node-express-prisma-rest)  
 [Express + mongodb - rest api](https://github.com/Bonekyaw/node-express-mongodb-rest)  
 [Express + mongoose ODM - rest api](https://github.com/Bonekyaw/node-express-nosql-rest)  
 [Express + sequelize ORM - rest api](https://github.com/Bonekyaw/node-express-sql-rest)

`Node Express JS For Graphql Api`

[Apollo server + Prisma ORM + SDL modulerized - graphql api](https://github.com/Bonekyaw/apollo-graphql-prisma)  
 [Express + Prisma ORM + graphql js SDL modulerized - graphql api](https://github.com/Bonekyaw/node-express-graphql-prisma)  
 [Express + Apollo server + mongoose - graphql api](https://github.com/Bonekyaw/node-express-apollo-nosql)  
 [Express + graphql js + mongoose - graphql api](https://github.com/Bonekyaw/node-express-nosql-graphql)  
 [Express + graphql js + sequelize ORM - graphql api](https://github.com/Bonekyaw/node-express-sql-graphql)

`Mobile Application Development`

[React Native Expo](https://github.com/Bonekyaw/react-native-expo)
