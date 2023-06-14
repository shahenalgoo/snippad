/**
 * This function gives access to a document to the requested user
 * CAN ONLY SHARE WITH ONE USER FOR NOW (since permissions are being overwritten)
 * This is still very experimental, may not be the best
 */


//SDK
const sdk = require("node-appwrite");

module.exports = async function (req, res) {
    // Init SDK
    //
    const client = new sdk.Client();
    const databases = new sdk.Databases(client);
    const users = new sdk.Users(client);

    // Client init if env variables are found.
    //
    if (!req.variables['APPWRITE_FUNCTION_ENDPOINT'] || !req.variables['APPWRITE_FUNCTION_API_KEY']) {
        console.warn("Environment variables are not set. Function cannot use Appwrite SDK.");
    } else {
        client
            .setEndpoint(req.variables['APPWRITE_FUNCTION_ENDPOINT'])
            .setProject(req.variables['APPWRITE_FUNCTION_PROJECT_ID'])
            .setKey(req.variables['APPWRITE_FUNCTION_API_KEY'])
            .setSelfSigned(true);
    }

    // Get Payload
    //
    const sentData = JSON.parse(req.payload);


    // Look for shared user
    //
    const userList = await users.list(
        [sdk.Query.equal("email", sentData.email)]
    );

    // If no user is found, return error
    //
    if (userList.total == 0) {
        return res.error();
    }

    // Adding shared user to document
    await databases.updateDocument(
        req.variables['DATABASE_ID'],
        req.variables['COLLECTION_ID_NOTES'],
        sentData.note,
        {},
        [
            sdk.Permission.read(sdk.Role.user(sentData.owner)),
            sdk.Permission.update(sdk.Role.user(sentData.owner)),
            sdk.Permission.delete(sdk.Role.user(sentData.owner)),
            sdk.Permission.read(sdk.Role.user(userList.users[0].$id)),
            sdk.Permission.update(sdk.Role.user(userList.users[0].$id)),
        ]
    );

    res.json({
        response: "Success!",
    });
};
