/**
 * Archived record of a finished mission.
 */
export class MissionHistory {
    #id!: number;
    #missionId!: number;
    #finalStatus!: string;
    #completedAt!: string;

    constructor(id: number, missionId: number, finalStatus: string, completedAt: string) {
        this.#id = id;
        this.#missionId = missionId;
        this.#finalStatus = finalStatus;
        this.#completedAt = completedAt;
    }

    get id(): number {
        return this.#id;
    }

    set id(value: number) {
        this.#id = value;
    }

    get missionId(): number {
        return this.#missionId;
    }

    set missionId(value: number) {
        this.#missionId = value;
    }

    get finalStatus(): string {
        return this.#finalStatus;
    }

    set finalStatus(value: string) {
        this.#finalStatus = value;
    }

    get completedAt(): string {
        return this.#completedAt;
    }

    set completedAt(value: string) {
        this.#completedAt = value;
    }

    /**
     * Checks whether the mission was completed on the given day.
     * @param date - Day in YYYY-MM-DD format.
     */
    isCompletedOn(date: string): boolean {
        return this.#completedAt.startsWith(date);
    }
}
