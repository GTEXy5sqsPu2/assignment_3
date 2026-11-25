class Common {
    static DestroyChildren(element) {
        while(element.children.length) {
            element.removeChild(element.lastChild);
        }
    }

    static SetOptions(Element, Options) {
        for (const [key, value] of Object.entries(Options)) {
            let paths = key.split('.');
            let direction = Element;
            for (let index = 0; index < paths.length - 1; index++) {
                direction = direction[paths[index]];
            }

            direction[paths[paths.length - 1]] = value;
        }

        return Element;
    }

    static CloneTemplate(Query, Data = {}) {
        const Template = document.querySelector(Query);
        const Clone = Template.content.firstElementChild.cloneNode(true);

        for (const [key, value] of Object.entries(Data)) {
            let Element;
            if (key.length == 0)
                Element = Clone;
            else {
                Element = Clone.querySelector(key);
            }

            Common.SetOptions(Element, value);
        }

        return Clone;
    }
}