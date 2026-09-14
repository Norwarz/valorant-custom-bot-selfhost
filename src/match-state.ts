export type Participant = {
    id: string;
    displayName: string;
};

const participants = new Map<string, Participant>();

export function joinMatch(participant: Participant): boolean {
    if (participants.has(participant.id)) {
        return false;
    }
    participants.set(participant.id, participant);
    return true;
}

export function getParticipantCount(): number {
    return participants.size;
}

export function getParticipants(): Participant[] { 
    return [...participants.values()];
}

export function leaveMatch(userId: string) : Participant | null {
    const participant = participants.get(userId);
    if (!participant) {
        return null;
    }
    participants.delete(userId);
    return participant;
}
