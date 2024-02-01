import React from 'react'
import { Link } from 'react-router-dom'
import { FaRegTrashAlt } from 'react-icons/fa'
import { MdLightbulbOutline } from 'react-icons/md'
import { FaLaptopCode } from "react-icons/fa6";

const NotFound = () => {
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
            <div id='lg_content' className='bg-white dark:bg-[#202025] h-[calc(100vh-56px)] lg:col-span-9'>
                <p>No Page Found</p>
            </div>
        </main>
    )
}

export default NotFound