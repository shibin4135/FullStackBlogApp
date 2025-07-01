import { SignIn } from "@clerk/nextjs";

const Signin = () => {
    return <div className="flex items-center justify-center py-10">
        <SignIn />
    </div>
}

export default Signin