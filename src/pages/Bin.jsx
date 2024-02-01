import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaRegTrashAlt } from 'react-icons/fa'
import { MdDelete, MdLightbulbOutline } from 'react-icons/md'
import { FaLaptopCode } from "react-icons/fa6";
import { useDefaultContext } from '../context/defaultContext';
import { db } from '../config/firebase';
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore/lite';
import { FiEdit } from "react-icons/fi";
import { MdRestorePage } from "react-icons/md";
import { FcEmptyTrash } from "react-icons/fc";
import { toast } from 'react-toastify';

const Bin = () => {
    const [notes, setNotes] = useState([]);
    const { isLoading, authUser } = useDefaultContext();
    const navigate = useNavigate();

    const fetchNotes = async (uid) => {
        try {
            const q = query(collection(db, "notes"), where("author", "==", uid), where("trash", "==", true));
            const querySnapshot = await getDocs(q);

            let data = [];
            querySnapshot.forEach((note) => {
                data.push({ ...note.data(), id: note.customID });
            });
            setNotes(data);
        } catch (error) {
            console.error("An error occured", error);
        }
    };

    const outOfTrash = async (docID) => {
        await updateDoc(doc(db, "notes", docID), {
            trash: false,
        });
        toast.success('Restored from Trash!', {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        fetchNotes(authUser.email)
    }

    const deleteNote = async (docId) => {
        try {
            await deleteDoc(doc(db, "notes", docId));
            toast.success('Permanently Deleted!', {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            fetchNotes(authUser.email);
        } catch (error) {
            console.error("An error occured", error);
        }
    };

    useEffect(() => {
        if (!isLoading && !authUser) {
            navigate("/authentication");
        }
        if (!!authUser) {
            fetchNotes(authUser.email);
        }
    }, [authUser, isLoading]);

    return (
        <main className='h-[calc(100vh-56px)] w-full grid lg:grid-cols-12 gap-2'>
            <div id='lg_sidebar' className='h-[calc(100vh-56px)] hidden lg:block lg:col-span-3 duration-300'>
                <ul>
                    <li>
                        <Link to='/' id='li1' className='flex items-center gap-5 px-3 h-12 w-full my-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700 rounded-tr-full rounded-br-full font-semibold'>
                            <MdLightbulbOutline className='text-zinc-500 dark:text-zinc-200 text-2xl' />
                            <span id='sidebarText1'>Notes</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='/bin' id='li2' className='flex items-center gap-5 px-4 h-12 w-full my-2 text-zinc-700 dark:text-zinc-200 bg-amber-100 hover:bg-amber-100 dark:bg-yellow-700 dark:hover:bg-yellow-700 rounded-tr-full rounded-br-full font-semibold'>
                            <FaRegTrashAlt className='text-zinc-900 dark:text-zinc-200 text-xl' />
                            <span id='sidebarText2'>Trash</span>
                        </Link>
                    </li>
                    <li>
                        <a href='https://portfolio-adhikarysayandip-gmailcom.vercel.app/' id='li3' className='flex items-center gap-5 px-4 h-12 w-full my-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700 rounded-tr-full rounded-br-full font-semibold'>
                            <FaLaptopCode className='text-zinc-500 dark:text-zinc-200 text-xl' />
                            <span id='sidebarText3'>Developer</span>
                        </a>
                    </li>
                </ul>
            </div>
            <div id='lg_content' className='bg-white dark:bg-[#202025] h-[calc(100vh-56px)] lg:col-span-9 p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 overflow-y-auto'>
                {
                    notes.length > 0 ?
                        notes.map((note) => (
                            <div className="w-[100%] h-fit rounded-xl border border-zinc-400 dark:border-zinc-700 flex flex-col justify-center gap-3 p-2" key={note.customID}>
                                <h3 className="font-semibold cursor-pointer text-zinc-900 dark:text-zinc-200">
                                    {note.heading}
                                </h3>
                                <div>
                                    <p className="text-sm text-zinc-900 dark:text-zinc-200">
                                        {note.content}
                                    </p>
                                </div>
                                <div className='p-2 w-full flex items-center justify-between'>
                                    <button className="font-semibold p-2 bg-zinc-100 hover:bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-200 rounded-lg mx-auto flex items-center justify-center" onClick={() => outOfTrash(note.customID)}><MdRestorePage /></button>
                                    <button className="font-semibold p-2 bg-zinc-100 hover:bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-200 rounded-lg mx-auto flex items-center justify-center" onClick={() => deleteNote(note.customID)}><MdDelete /></button>
                                </div>
                            </div>
                        ))
                        :
                        <p className="w-full col-span-4 text-zinc-900 dark:text-zinc-200 flex flex-col items-center justify-center capitalize gap-5">
                            <FcEmptyTrash className='h-12 w-12' />
                            Your trash bin is empty
                        </p>
                }
            </div>
        </main>
    )
}

export default Bin