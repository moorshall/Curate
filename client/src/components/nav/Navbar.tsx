// client/src/components/Navbar.tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { IconPlus, IconUser } from "@tabler/icons-react";
import { useForm } from "react-hook-form";

import NavbarLink from "./NavbarLink";
import Modal from "../Modal";
import googleLogo from "~/assets/google.png";
import { Popover, PopoverContent, PopoverTrigger } from "../Popover";
import logo from "~/assets/panda.png";
import { createPost } from "~/api/routes/post";
import { login } from "~/api/routes/user";

export default function Navbar() {
    const [postOpen, setPostOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PostForm>();

    const logoutWithRedirect = () => {
        console.log("add logout logic here");
    };

    const handlePost = async (data: PostForm) => {
        console.log(data);
        await createPost({
            title: data.content,
            description: "description",
            songs: [], // songs at some point
            origin: "spotify",
            downloads: 0,
        });
        setPostOpen(false);
    };

    return (
        <div className="flex justify-between items-center text-black dark:text-white">
            <NavLink to="/" className="flex items-center space-x-2">
                <img className="w-7 h-7 mt-1" src={logo} />
                <h3 className="font-bold">Curate</h3>
            </NavLink>
            <div className="space-x-8 flex flex-row items-center">
                <NavbarLink to="/" label="Home" />
                <NavbarLink to="/discover" label="Discover" />
                <NavbarLink to="/search" label="Search" />
                {false ? ( // put isAuthenticated here
                    <>
                        <Popover placement="bottom-start">
                            <PopoverTrigger>
                                <div className="pl-3 pr-4 py-2 rounded-lg border flex space-x-2 items-center">
                                    <IconUser size={20} />
                                    <p>{"username goes here"}</p>
                                    {/*<p>{user?.name}</p>*/}
                                </div>
                            </PopoverTrigger>
                            <PopoverContent>
                                <div className="flex flex-col items-start px-4 py-2 bg-b-secondary drop-shadow dark:bg-db-secondary rounded-md space-y-1">
                                    <NavbarLink to="/profile" label="Profile" />
                                    <button
                                        onClick={() => {
                                            logoutWithRedirect();
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <button
                            onClick={() => setPostOpen(true)}
                            className="bg-salmon text-white rounded-lg py-2 pl-3 pr-4 flex items-center space-x-2"
                        >
                            <IconPlus size={20} />
                            <p>Post</p>
                        </button>
                    </>
                ) : (
                    <button
                        className="px-4 py-2 rounded-lg border"
                        onClick={() => setAuthOpen(true)}
                    >
                        Login
                    </button>
                )}
            </div>
            <Modal open={authOpen} setOpen={setAuthOpen} title="Login">
                <button
                    className="bg-b-tertiary text-black drop-shadow-md py-2 pl-3 pr-5 rounded-md flex flex-row justify-center items-center"
                    onClick={() => login()}
                >
                    <img src={googleLogo} className="w-7 mr-2" />
                    <p>Authorize with Google</p>
                </button>
            </Modal>

            <Modal open={postOpen} setOpen={setPostOpen} title="Post">
                <form onSubmit={handleSubmit(handlePost)} className="space-y-2">
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder="Content"
                            {...register("content", {
                                required: "Content is required",
                                minLength: 2,
                            })}
                            className="p-2 rounded-md shadow-inner bg-b-tertiary dark:bg-db-tertiary w-full"
                        />
                        {errors.content && (
                            <p className="text-red-1 text-xs">
                                {errors.content.message as string}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-row justify-end pt-4">
                        <button
                            onClick={() => setPostOpen(false)}
                            type="button"
                        >
                            <p>Cancel</p>
                        </button>
                        <button className="ml-4 bg-salmon text-white drop-shadow-md py-2 px-4 rounded-md">
                            <p>Post</p>
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
