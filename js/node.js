class Node {
    constructor(horizontal = true) {
        //Either horizontal or vertical
        this.horizontal = horizontal;
        this.children = [];
        this.element = null;
    }

    //Either add index or node
    AddChild(object) {
        if (this.children.length == 2) {
            //right one is now a node.
            let newnode = new Node();
            newnode.AddChild(this.children[1]);
            newnode.AddChild(object);

            this.children[1] = newnode;
        } else {
            this.children.push(object);
        }
    }

    Draw(parent) {
        let direction = this.horizontal ? "row" : "column";

        this.element = Common.CloneTemplate("#node-template", { "": {"style.flex-direction": direction }});
        parent.appendChild(this.element);

        this.children.forEach(child => {
            if (typeof(child) == 'number')
            {
                App.GetPanel(child).Draw(this.element);
            } else {
                //Assume another node because recursive.
                child.Draw(this.element);
            }
        });
    }

    CheckBounds(X, Y) {
        if (!this.element)
            return false;

        let rect = this.element.getBoundingClientRect();
        if (X > rect.right || X < rect.left) return false;
        if (Y > rect.bottom || Y < rect.top) return false;

        //Ok it is in this node.
        for (let index = 0; index < this.children.length; index++) {
            const child = this.children[index];
            
            if (typeof(child) == 'number') {
                let childrect = App.GetPanel(child).element.getBoundingClientRect();
                if (X < childrect.right && X > childrect.left &&
                    Y < childrect.bottom && Y > childrect.top) {
                    return child; //Number found. Send Back.
                }
            } else {
                return child.CheckBounds(X, Y);
            }
        }
        
        return false;
    }

    RecheckVisibility() {
        let hidden = true;
        for (let index = 0; index < this.children.length; index++) {
            let child = this.children[index];

            if (typeof(child) == 'number') {
                if (App.GetPanel(child).element.style.display == "none")
                    continue;
            } else {
                child.RecheckVisibility();

                if (child.element.style.display == "none")
                    continue;
            }

            hidden = false;
            break;
        }

        this.element.style.dislay = hidden ? "block" : "none";
    }

    SetModal(X, Y, Origin, Index) {
        if (Origin == Index)
            return; //Never

        console.log("H1");
        for (let childindex = 0; childindex < this.children.length; childindex++) {
            const child = this.children[childindex];

            console.log(child);

            if (typeof(child) == 'number') {
                //Check Id
                if (child == Origin) {
                    //Cleanup
                    this.children.splice(childindex, 1);
                    childindex -= 1;
                    console.log("Cleanup");
                }
                console.log(child, Index);
                if (child == Index)
                {
                    //We Found
                    const rect = App.GetPanel(child).element.getBoundingClientRect();
                    const axis = App.FindAxis(X, Y, rect.left + (rect.width / 2), rect.top + (rect.height / 2));
                    
                    let newnode = new Node((axis == "top" || axis == "bottom") ? false : true);
                    
                    //order depends on axis
                    newnode.AddChild(Index);
                    newnode.children.splice((axis == "top" || axis == "left") ? 0 : 1, 0, Origin);

                    console.log(newnode.children.length);

                    this.children[childindex] = newnode;
                    console.log("Gone");
                }
            } else {
                //Recursive
                console.log("Recurse");
                child.SetModal(X, Y, Origin, Index);
                this.children[childindex] = child;
            }
        }
    }

    Clean() {
        for (let index = 0; index < this.children.length; index++) {
            const child = this.children[index];
            
            if (typeof(child) == 'number')
                continue;

            if (child.children.length == 1) {
                this.children[index] = child.children[0];
            } else {
                child.Clean();
            }
        }
    }
}