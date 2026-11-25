class Panel {
    constructor(Id) {
        this.Id = Id;
        this.shown = false;
        this.data = [];
    }

    static Toggle(Id) {
        App.GetPanel(Id).Toggle();
    }

    static StartDrag(Id, e) {
        App.GetPanel(Id).StartDrag(e);
    }
    
    static Drag(Id, e) {
        App.GetPanel(Id).Drag(e);
    }
    
    static StopDrag(Id, e) {
        App.GetPanel(Id).StopDrag(e);
    }

    Toggle() {
        this.shown = !this.shown;
        this.Draw();
        App.RecheckVisibility();
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

    Draw(Parent = null) {
        if (Parent) {
            this.element = Common.CloneTemplate("#panel-template", {"#close-btn": {"onclick": () => { Panel.Toggle(this.Id); }}, "header": {"onmousedown": (e) => { Panel.StartDrag(this.Id, e); }}});
            Parent.appendChild(this.element);

            this.sideelement = Common.CloneTemplate("#nav-template", {"#toggle-btn": {"onclick": () => { Panel.Toggle(this.Id); }}});
            sidenavlist.appendChild(this.sideelement);
        }

        if (!this.element) 
            return;

        this.element.style.display = this.shown ? "none" : "block";
    }

}

