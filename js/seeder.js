class Seeder { //Seeder class that runs a DB import when there is no existing data
    Run(app) {
        app.AddItem();
        app.AddItem();
        app.AddItem();

        app.rootnode = new Node();

        let splittednode = new Node(false);
        splittednode.AddChild(2);
        splittednode.AddChild(3);

        app.rootnode.AddChild(1);
        app.rootnode.AddChild(splittednode);

        let playlist = Panel.GetPanel(1);
        playlist.AddRawSongs(songs); //Insert songs
        Panel.SetPanel(1, playlist);

        app.Draw();
    }
}