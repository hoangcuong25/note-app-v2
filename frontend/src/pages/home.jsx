import { useEffect, useState } from "react"
import CardNote from "../components/CardNote"
import Navbar from "../components/Navbar"
import axiosInstance from '../utilities/axiosInstance'
import { IoIosAdd } from "react-icons/io";
import Modal from 'react-modal';
import AddEditModal from "../components/AddEditModal";
import { toast } from 'react-toastify';

const Home = () => {

    const [userInfo, setUserInfo] = useState()
    const [noteInfo, setNoteInfo] = useState()

    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null
    })

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");

            if (response.data && response.data.userName) {
                setUserInfo(response.data.userName);
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    }

    const getAllNote = async () => {
        try {
            const response = await axiosInstance.get("/get-all-notes")
            if (response.data && response.data.notes) {
                setNoteInfo(response.data.notes)
            }

        } catch (error) {
            console.error("Error fetching note info:", error);
        }
    }

    const handleDeleteNote = async (note) => {
        try {
            const noteId = note._id;
            await axiosInstance.delete(`/delete-note/${noteId}`);

            toast.success("Delete Note Successfully")
            getAllNote()
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const editIsPinned = async (note) => {
        try {
            const noteId = note._id
            const response = await axiosInstance.put(`/edit-pinned/${noteId}`, {
                isPinned: !note.isPinned
            })
            
            getAllNote()
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message)
            } else {
                alert("An unexpected error occurred")
            }
        }

    }

    const editNote = async (note) => {
        setOpenAddEditModal({
            isShown: true,
            type: "edit",
            data: note
        })
    }

    const onSearchNote = async (query) => {
        try {
            const res = await axiosInstance.get("/search-notes", {
                params: { query },
            })

            if (res.data && res.data.notes) {
                setNoteInfo(res.data.notes)
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message)
            } else {
                alert("An unexpected error occurred")
            }
        }
    }

    useEffect(() => {
        getUserInfo()
        getAllNote()
    }, [])

    return (
        <div className="w-full bg-amber-200">
            <Navbar userInfo={userInfo} onSearchNote={onSearchNote} getAllNote={getAllNote} />
            <div className="flex flex-wrap justify-start">
                {noteInfo?.map((note) => {
                    return <CardNote
                        key={note._id}
                        title={note.title}
                        date={note.createdOn}
                        content={note.content}
                        isPinned={note.isPinned}
                        tags={note.tags}
                        handleDeleteNote={() => handleDeleteNote(note)}
                        editNote={() => editNote(note)}
                        editIsPinned={() => editIsPinned(note)}
                    />
                })}
            </div>

            <div
                className="fixed right-7 bottom-10 bg-primary size-14
                flex justify-center items-center rounded-full cursor-pointer"
                onClick={() => setOpenAddEditModal({
                    isShown: true,
                    type: "add",
                    data: null
                })}
            >
                <IoIosAdd className="text-white size-11" />
            </div>

            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => setOpenAddEditModal({
                    isShown: false,
                    type: "add",
                    data: null
                })}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.2)"
                    }
                }}
                contentLabel=""
                className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
            >
                <AddEditModal
                    onClose={() => setOpenAddEditModal({
                        isShown: false,
                        type: "add",
                        data: null
                    })}
                    type={openAddEditModal.type}
                    getAllNote={getAllNote}
                    noteDate={openAddEditModal.data}
                />
            </Modal>
        </div>
    )
}

export default Home