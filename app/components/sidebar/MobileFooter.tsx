'use client'

import useConversation from "@/app/hooks/useConversation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";

const MobileFooter = () => {
    const routes = useRoutes();
    const { isOpen } = useConversation();
    if (isOpen) {
        return null
    }
    return (
        <div
            className="
                fixed
                justify-between
                w-full
                bottom-0
                z-40
                flex
                items-center
                bg-white
                border-t-[1px]
                lg:hidden
        "
        >
            {
                routes.map(({ label, href, icon, active, onClick }) =>
                    <MobileItem
                        label={label}
                        key={label}
                        icon={icon}
                        href={href}
                        onClick={onClick}
                        active={active}
                    />)
            }
        </div>
    )
}

export default MobileFooter;