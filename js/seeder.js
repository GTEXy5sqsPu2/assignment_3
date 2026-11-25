app.AddItem();
app.AddItem();
app.AddItem();

app.rootnode = new Node();

let splittednode = new Node(false);
splittednode.AddChild(1);
splittednode.AddChild(2);

app.rootnode.AddChild(0);
app.rootnode.AddChild(splittednode);

App.SetPanelData(0, songs); //Insert songs

app.Draw();

