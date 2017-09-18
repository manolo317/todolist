export class ListModel {
    constructor(
        public title: string,
        public datetime: Date,
        public viewPublic: boolean,
        public description?: string,
        public _id?: string,
    ) { }
}
