const requiredVariables = {
    VITE_APPWRITE_URL: import.meta.env.VITE_APPWRITE_URL,
    VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    VITE_APPWRITE_DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    VITE_APPWRITE_COLLECTION_ID: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
    VITE_APPWRITE_BUCKET_ID: import.meta.env.VITE_APPWRITE_BUCKET_ID,
}

const missingVariables = Object.entries(requiredVariables)
    .filter(([, value]) => !value)
    .map(([name]) => name)

const conf = {
    appwriteUrl: requiredVariables.VITE_APPWRITE_URL || "https://cloud.appwrite.io/v1",
    appwriteProjectId: requiredVariables.VITE_APPWRITE_PROJECT_ID || "",
    appwriteDatabaseId: requiredVariables.VITE_APPWRITE_DATABASE_ID || "",
    appwriteCollectionId: requiredVariables.VITE_APPWRITE_COLLECTION_ID || "",
    appwriteBucketId: requiredVariables.VITE_APPWRITE_BUCKET_ID || "",
    tinymceApiKey: import.meta.env.VITE_TINYMCE_API_KEY || "",
}

export { missingVariables }
export default conf