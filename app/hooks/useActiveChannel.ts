import { Channel, Members } from "pusher-js";
import useActiveList from "./useActiveList";
import { useEffect, useState } from "react";
import { pusherClient } from "../libs/pusher";

const useActiveChannel = () => {
    const { set, add, remove } = useActiveList();
    const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

    useEffect(() => {
        let channel = activeChannel;
        if (!channel) {
            channel = pusherClient.subscribe('presence-messenger');
            setActiveChannel(channel)
        }
        channel.bind('pusher:subscription_succeeded', (members: Members) => {
            const initialMembers: string[] = [];
            console.log({ members })
            members.each((m: Record<string, any>) => initialMembers.push(m.id))
            set(initialMembers)
        })

        channel.bind('pusher:member_added', ((m: Record<string, any>) => {
            add(m.id);
        }));

        channel.bind('pusher:member_removed', ((m: Record<string, any>) => {
            remove(m.id);
        }));

        return () => {
            if (activeChannel) {
                pusherClient.unsubscribe('presence-messenger');
                setActiveChannel(null);
            }
        }
    }, [activeChannel, set, add, remove])
}

export default useActiveChannel;
