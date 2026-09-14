export type Participant = {
    id: string;
    displayName: string;
};

const participants = new Map<string, Participant>();

/**
 * 参加者を追加する
 * @param participant 
 * @returns 
 */
export function joinMatch(participant: Participant): boolean {
    if (participants.has(participant.id)) {
        return false;
    }
    participants.set(participant.id, participant);
    return true;
}

/**
 * 参加者数取得
 * @returns 
 */
export function getParticipantCount(): number {
    return participants.size;
}

/**
 * 参加者一覧取得
 * @returns 
 */
export function getParticipants(): Participant[] { 
    return [...participants.values()];
}

/**
 * 参加取り消し
 * @param userId 
 * @returns 
 */
export function leaveMatch(userId: string) : Participant | null {
    const participant = participants.get(userId);
    if (!participant) {
        return null;
    }
    participants.delete(userId);
    return participant;
}

/**
 * 参加者を全員削除する
 * @returns 
 */
export function clearMatch(): number {
    const count = participants.size;
    participants.clear();
    return count;
}