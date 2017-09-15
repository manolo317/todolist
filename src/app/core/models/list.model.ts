export class ListModel {
    constructor(
        public title: string,
        public Datetime: Date,
        public viewPublic: boolean,
        public description?: string,
        public _id?: string,
    ) { }
}
