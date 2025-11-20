"use client"
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { Article } from './ArticleClient'
import { Search as SearchIcon, X } from 'lucide-react'

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
                console.log(error, "Something went wrong")
            } finally {
                setLoading(false)
            }
        }
        
        const timeoutId = setTimeout(() => {
            getBySearch()
        }, 300) // Debounce search

        return () => clearTimeout(timeoutId)
    }, [searchTerm, setFilteredArticles, setLoading])

    const clearSearch = () => {
        setSearchTerm("")
    }

    return (
        <div className="mb-8">
            <div className="max-w-2xl mx-auto">
                <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        name="search"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search articles by title, content, or category..."
                        className="pl-12 pr-10 py-6 text-base rounded-full border-2 focus:border-primary transition-colors bg-background"
                    />
                    {searchTerm && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    )}
                </div>
                {searchTerm && (
                    <p className="text-sm text-muted-foreground mt-2 text-center">
                        Searching for: <span className="font-medium text-foreground">&quot;{searchTerm}&quot;</span>
                    </p>
                )}
            </div>
        </div>
    )
}

export default Search