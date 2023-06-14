
# Snippad Intro
Snippad is an open-source application primarily designed for storing code snippets, as well as regular rich-text notes. It is a web/cloud based open-source application made in React/Next.js that you can easily **deploy on Appwrite and Vercel for free**.



## Installation
**Step 1: Clone the repo**
Start by cloning the repo or download the source code.
```bash
git clone https://github.com/shahenalgoo/snippad.git
```
\
**Step 2: Install dependencies**
Open your terminal in the root folder of the project and run the command:
```bash
yarn install 
--or--
npm install
```
\
**Step 3: Set environment variables**
Rename the file `.env.example` to `.env.local`.

To run the app locally, you should set `http://localhost:3000` as the *NEXT_PUBLIC_APP_URL*. When you deploy the app online via any service provider, make sure to set the domain to your application domain. The domain is mostly used for redirects. ie: magic login, password recovery redirects, etc...

```javascript
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=xxxx
NEXT_PUBLIC_APPWRITE_DATABASE_ID=xxxx

NEXT_PUBLIC_COLLECTION_NOTEBOOKS_ID=xxxx
NEXT_PUBLIC_COLLECTION_NOTES_ID=xxxx

NEXT_PUBLIC_BUCKET_IMAGES_ID=xxxx
```

\
*While the packages installs, let's set up your own personal backend with Appwrite.*

## Appwrite Backend
\
a. **Project Setup**
 1. Head over to [cloud.appwrite.io](https://cloud.appwrite.io) and sign in/up.
 2. Create a new project and name it `Snippad`
 3. In the 'Add a Platform' section, add a new `Web App`.
 4. Set an app name and set the hostname to `*`.
 5. You can now click 'Next' or Skip the optional steps.
 6. Once on the dashboard, copy the `Project ID` and set it in env `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
---
\
b. **Database Setup**
 1. Go to Databases  and `Create database`, you can name it `snippad-main`.
 2. Copy the `Database ID` and set it in the env file in `NEXT_PUBLIC_APPWRITE_DATABASE_ID`.

---
\
c. **Create Notebooks Collection**
 1. Create the first collection and name it `notebooks`.
 2. Copy the notebooks `Collection ID` and set it in env `NEXT_PUBLIC_COLLECTION_NOTEBOOKS_ID`
 3. Go to the Attributes tab and add:
 
|Key  |Type  |Default Value |
|--|--|--|
|title (required)  |string  |*~leave empty~*

 4. Go to the Settings tab of the collection and set the permission:

- `Add role` -> `All Users(Users)` -> enable `Create` only.
- Enable the `Document Security` as well.

![enter image description here](https://i.imgur.com/fABpWVK.png)

Cool! You're done with setting up the notebooks collection.

---
\
d. **Create Notes Collection**
 1. Create a new collection and name it `notes`.
 2. Copy the notes `Collection ID` and set it in env `NEXT_PUBLIC_COLLECTION_NOTES_ID`.
 3. Go to notes settings and set the permissions and security exactly as the notebooks collection.
 4. Go to the Attributes tab and add:

|Key  |Type  |Size |Default Value |
|--|--|--|--|
|title  |string |180  |-
|subtitle  |string |240  |-
|body  |string |5000  |-
|notebook_related  |string |50  |-
|type  |enum (note, code, todo) |-  |-
|starred  |boolean|-  |-
|status  |enum (published, archived, trashed) |-  |-
|status_last_update  |datetime|-  |-
|snippet_language  |string|20  |-
|search_index  |string|5500  |-
\
5. Once done, we need to setup our search functionality and filters. Go to the Index tab and add:

|Key  |Type  |Attributes|
|--|--|--|
|notebook_related|key|notebook_related
|status|key|status
|search_index|fulltext|search_index
|notebook_and_status|key|notebook_related, status
|notebook_status_starred|key|notebook_related, starred, status
|search_notebook|fulltext|notebook_related, search_index
|notebook_status_type|key| notebook_related, status, type
|notebook_status_type_lang|key|noebook_related, status, type, snippet_language

---
\
e. **Create Bucket for Image Uploads**
1. Create a new bucket in the Storage section and name it `uploads`.
2. Copy the uploads `Bucket ID` and set it in env `NEXT_PUBLIC_BUCKET_UPLOADS_ID`.
3. Go to the bucket settings and set the permissions and security exactly as the notebooks/notes collection.

The rest of the options are up to you. That’s it for images.

---
\
f. **Auth (Optional)**
In the settings tab of the Auth section, you can enable any social logins that you need.
You can also go to `/src/app/(authentication)/login/CreateOauthSession.tsx` to setup your logins.

Please refer to the Appwrite documentation for help on how to [Appwrite 0auth](https://appwrite.io/docs/client/account?sdk=web-default#accountCreateOAuth2Session).


## Server Function(optional)
You’ve reached the last step, here is how to set up the server function that deletes trash after 30 days.
For more information, please refer to the [Appwrite Functions API](https://appwrite.io/docs/client/functions) and a tutorial about [how to get started with Appwrite functions](https://appwrite.io/docs/functions).
\
To get started:
```bash
npm install -g appwrite-cli
```
\
Create a folder in your desired location and name it something like `snippad_trash_cleaner`. Open terminal in that folder and run this command:
```bash
appwrite init function
```

\
Now you should have a starter kit. Follow these steps:

 1. In our Snippad's source code, you will find a folder called functions/deleteTrash.js.
 2. Open the `snippad_trash_cleaner` folder in your IDE, go to the `index.js` file.
 3. Replace everything in index.js by everything in `deleteTrash.js`.
 4. Back to the delete-trash terminal, run this command: `appwrite login`.
 5. After inputting your login and project details, run command: `appwrite deploy function`.
 6. Select the function and deploy it.

\
After deployment, you can now access the function on the Functions section on the Appwrite Dashboard. 

 1. Go to the function’s **Settings** tab.
 2. Go to the ‘Update Schedule’, add this Cron syntax: `0 0 * * * `.

> Look out, there is a space between each character. The function will
> now run everyday at midnight UTC.

 3. Go to **Update Variables**. add these **5 variables** and their respective values:

```javascript
APPWRITE_FUNCTION_ENDPOINT
APPWRITE_FUNCTION_API_KEY
APPWRITE_FUNCTION_PROJECT_ID
DATABASE_ID
COLLECTION_ID_NOTES
```
\
**Congrats!**
Go back to the root folder of the source code and open the terminal. 
Run the command `npm run dev` or `yarn dev` and you’re all set!