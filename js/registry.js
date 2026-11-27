class Registry {
    constructor() {

    }

    Load() {
        //1. Load data
        const Data = localStorage.getItem();

        //2. Do we have data
        if (Data) {
            //2.Yes Parse some how
            //TODO!
        } else {
            //2.No.1 Load Seeder
            let seeder = new Seeder();
            
            //2.No.2 Run Seeder
            seeder.Run(this);
        }
    }



    static GetId(Name) {
        return counters.GetId(Name);
    }

    GetId(Name) {
        if (!this.counters[Name])
            this.counters[Name] = 1; //Start index at one to skip issues

        this.counters[Name]++;
        this.Save();

        return this.counters[Name] - 1;
    }

    Save() {
        localStorage.setItem('counters', JSON.stringify(this.counters, null, 2));
    }
    static Load() {
        let data = JSON.parse(localStorage.getItem('counters'));
        if (data)
            this.counters = data;
    }
}

counters = new Id();