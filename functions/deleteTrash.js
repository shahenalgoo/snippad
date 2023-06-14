//SDK
const sdk = require("node-appwrite");

module.exports = async function (req, res) {
    // Init SDK
    //
    const client = new sdk.Client();
    const databases = new sdk.Databases(client);

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

    // Get all notes that have been 'trashed'
    //
    const response = await databases.listDocuments(
        req.variables['DATABASE_ID'],
        req.variables['COLLECTION_ID_NOTES'],
        [sdk.Query.equal('status', 'trashed')]
    )

    // Check if there is at least 1 note in the collection
    //
    if (response.total > 0) {
        // Days limit before deletion
        const daysLimit = 30;

        // Delete each document that has reached the time limit
        response.documents.forEach(element => {

            // Calculate the days between now and the last time the note's status field has been updated.
            const now = new Date();
            const lastUpdated = new Date(element.status_last_update);
            const daysDifference = dateDiffInDays(lastUpdated, now);


            if (daysDifference >= daysLimit) {
                databases.deleteDocument(req.variables['DATABASE_ID'], req.variables['COLLECTION_ID_NOTES'], element.$id);
                console.log("Limit reached (" + daysDifference + "), trashed note " + element.$id + " has been permanently deleted.");
            } else {
                const daysRemaining = daysLimit - daysDifference
                console.log(daysRemaining + " days left for trashed note " + element.$id);
            }

            // Outputting in case of involuntary data loss
            console.log("Note Data: \n" + JSON.stringify(element));
            console.log("-----------------------------------------------------------------");
        });
    } else {
        console.log("Collection has 0 documents");
    }

    // Get difference in days between 2 date strings
    //
    function dateDiffInDays(a, b) {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;

        // Discard the time and time-zone information.
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    res.json({
        response: "Success!",
    });
};
