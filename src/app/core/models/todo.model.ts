export class TodoModel {
    constructor(
        public userId: string,
        public title: string,
        public listId: string,
        public done: boolean,
        public comments?: string,
        public _id?: string
    ) { }
}
