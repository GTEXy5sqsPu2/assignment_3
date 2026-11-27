class Song {
    constructor(Data) {
        this.id = Data.id;

        this.title = Data.title;
        this.artist = Data.artist;
        this.genre = Data.genre;
        this.duration = Data.duration;

        this.dragger = null;
        this.element = null;
    }
    
    static GetSong(Panel_Id, Song_Id) {
        return Panel.GetPanel(Panel_Id).songs.find(x => x.Id === Song_Id);
    }

    static SetSong(Panel_Id, Song) {
        let panel = Panel.GetPanel(Panel_Id);
        
        panel.AddSong(Song);
    
        Panel.SetPanel(Panel_Id, panel);
    }

    static RemoveSong(Panel_Id, Song_Id) {
        let panel = Panel.GetPanel(Panel_Id);
        let index = panel.songs.findIndex(x => x.Id === Song_Id);

        panel.songs.splice(index, 1);
    
        Panel.SetPanel(Panel_Id, panel);
    }

    static StartDrag(Panel_Id, Song_Id, e) {
        Song.GetSong(Panel_Id, Song_Id).StartDrag(Panel_Id, e);
    }

    static StopDrag(Panel_Id, Song_Id, e) {
        Song.GetSong(Panel_Id, Song_Id).StopDrag(Panel_Id, e);
    }

    static Drag(Panel_Id, Song_Id, e) {
        Song.GetSong(Panel_Id, Song_Id).Drag(e);
    }

    StartDrag(Panel_Id, e) {
        document.onmouseup = (n) => { Song.StopDrag(Panel_Id, this.id, n) };
        document.onmousemove = (n) => { Song.Drag(Panel_Id, this.id, n) };

        //Add placeholder
        
        this.dragger = Common.CloneTemplate("#card-template", {"": {"style.position": "absolute", "style.width": "100px", "style.height": "40px"}});
        document.body.appendChild(this.dragger);

        //recalculate

        this.Drag(e);
    }

    StopDrag(Panel_Id, e) {
        document.onmouseup = null;
        document.onmousemove = null;

        //Remove Placeholder

        document.body.removeChild(this.dragger);

        //Set Song (Fix Id)
        let new_panel_id = app.rootnode.CheckBounds(e.clientX, e.clientY);
        if (!new_panel_id) return;

        Song.RemoveSong(Panel_Id, this.id);
        Song.SetSong(new_panel_id, this);

        app.Draw();
    }

    Drag(e) {
        this.dragger.style.top = (e.clientY - (this.dragger.offsetHeight / 2))+ "px";
        this.dragger.style.left = (e.clientX - (this.dragger.offsetWidth / 2)) + "px";

        document.body.appendChild(this.dragger);
    }

    GetTemplate(Panel_Id) {
        this.element = Common.CloneTemplate("#card-template", {"": {"onmousedown": (e) => {Song.StartDrag(Panel_Id, this.id, e)}}, "#title": {"innerText": this.title}, "#artist": {"innerText": this.artist}, "#genre": {"innerText": this.genre}, "#time": {"innerText": Common.ConvertSecondsToString(this.duration)}});
        return this.element;
    }
}