import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaRegTrashAlt } from 'react-icons/fa'
import { MdDelete, MdLightbulbOutline, MdCopyAll } from 'react-icons/md'
import { FaLaptopCode } from "react-icons/fa6";
import { useDefaultContext } from '../context/defaultContext';
import { db } from '../config/firebase';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore/lite';
import { FiEdit } from "react-icons/fi";
import { IoShareSocialSharp } from "react-icons/io5";
import { FcAnswers } from 'react-icons/fc';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

const Home = () => {
    const [notes, setNotes] = useState([]);
    const [openNote, setOpenNote] = useState(false);
    const { isLoading, authUser } = useDefaultContext();
    const navigate = useNavigate();
    const [editHeading, setEditHeading] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editID, setEditID] = useState('');
    const [heading, setHeading] = useState('')
    const [contents, setContents] = useState('')

    const addDocToDB = async (e) => {
        e.preventDefault()
        if (!heading || !contents) {
            toast.error('Fields are empty!', {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return;
        }
        try {
            const notesCollection = 'notes';
            const data = {
                "heading": heading,
                "content": contents,
                "trash": false,
                "author": authUser.email,
                "customID": "",
            }
            const notesCollectionRef = collection(db, notesCollection);
            const newNoteDocRef = await addDoc(notesCollectionRef, data);
            await updateDoc(doc(db, notesCollection, newNoteDocRef.id), {
                customID: newNoteDocRef.id,
            });
            toast.success('Note Creation Successful!', {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setHeading('')
            setContents('')
            fetchNotes(authUser.email)
        } catch (error) {
            console.log(error);
        }
    }

    const setContent = (note) => {
        setEditHeading(note.heading)
        setEditContent(note.content)
        setEditID(note.customID)
    }

    const updateNote = async (noteID) => {
        await updateDoc(doc(db, "notes", noteID), {
            heading: editHeading,
            content: editContent,
        });
        fetchNotes(authUser.email)
    }

    const fetchNotes = async (uid) => {
        try {
            const q = query(collection(db, "notes"), where("author", "==", uid), where("trash", "==", false));
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

    const sendToTrash = async (docID) => {
        await updateDoc(doc(db, "notes", docID), {
            trash: true,
        });
        fetchNotes(authUser.email)
    }

    useEffect(() => {
        if (!isLoading && !authUser) {
            navigate("/authentication");
        }
        if (!!authUser) {
            fetchNotes(authUser.email);
        }
    }, [authUser, isLoading]);

    return (
        <main className='h-[calc(100vh-56px)] w-full grid lg:grid-cols-12 gap-2 relative'>
            <div id='lg_sidebar' className='h-[calc(100vh-56px)] hidden lg:block lg:col-span-3 duration-300'>
                <ul>
                    <li>
                        <Link to='/' id='li1' className='flex items-center gap-5 px-3 h-12 w-full my-2 text-zinc-700 dark:text-zinc-200 bg-amber-100 hover:bg-amber-100 dark:bg-yellow-700 dark:hover:bg-yellow-700 rounded-tr-full rounded-br-full font-semibold'>
                            <MdLightbulbOutline className='text-zinc-900 dark:text-zinc-200 text-2xl' />
                            <span id='sidebarText1'>Notes</span>
                        </Link>
                    </li>
                    <li>
                        <Link to='/bin' id='li2' className='flex items-center gap-5 px-4 h-12 w-full my-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-700 rounded-tr-full rounded-br-full font-semibold'>
                            <FaRegTrashAlt className='text-zinc-500 dark:text-zinc-200 text-xl' />
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
            <div id='lg_content' className='bg-white dark:bg-[#202025] h-[calc(100vh-56px)] lg:col-span-9 p-2  overflow-y-auto'>
                <div className='h-fit lg:w-[70%] mx-auto my-5 bg-transparent border border-zinc-200 dark:border-zinc-700 shadow-md rounded-lg p-2 gap-2'>
                    <input value={heading} onChange={(e) => setHeading(e.target.value)} type='text' placeholder='Title' className='bg-transparent focus:outline-none text-zinc-800 dark:text-zinc-200 w-full' />
                    <textarea value={contents} onChange={(e) => setContents(e.target.value)} rows='5' typeof='text' placeholder='Write your note here...' className='bg-transparent resize-none focus:outline-none text-zinc-800 dark:text-zinc-200 w-full' />
                    <div className='w-full flex items-center justify-end gap-5'>
                        <button className='bg-zinc-100 h-8 w-28 rounded-lg hover:bg-zinc-200 text-zinc-900 font-semibold text-sm dark:bg-zinc-700 dark:hover:bg-zinc-800 dark:text-zinc-200' onClick={addDocToDB}>Save</button>
                        <button className='bg-zinc-100 h-8 w-28 rounded-lg hover:bg-zinc-200 text-zinc-900 font-semibold text-sm dark:bg-zinc-700 dark:hover:bg-zinc-800 dark:text-zinc-200' onClick={() => {
                            setHeading('')
                            setContents('')
                        }}>
                            Clear
                        </button>
                    </div>
                </div>
                <div className='lg:col-span-9 p-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 h-[calc(100vh-340px)]'>
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
                                        <button className="font-semibold p-2 bg-zinc-100 hover:bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-200 rounded-lg mx-auto flex items-center justify-center" onClick={() => {
                                            setOpenNote(true)
                                            setContent(note)
                                        }}>
                                            <FiEdit />
                                        </button>
                                        <button className="font-semibold p-2 bg-zinc-100 hover:bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-200 rounded-lg mx-auto flex items-center justify-center" onClick={() => {
                                            sendToTrash(note.customID)
                                            toast.success('Moved to Trash!', {
                                                position: "bottom-left",
                                                autoClose: 5000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                                theme: "dark",
                                            });
                                        }}>
                                            <MdDelete />
                                        </button>
                                        <CopyToClipboard text={note.content} onCopy={() => {
                                            toast.success('Note Copied!', {
                                                position: "bottom-left",
                                                autoClose: 5000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                                progress: undefined,
                                                theme: "dark",
                                            });
                                        }}>
                                            <button className="font-semibold p-2 bg-zinc-100 hover:bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-200 rounded-lg mx-auto flex items-center justify-center"><IoShareSocialSharp /></button>
                                        </CopyToClipboard>
                                    </div>
                                </div>
                            ))
                            :
                            <p className="w-full col-span-4 text-zinc-900 dark:text-zinc-200 flex flex-col items-center justify-center capitalize gap-5">
                                <FcAnswers className='h-12 w-12' />
                                You do not have any notes
                            </p>
                    }
                </div>
                {openNote ?
                    <div className='h-[calc(100vh-56px)] w-full bg-[rgba(0,0,0,0.3)] dark:bg-[rgba(0,0,0,0.5)] absolute top-0 left-0 flex items-center justify-center'>
                        <div className='max-h-[90%] h-fit w-[90%] md:w-[75%] lg:w-[700px] border border-zinc-400 bg-white dark:bg-zinc-800 dark:border-zinc-700 rounded-lg p-2'>
                            <form className='flex flex-col justify-center gap-2 p-2'>
                                <input type='text' value={editHeading} onChange={(e) => setEditHeading(e.target.value)} className='text-lg bg-transparent focus:outline-none text-zinc-900 dark:text-zinc-200' />
                                <textarea rows='15' type='text' value={editContent} onChange={(e) => setEditContent(e.target.value)} className='bg-transparent resize-none focus:outline-none text-zinc-900 dark:text-zinc-200' />
                            </form>
                            <div className='w-full grid grid-cols-3 gap-2'>
                                <CopyToClipboard text={editContent}>
                                    <button onClick={() => {
                                        toast.success('Note Copied!', {
                                            position: "bottom-left",
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                            theme: "dark",
                                        });
                                        setOpenNote(false)
                                    }}
                                        className='text-zinc-900 dark:text-zinc-200 bg-zinc-100 hover:bg-zinc-200 h-8 dark:bg-zinc-700 dark:hover:bg-zinc-900 rounded-md flex items-center justify-center gap-1 capitalize'><MdCopyAll />copy</button>
                                </CopyToClipboard>
                                <button onClick={() => {
                                    sendToTrash(editID)
                                    toast.success('Moved to Trash!', {
                                        position: "bottom-left",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "dark",
                                    });
                                    setOpenNote(false)
                                }}
                                    className='text-zinc-900 dark:text-zinc-200 bg-zinc-100 hover:bg-zinc-200 h-8 dark:bg-zinc-700 dark:hover:bg-zinc-900 rounded-md flex items-center justify-center gap-1 capitalize'><MdDelete />delete</button>
                                <button onClick={() => {
                                    updateNote(editID)
                                    setOpenNote(false)
                                }}
                                    className='text-zinc-900 dark:text-zinc-200 bg-zinc-100 hover:bg-zinc-200 h-8 dark:bg-zinc-700 dark:hover:bg-zinc-900 rounded-md'>Close</button>
                            </div>
                        </div>
                    </div>
                    : <></>
                }
            </div>
        </main >
    )
}

export default Home