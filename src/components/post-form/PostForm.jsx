import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const currentUser = userData?.userData || userData;

            if (post) {
                const file = data.image && data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

                if (file && post.featuredImage) {
                    appwriteService.deleteFile(post.featuredImage);
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : undefined,
                });

                if (dbPost) {
                    setSuccess("Post updated successfully! Redirecting...");
                    setTimeout(() => navigate(`/post/${dbPost.$id}`), 1000);
                } else {
                    setError("Failed to update post in database. Please check Appwrite permissions/configuration.");
                }
            } else {
                if (!data.image || !data.image[0]) {
                    setError("Please select a featured image before publishing.");
                    setLoading(false);
                    return;
                }

                const file = await appwriteService.uploadFile(data.image[0]);

                if (!file) {
                    setError("Failed to upload featured image. Please check Appwrite Bucket ID and permissions.");
                    setLoading(false);
                    return;
                }

                const fileId = file.$id;
                data.featuredImage = fileId;

                const authorName = currentUser?.name || (currentUser?.email ? currentUser.email.split('@')[0] : "Author");

                const dbPost = await appwriteService.createPost({
                    ...data,
                    userId: currentUser?.$id || "anonymous",
                    author: authorName,
                });

                if (dbPost) {
                    setSuccess("Post published successfully! Redirecting...");
                    setTimeout(() => navigate(`/post/${dbPost.$id}`), 1000);
                } else {
                    setError("Failed to save post to database. Please check Appwrite Database/Collection ID & permissions.");
                }
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred while publishing.");
        } finally {
            setLoading(false);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-")
                .slice(0, 36);

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap -mx-2">
            {error && (
                <div className="w-full px-2 mb-4">
                    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center justify-between">
                        <span>⚠️ {error}</span>
                        <button type="button" onClick={() => setError("")} className="font-bold ml-2">✕</button>
                    </div>
                </div>
            )}
            {success && (
                <div className="w-full px-2 mb-4">
                    <div className="bg-emerald-50 border border-emerald-300 text-emerald-700 px-4 py-3 rounded-2xl text-sm font-semibold">
                        ✅ {success}
                    </div>
                </div>
            )}
            <div className="w-full lg:w-2/3 px-2 mb-6">
                <div className="bg-[#F2EFE5] border border-[#E0DCD0] rounded-3xl p-6 shadow-sm space-y-4">
                    <Input
                        label="Title :"
                        placeholder="Enter editorial title..."
                        className="mb-2"
                        {...register("title", { required: true })}
                    />
                    <Input
                        label="Slug :"
                        placeholder="slug-url"
                        className="mb-2"
                        {...register("slug", { required: true })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                        }}
                    />
                    <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                </div>
            </div>
            <div className="w-full lg:w-1/3 px-2 mb-6">
                <div className="bg-[#F2EFE5] border border-[#E0DCD0] rounded-3xl p-6 shadow-sm space-y-4">
                    <Input
                        label="Featured Image :"
                        type="file"
                        className="mb-2"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        {...register("image", { required: !post })}
                    />
                    {post && (
                        <div className="w-full mb-4 rounded-xl overflow-hidden border border-[#E0DCD0]">
                            <img
                                src={appwriteService.getFileView(post.featuredImage || post.featuredimages)}
                                alt={post.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}
                    <Select
                        options={["active", "inactive"]}
                        label="Status"
                        className="mb-4"
                        {...register("status", { required: true })}
                    />
                    <Button type="submit" disabled={loading} className={`w-full py-3 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
                        {loading ? "PUBLISHING..." : post ? "UPDATE ESSAY" : "PUBLISH ESSAY"}
                    </Button>
                </div>
            </div>
        </form>
    );
}
