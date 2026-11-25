const rootnode = document.querySelector("#root-node");
const sidenavlist = document.querySelector("#sidenav-list");
const sidenavtemplate = document.querySelector("#nav-template");

class App {
    constructor() {
        this.items = [];
        this.rootnode = new Node();
        this.incrementor = 0;
        this.modal = null;
    }

    AddItem() {
        this.items.push(new Panel(this.incrementor));
        this.rootnode.AddChild(this.incrementor);
        this.incrementor ++;

        this.Draw();
    }

    static GetPanel(Id) {
        return app.items.find(x => x.Id === Id);
    }

    static SetPanelData(Id, Data) {
        let index = app.items.indexOf(this.GetPanel(Id));
        app.items[index].data;
        app.items[index].Draw();

    }

    static GetPanelData(Id) {
        return this.GetPanel().data;
    }

    static ShowFakeModal(X, Y) {
        //if null or null then clear modal
        if ((!X || !Y) && this.modal) { 
            document.body.removeChild(this.modal);
            this.modal = null;
            return;
        }
        
        let index = app.rootnode.CheckBounds(X, Y);
        console.log(index);
        if (!index && index != 0) {
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

        let rect = App.GetPanel(index).element.getBoundingClientRect();
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

        //console.log(index, axis, this.modal.style.width, this.modal.style.height);
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

        console.log(X, Y, Origin, index);
        app.rootnode.SetModal(X, Y, Origin, index);

        //2. Clean

        app.rootnode.Clean();

        //3. Draw

        app.Draw();

    }

    static RecheckVisibility() {
        app.rootnode.RecheckVisibility();
    }

    //On draw everything is cleaned & redrawn. Data stays the same but ui completely redraws. Yes a region based reload would be faster but for this simple app this is enough.
    Draw() {
        Common.DestroyChildren(rootnode);
        Common.DestroyChildren(sidenavlist);

        /*this.items.forEach(child => {
            child.Draw(rootnode);
        });*/

        //Change to X/Y BSP splitting.
        this.rootnode.Draw(rootnode);


        console.log( JSON.stringify(this.rootnode, null, 2) );
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

let app = new App();