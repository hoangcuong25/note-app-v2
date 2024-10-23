import React, { useState } from 'react'
import { TiPen } from "react-icons/ti";
import { MdOutlineContentPaste } from "react-icons/md";
import { FaHashtag } from "react-icons/fa6";
import { TiDeleteOutline } from "react-icons/ti";
import axiosInstance from '../utilities/axiosInstance';

const AddEditModal = ({ onClose, getAllNote }) => {

    const [title, setTitle] = useState()
    const [content, setContent] = useState()
    const [tags, setTags] = useState([])
    const [tagInput, setTagInput] = useState("");

    const [error, setError] = useState("")

    const handleAddTag = async (e) => {
        e.preventDefault();

        if (tagInput.trim() !== "") {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    }

    const handleAddNote = async (e) => {
        e.preventDefault();

        try {
            if (!title || !content) {
                setError("Please fill in both the title and content");
                return;
            }

            setError("")

            const response = await axiosInstance.post("/add-note", {
                title: title,
                content: content,
                tags: tags,
            })

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

    console.log("tags: ", tags)
    console.log("title: ", title)
    console.log("content: ", content)

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
                                <p className='mb-1 bg-gray-100 rounded-md px-2 py-1' key={index}>#{tag}</p>
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
                    onClick={handleAddNote}
                >
                    add edit
                </button>
            </form>

            <div className='absolute -top-4 -right-5 cursor-pointer' onClick={() => onClose()}>
                <TiDeleteOutline className='text-slate-500' />
            </div>
        </div>
    )
}

export default AddEditModal