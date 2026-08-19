const defaultVariables = {
    VITE_APPWRITE_URL: "https://cloud.appwrite.io/v1",
    VITE_APPWRITE_PROJECT_ID: "6a55394f003bbd54da41",
    VITE_APPWRITE_DATABASE_ID: "6a553a3b001b6d08fe6a",
    VITE_APPWRITE_COLLECTION_ID: "articles",
    VITE_APPWRITE_BUCKET_ID: "6a568b21003e4919189f",
}

const requiredVariables = Object.fromEntries(
    Object.entries(defaultVariables).map(([name, fallback]) => [
        name,
        import.meta.env[name] || fallback,
    ])
)

const missingVariables = Object.entries(requiredVariables)
    .filter(([, value]) => !value)
    .map(([name]) => name)

const conf = {
    appwriteUrl: requiredVariables.VITE_APPWRITE_URL,
    appwriteProjectId: requiredVariables.VITE_APPWRITE_PROJECT_ID,
    appwriteDatabaseId: requiredVariables.VITE_APPWRITE_DATABASE_ID,
    appwriteCollectionId: requiredVariables.VITE_APPWRITE_COLLECTION_ID,
    appwriteBucketId: requiredVariables.VITE_APPWRITE_BUCKET_ID,
    tinymceApiKey: import.meta.env.VITE_TINYMCE_API_KEY || "",
}

export { missingVariables }
export default conf