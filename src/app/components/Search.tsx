"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { Article } from './ArticleClient'

interface Props {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    setFilteredArticles: React.Dispatch<React.SetStateAction<Article[]>>
}


const Search = ({ setFilteredArticles, setLoading }: Props) => {
    const [searchTerm, setSearchTerm] = useState<string>("")


    useEffect(() => {
        const query = new URLSearchParams({
            searchTerm: searchTerm
        })

        const getBySearch = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/search-article?${query.toString()}`)
                const result = await response.json()
                if (result.success) {
                    setFilteredArticles(result.articles)
                }
            } catch (error) {
                console.log(error,"Something went wrong")

            }finally{
                setLoading(false)
            }
        }
        getBySearch()
    }, [searchTerm,setFilteredArticles,setLoading])

    return (
        <div>
            <div className="mb-5 flex justify-center items-center py-4 gap-3">
                <Input
                    type="text"
                    name="search"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for Articles"
                    className="max-w-lg w-full border shadow-lg rounded-lg px-3"
                />
                <Button>Search</Button>
            </div>

        </div>
    )
}

export default Search