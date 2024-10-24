/* eslint-disable no-unreachable */
import React from 'react'
import { MdDeleteOutline } from "react-icons/md";
import { MdEditNote } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";
import img from "../assets/bg-img.jpg"
import moment from "moment"
import axiosInstance from '../utilities/axiosInstance';

const CardNote = ({ title, content, isPinned, editNote,
    tags, handleDeleteNote, date, editIsPinned }) => {

    return (
        <div className='flex flex-col my-8 mx-7 p-3 
        bg-white rounded-md w-72 h-96 hover:scale-105 transition-all duration-500 relative'>
            <img src={img} alt="" className='size-36' />

            <div className='mt-2 text-xl font-medium'>
                {title}
            </div>

            <div>
                {content}
            </div>

            <div className='absolute bottom-10 text-sm text-slate-700'>
                {moment(date).format("MMMM Do YYYY")}
            </div>

            <div className='flex absolute bottom-3 right-3 text-xl gap-3'>
                <button
                    onClick={() => handleDeleteNote()}
                    className='cursor-pointer'
                >
                    <MdDeleteOutline />
                </button>

                <button
                    onClick={() => editNote()}
                    className='cursor-pointer'
                >
                    <MdEditNote />
                </button>
            </div>

            <div className='flex absolute bottom-3 gap-2 text-xs text-slate-500 w-fit'>
                {tags.map((item, index) => {
                    if (tags) {
                        return <p
                            key={index}
                            className='text-center px-2 py-1 gap-3 rounded-md bg-gray-100'>
                            #{item}
                        </p>
                    } else {
                        return null;
                    }
                })}
            </div>

            <div className='flex items-center justify-center absolute text-2xl right-3 border rounded-full size-8 cursor-pointer'>
                {isPinned ?
                    <FaStar className='text-xl text-red-600' onClick={() => editIsPinned()} /> :
                    <CiStar onClick={() => editIsPinned()} />
                }
            </div>

        </div>
    )
}

export default CardNote