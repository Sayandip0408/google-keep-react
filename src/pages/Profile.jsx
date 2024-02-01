import React, { useEffect, useState } from 'react'
import { FaLaptopCode, FaRegTrashAlt } from 'react-icons/fa'
import { MdLightbulbOutline, MdAddPhotoAlternate } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { useDefaultContext } from '../context/defaultContext'
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore/lite'
import { _auth, db, storage } from '../config/firebase'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from 'react-toastify'

const Profile = () => {
    const [userDetails, setUserDetails] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const { isLoading, authUser, signOut } = useDefaultContext();
    const navigate = useNavigate();

    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = (uid) => {
        if (image) {
            const uniqueFileName = Date.now().toString();
            const imgRef = ref(storage, `profileImages/${uniqueFileName}`)
            uploadBytes(imgRef, image).then((snapshot) => {
                getDownloadURL(snapshot.ref).then(async (downloadURL) => {
                    await updateDoc(doc(db, "users", uid), {
                        image: downloadURL,
                    });
                    toast.success('Profile Picture Updated Successfully!', {
                        position: "bottom-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                    fetchUser(authUser.email)
                }).catch((error) => {
                    console.error('Error getting download URL:', error.message);
                });
            }).catch((error) => {
                console.error('Error uploading image:', error.message);
            })
        }
    };

    const fetchUser = async (uid) => {
        try {
            const q = query(collection(db, "users"), where("email", "==", uid));
            const querySnapshot = await getDocs(q);

            let data = [];
            querySnapshot.forEach((user) => {
                data.push({ ...user.data(), id: user.userID });
            });
            setUserDetails(data[0]);
        } catch (error) {
            console.error("An error occured", error);
        }
    };

    useEffect(() => {
        if (!isLoading && !authUser) {
            navigate("/authentication");
        }
        if (!!authUser) {
            fetchUser(authUser.email);
        }
    }, [authUser, isLoading, setUserDetails]);

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
            <div id='lg_content' className='bg-white dark:bg-[#202025] h-[calc(100vh-56px)] lg:col-span-9 p-2 lg:p-5'>
                <div className='h-full w-full flex flex-col items-center justify-center gap-5'>
                    <h3 className='w-[80%] h-10 rounded-md text-center text-2xl lg:text-4xl font-semibold text-zinc-900 dark:text-zinc-200'>Profile Details</h3>
                    <div className='relative'>
                        <img src={userDetails.image} alt='profile image' className='h-32 w-32 lg:h-44 lg:w-44 border dark:border-zinc-700 rounded-full' />
                        <button className='absolute right-0 bottom-0 text-xl text-yellow-600 dark:text-yellow-400 hover:bg-zinc-100 dark:hover:bg-zinc-500 p-1 rounded-full' onClick={() => setShowInput(!showInput)}>
                            <MdAddPhotoAlternate />
                        </button>
                    </div>
                    {showInput ?
                        <>
                            <input type='file' className='text-xl text-yellow-600 dark:text-yellow-400 hover:bg-zinc-100 dark:hover:bg-zinc-500 p-1 rounded-full' onChange={handleImageChange} />
                            <button onClick={() => handleUpload(userDetails.userID)}>Submit</button>
                        </> :
                        <></>
                    }
                    <p className='w-[80%] max-w-[450px] h-10 rounded-md bg-zinc-100 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200 font-semibold flex items-center px-2 focus:outline-none'>{userDetails.name}</p>
                    <p className='w-[80%] max-w-[450px] h-10 rounded-md bg-zinc-100 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200 font-semibold flex items-center px-2'>{userDetails.email}</p>
                    <p className='w-[80%] max-w-[450px] h-10 rounded-md bg-zinc-100 dark:bg-zinc-600 text-zinc-700 dark:text-zinc-200 font-semibold flex items-center px-2'>{userDetails.gender}</p>
                    <button className='w-[80%] max-w-[450px] h-10 rounded-md shadow-md bg-yellow-400 hover:bg-yellow-500 text-black font-semibold' onClick={() => {
                        signOut()
                        toast.success('User Logged Out!', {
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
                        Logout
                    </button>
                </div>
            </div>
        </main>
    )
}

export default Profile