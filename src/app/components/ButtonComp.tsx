"use client"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const ButtonComp = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    const handleDelete = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/delete-user/${id}`, {
                method: "DELETE"
            })
            const result = await response.json();
            if (result.success) {
                toast.success("Post Deleted Sucessfully")
                router.refresh()
            } else {
                toast.error(result.message || "Error Deleting Post")
            }
        } catch (error) {
            console.log("Something went wrong", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Button size="sm" variant="destructive" className="text-xs" onClick={handleDelete}>
                {loading ? (
                    <>
                        <Loader2 className='animate-spin ' />
                        <p>Deleting...</p>
                    </>
                ) : "Delete"}
            </Button>
        </div>
    )
}

export default ButtonComp