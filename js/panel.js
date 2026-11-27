class Panel {
    constructor(Data) {
        this.songs = [];
        if (Data == null) {
            this.Id = Id.GetId('panel');
            this.shown = true;
            return;
        }
        this.Id = Data.Id;
        this.shown = Data.shown;
        
        this.AddRawSongs(Data.songs);
    }

    static GetPanel(Id) {
        return app.playlists.find(x => x.Id === Id);
    }

    static SetPanel(Id, Panel) {
        let index = app.playlists.findIndex(x => x.Id === Id);
        app.playlists[index] = Panel;
    }


    static Toggle(Id) {
        Panel.GetPanel(Id).Toggle();
    }

    static StartDrag(Id, e) {
        Panel.GetPanel(Id).StartDrag(e);
    }
    
    static Drag(Id, e) {
        Panel.GetPanel(Id).Drag(e);
    }
    
    static StopDrag(Id, e) {
        Panel.GetPanel(Id).StopDrag(e);
    }

    AddRawSongs(Songs) {
        Songs.forEach(song => {
            Id.GetId('song'); //discard, Will be an issue later.
            this.songs.push(new Song(song));
        });
    }

    AddSong(Song) {
        this.songs.push(Song);
    }

    Toggle() {
        this.shown = !this.shown;
        App.Draw();
    }

    StartDrag(e) {
        document.onmouseup = (n) => { Panel.StopDrag(this.Id, n) };
        document.onmousemove = (n) => { Panel.Drag(this.Id, n) };

        this.Dragger = Common.CloneTemplate("#drag-template");
        document.body.appendChild(this.Dragger);
        
        this.RecalculateDrag(e);
    }

    Drag(e) {
        this.RecalculateDrag(e);
    }

    RecalculateDrag(e) {
        this.Dragger.style.top = (e.clientY - (this.Dragger.offsetHeight / 2))+ "px";
        this.Dragger.style.left = (e.clientX - (this.Dragger.offsetWidth / 2)) + "px";
        App.ShowFakeModal(e.clientX, e.clientY);
    }

    StopDrag(e) {
        document.onmouseup = null;
        document.onmousemove = null;

        document.body.removeChild(this.Dragger);

        App.ShowFakeModal(null, null);
        App.SetModal(e.clientX, e.clientY, this.Id); //X, Y, Id
    }

    Draw(X, Y, Width, Height, Parent = null) {
        if (Parent) {
            this.element = Common.CloneTemplate("#panel-template", {"header": {"onmousedown": (e) => { Panel.StartDrag(this.Id, e); }}});
            Parent.appendChild(this.element);

            this.sideelement = Common.CloneTemplate("#nav-template", {"#toggle-btn": {"onclick": () => { Panel.Toggle(this.Id); }}});
            sidenavlist.appendChild(this.sideelement);
        }

        if (!this.element) 
            return false;

        if (this.shown)
            Common.SetSizeAndPos(this.element, X, Y, Width, Height);

        let panelcontent = this.element.querySelector("#panel-content");
        if (this.songs.length)
            panelcontent.innerText = "";

        for (let index = 0; index < this.songs.length; index++) {
            let song = this.songs[index];

            panelcontent.appendChild(song.GetTemplate(this.Id));

            this.songs[index] = song;
        }

        this.element.style.display = this.shown ? "flex" : "none";
        return this.shown;
    }
}

