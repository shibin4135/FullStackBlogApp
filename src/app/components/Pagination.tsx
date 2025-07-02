"use client"
import React, { useEffect, useState } from 'react'
import { Article } from './ArticleClient'
import { Button } from '@/components/ui/button'

const Pagination = ({ setFilteredArticles }: { setFilteredArticles: React.Dispatch<React.SetStateAction<Article[]>> }) => {
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [articleCount, setArticleCount] = useState<number>(1)
    const ITEMS_PER_PAGE = 2
    const totalPages = Math.ceil(articleCount / ITEMS_PER_PAGE)

    useEffect(() => {
        const fetchArticles = async () => {
            const response = await fetch(`api/pagination-prisma?page=${currentPage}&limit=${ITEMS_PER_PAGE}`)
            const result = await response.json()
            setFilteredArticles(result.articles)
            setArticleCount(result.count)
        }
        fetchArticles()
    }, [currentPage,setFilteredArticles])

    return (
        <div className='mt-10 flex items-center gap-3 justify-center'>
            <div onClick={() => setCurrentPage(currentPage - 1)} className='cursor-pointer'>
                <Button disabled={currentPage === 1}>Prev</Button>
            </div>

            {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1
                const isActive = currentPage === page

                return (
                    <div
                        key={index}
                        onClick={() => setCurrentPage(page)}
                        className={`cursor-pointer w-[50px] h-[50px] flex items-center justify-center px-3 py-2 rounded-full border-2 text-sm font-medium transition duration-200 ${isActive
                            ? "bg-white text-black border-black ring-2 ring-offset-2 ring-black"
                            : "bg-black text-white border-white hover:bg-gray-800"
                            }`}
                    >
                        {page}
                    </div>
                )
            })}


            <div onClick={() => setCurrentPage(currentPage + 1)} className='cursor-pointer'>
                <Button disabled={currentPage === totalPages}>Next</Button>
            </div>
        </div>
    )
}

export default Pagination
