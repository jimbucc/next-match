
import { useRef, useEffect, useCallback } from "react";
import usePresenceStore from "./usePresenceStore"
import { pusherClient } from "@/lib/pusher";
import { Channel, Members } from "pusher-js";

export const usePresenceChannel = () => {
    const {set, add, remove} = usePresenceStore(state => ({
        set: state.set,
        add: state.add,
        remove: state.remove
    }));

    const channelRef = useRef<Channel | null>(null);

    // callback handlers
    const handleSetMembers = useCallback((memberIds: string[]) => {
        set(memberIds)
    },[set])

    const handleAddMember = useCallback((memberId: string) => {
        add(memberId)
    },[add])

    const handleRemoveMember = useCallback((memberId: string) => {
        remove(memberId)
    },[remove])

    useEffect(() => {
      if(!channelRef.current) {
        channelRef.current = pusherClient.subscribe('presence-nm');

        channelRef.current.bind('pusher:subscription_succeeded', (members: Members) => {
            handleSetMembers(Object.keys(members.members));
        })

        channelRef.current.bind('pusher:member_added', (member: Record<string,any>) => {
            handleAddMember(member.id)    
        }) 

        channelRef.current.bind('pusher:member_removed', (member: Record<string,any>) => {
            handleRemoveMember(member.id)
        }) 
      }

      return () => {
        if(channelRef.current && channelRef.current.subscribed) {
            channelRef.current.unsubscribe();
            channelRef.current.unbind('pusher:subscription_succeeded', handleSetMembers)
            channelRef.current.unbind('pusher:member_added', handleAddMember)
            channelRef.current.unbind('pusher:member_removed', handleRemoveMember)
        }
      }
    
    }, [handleAddMember, handleRemoveMember, handleSetMembers])
}