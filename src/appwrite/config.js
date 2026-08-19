import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status, userId, author}){
        let docId = (slug && slug.trim()) ? slug : ID.unique();

        const keyMap = {
            userId: ['userId', 'userid', 'user_id', 'authorId', 'user'],
            author: ['author', 'authorName', 'userName', 'username', 'name'],
            featuredImage: ['featuredImage', 'featuredimage', 'featured_image', 'image'],
            status: ['status'],
            title: ['title'],
            content: ['content']
        };

        let activeKeys = {
            userId: 'userId',
            author: 'author',
            featuredImage: 'featuredImage',
            status: 'status',
            title: 'title',
            content: 'content'
        };

        for (let attempt = 0; attempt < 15; attempt++) {
            const payload = {};
            if (title !== undefined && activeKeys.title) payload[activeKeys.title] = title;
            if (content !== undefined && activeKeys.content) payload[activeKeys.content] = content;
            if (status !== undefined && activeKeys.status) payload[activeKeys.status] = status;
            if (featuredImage !== undefined && activeKeys.featuredImage) payload[activeKeys.featuredImage] = featuredImage;
            if (userId !== undefined && activeKeys.userId) payload[activeKeys.userId] = userId;
            if (author !== undefined && activeKeys.author) payload[activeKeys.author] = author;

            try {
                return await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    docId,
                    payload
                );
            } catch (error) {
                console.log(`Appwrite createPost attempt ${attempt} error:`, error?.message);

                if (error?.code === 409 || error?.type === 'document_already_exists') {
                    docId = ID.unique();
                    continue;
                }

                const match = error?.message?.match(/Unknown attribute:\s*"([^"]+)"/i);
                if (match && match[1]) {
                    const unknownAttr = match[1];
                    let fixed = false;
                    for (const [field, aliases] of Object.entries(keyMap)) {
                        if (activeKeys[field] === unknownAttr) {
                            const idx = aliases.indexOf(unknownAttr);
                            if (idx !== -1 && idx + 1 < aliases.length) {
                                activeKeys[field] = aliases[idx + 1];
                            } else {
                                activeKeys[field] = null;
                            }
                            fixed = true;
                            break;
                        }
                    }
                    if (fixed) continue;
                }

                throw error;
            }
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        const keyMap = {
            featuredImage: ['featuredImage', 'featuredimage', 'featured_image', 'image'],
            status: ['status'],
            title: ['title'],
            content: ['content']
        };

        let activeKeys = {
            featuredImage: 'featuredImage',
            status: 'status',
            title: 'title',
            content: 'content'
        };

        for (let attempt = 0; attempt < 10; attempt++) {
            const payload = {};
            if (title !== undefined && activeKeys.title) payload[activeKeys.title] = title;
            if (content !== undefined && activeKeys.content) payload[activeKeys.content] = content;
            if (status !== undefined && activeKeys.status) payload[activeKeys.status] = status;
            if (featuredImage !== undefined && activeKeys.featuredImage) payload[activeKeys.featuredImage] = featuredImage;

            try {
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    slug,
                    payload
                );
            } catch (error) {
                console.log(`Appwrite updatePost attempt ${attempt} error:`, error?.message);

                const match = error?.message?.match(/Unknown attribute:\s*"([^"]+)"/i);
                if (match && match[1]) {
                    const unknownAttr = match[1];
                    let fixed = false;
                    for (const [field, aliases] of Object.entries(keyMap)) {
                        if (activeKeys[field] === unknownAttr) {
                            const idx = aliases.indexOf(unknownAttr);
                            if (idx !== -1 && idx + 1 < aliases.length) {
                                activeKeys[field] = aliases[idx + 1];
                            } else {
                                activeKeys[field] = null;
                            }
                            fixed = true;
                            break;
                        }
                    }
                    if (fixed) continue;
                }

                throw error;
            }
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
                

            )
        } catch (error) {
            console.log("Appwrite serive :: getPosts :: error", error);
            return false
        }
    }

    // file upload service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            throw error;
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    getFilePreview(fileId){
        if (!fileId) return null;
        try {
            const preview = this.bucket.getFilePreview(
                conf.appwriteBucketId,
                fileId
            );
            return preview?.href || (typeof preview === 'string' ? preview : preview?.toString());
        } catch (error) {
            console.log("Appwrite service :: getFilePreview :: error", error);
            return null;
        }
    }
}


const service = new Service()
export default service