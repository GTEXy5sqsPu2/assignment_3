const rootnode = document.querySelector("#root-node");
const sidenavlist = document.querySelector("#sidenav-list");
const sidenavtemplate = document.querySelector("#nav-template");

class App {
    constructor() {
        //0 Construct
        this.registry = new Registry();

        //1. Load
        this.registry.Load();

        Id.Load();

        this.playlists = [];

        const playlistsjson = JSON.parse(localStorage.getItem('playlists'));
        if (playlistsjson) playlistsjson.forEach(playlistjson => {
            let playlist = new Panel(playlistjson);
            this.playlists.push(playlist);
        });

        const layoutjson = JSON.parse(localStorage.getItem('layout'));

        this.rootnode = new Node(layoutjson);
        this.modal = null;
    }

    AddItem() {
        let panel = new Panel();
        this.playlists.push(panel);
        this.rootnode.AddChild(panel.Id);

        this.Draw();
    }

    static Draw() {
        app.Draw();
    }

    static ShowFakeModal(X, Y) {
        //if null or null then clear modal
        if ((!X || !Y) && this.modal) { 
            document.body.removeChild(this.modal);
            this.modal = null;
            return;
        }
        
        let index = app.rootnode.CheckBounds(X, Y);
        if (!index && index === false) {
            if (this.modal) {
                document.body.removeChild(this.modal);
                this.modal = null;
            }
            return;
        }
                
        if (!this.modal) {
            this.modal = Common.CloneTemplate("#modal-template");
            document.body.appendChild(this.modal);
        }

        let rect = Panel.GetPanel(index).element.getBoundingClientRect();
        const axis = App.FindAxis(X, Y, rect.left + (rect.width / 2), rect.top + (rect.height / 2));

        switch (axis) {
            case 'top':
                this.modal.style.width = rect.width + "px";
                this.modal.style.height = rect.height / 2 + "px";
                this.modal.style.left = rect.left + "px";
                this.modal.style.top = rect.top + "px";
                break;
            case 'bottom':
                this.modal.style.width = rect.width + "px";
                this.modal.style.height = rect.height / 2 + "px";
                this.modal.style.left = rect.left + "px";
                this.modal.style.top = rect.top + (rect.height / 2) + "px";
                break;
            case 'left':
                this.modal.style.width = rect.width / 2 + "px";
                this.modal.style.height = rect.height + "px";
                this.modal.style.left = rect.left + "px";
                this.modal.style.top = rect.top + "px";
                break;
            case 'right':
                this.modal.style.width = rect.width / 2 + "px";
                this.modal.style.height = rect.height + "px";
                this.modal.style.left = rect.left + (rect.width / 2) + "px";
                this.modal.style.top = rect.top + "px";
                break;
        }
    }

    static SetModal(X, Y, Origin) {
        //we gotta think about 2 things.
        //1. first the transfer
        //2. then the cleanup (nodes can only exist while 2 children, except root node tho.)
        //3. Redraw
        let index = app.rootnode.CheckBounds(X, Y);
        if (!index && index != 0)
            return;


        //1. Transfer

        app.rootnode.SetModal(X, Y, Origin, index);

        //2. Clean

        app.rootnode.Clean();

        //3. Draw

        app.Draw();

    }

    //On draw everything is cleaned & redrawn. Data stays the same but ui completely redraws. Yes a region based reload would be faster but for this simple app this is enough.
    Draw() {
        Common.DestroyChildren(rootnode);
        Common.DestroyChildren(sidenavlist);

        //Change to X/Y BSP splitting.
        //Tired of css overflow. So i am deciding.
        const rect = document.querySelector("#root-node").getBoundingClientRect();
        let Width = rootnode.offsetWidth;
        let Height = rootnode.offsetHeight;
        let X = rect.left;
        let Y = rect.top;

        this.rootnode.Draw(X, Y, Width, Height, rootnode);

        localStorage.setItem('layout', JSON.stringify(this.rootnode, null, 2));
        localStorage.setItem('playlists', JSON.stringify(this.playlists, null, 2));
    }

    static FindAxis(X, Y, PX, PY) {
        //get vector
        const VX = PX - X;
        const VY = PY - Y;

        if (Math.abs(VX) > Math.abs(VY)) {
            //Horzontal
            if (VX < 0) return "right";
            return "left";
        } else {
            //Vertical
            if (VY < 0) return "bottom";
            return "top";
        }
    }
}

window.addEventListener('resize', function(event) {
    app.Draw();
}, true);