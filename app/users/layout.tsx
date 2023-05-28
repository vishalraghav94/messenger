import Sidebar from "../components/sidebar/Sidebar"
import getUsers from "../actions/getUsers"
import UserList from "./components/UserList";

export default async function UserLayout({
    children
}: {
    children: React.ReactNode
}) {
    const users = await getUsers();
    return (
        // @ts-expect-error Server component
        <Sidebar>
            <div
                className="h-full"
            >
                <UserList users={users} />
                {
                    children
                }
            </div>
        </Sidebar>)
}