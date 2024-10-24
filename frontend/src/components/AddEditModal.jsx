import React, { useState } from 'react'
import { TiPen } from "react-icons/ti";
import { MdOutlineContentPaste } from "react-icons/md";
import { FaHashtag } from "react-icons/fa6";
import { TiDeleteOutline } from "react-icons/ti";
import { FiDelete } from "react-icons/fi";
import axiosInstance from '../utilities/axiosInstance';
import { toast } from 'react-toastify';

const AddEditModal = ({ onClose, getAllNote, type, noteDate }) => {

    const [title, setTitle] = useState(noteDate?.title || "");
    const [content, setContent] = useState(noteDate?.content || "")
    const [tags, setTags] = useState(noteDate?.tags || [])
    const [tagInput, setTagInput] = useState("");

    const [error, setError] = useState("")

    const handleAddTag = async (e) => {
        e.preventDefault();

        if (tagInput.trim() !== "") {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
            toast.success("Add Tag Successfully")
        }
    }

    const handleDeleteTag = async (e, tagRemove) => {
        e.preventDefault();

        setTags(tags.filter((tag) => tag !== tagRemove))
        toast.success("Delete Tag Successfully")
    }

    const addNote = async () => {
        try {
            const response = await axiosInstance.post("/add-note", {
                title: title,
                content: content,
                tags: tags,
            })

            toast.success("Add Note Successfully")
            onClose()
            getAllNote()
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message)
            } else {
                alert("An unexpected error occurred")
            }
        }
    }

    const editNote = async () => {
        try {
            const noteId = noteDate._id

            const response = await axiosInstance.put(`/edit-note/${noteId}`, {
                title: title,
                content: content,
                tags: tags
            })

            toast.success("Edit Note Successfully")
            onClose()
            getAllNote()
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message)
            } else {
                alert("An unexpected error occurred")
            }
        }
    }

    const handleAddEditNote = (e) => {
        e.preventDefault();

        if (!title) {
            setError("Please enter the title")
            return
        }

        if (!content) {
            setError("Please enter the content")
            return
        }

        setError("")

        if (type === "edit") {
            editNote()
        } else {
            addNote()
        }
    }



    return (
        <div className='my-5 relative'>
            <form >
                <div className='w-[100%] h-fit px-5 py-6 border rounded-md '>
                    <p className='text-xl mb-1'>Title</p>
                    <div className='flex items-center border w-80 h-8 rounded-md px-2 gap-1 hover:border-primary'>
                        <TiPen />
                        <input
                            type="text"
                            placeholder='Title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className='focus:outline-none w-full'
                        />
                    </div>

                    <p className='mt-3 mb-1 text-xl'>Content</p>
                    <div className='flex items-center border w-80 h-8 rounded-md px-2 gap-1 hover:border-primary'>
                        <MdOutlineContentPaste />
                        <input
                            type="text"
                            placeholder='Content'
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className='focus:outline-none w-full'
                        />
                    </div>
                </div>

                <div className='my-3 text-slate-500 w-fit'>
                    <p className='text-xl mb-1'>Tags</p>
                    <div className='flex gap-3'>
                        {tags.map((tag, index) => {
                            return (
                                <div className='mb-3 bg-gray-100 rounded-md pl-2 pr-7 py-1 relative' key={index}>
                                    #{tag}
                                    <button className='absolute top-1 right-1 text-sm'
                                        onClick={(e) => handleDeleteTag(e, tag)}
                                    >
                                        <FiDelete />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                    <div className='flex gap-20 items-center'>
                        <div className='flex items-center border w-52 h-8 rounded-md px-2 gap-1 hover:border-primary'>
                            <FaHashtag className='text-slate-500' />
                            <input
                                type="text"
                                placeholder='Tag'
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                className='focus:outline-none w-full'
                            />
                        </div>

                        <button
                            className='bg-green-500 p-2 rounded-lg text-white hover:bg-green-600'
                            onClick={handleAddTag}
                        >
                            ADD TAG
                        </button>
                    </div>
                </div>

                {error && <p className="mt-2 text-red-400">{error}</p>}

                <button
                    className='bg-primary p-2 rounded-lg text-white hover:bg-blue-500 text-xl'
                    onClick={handleAddEditNote}
                >
                    {type === "add" ? "ADD NOTE" : "EDIT NOTE"}
                </button>
            </form>

            <div className='absolute -top-4 -right-5 cursor-pointer' onClick={() => onClose()}>
                <TiDeleteOutline className='text-slate-500' />
            </div>
        </div>
    )
}

export default AddEditModal