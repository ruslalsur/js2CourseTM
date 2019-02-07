class MenuItem {
    constructor(menuItem) {
        this.menuItem = menuItem;
    }
    
    render(subContainer) {
        if (!this.menuItem.hasOwnProperty("href")) {
            return `</ul><ul><li><h3>${this.menuItem.title}</h3></li>`;
        } else if (this.menuItem.hasOwnProperty("submenu")) {
            return `<li><a href="${this.menuItem.href}">${this.menuItem.title}</a><div class="${subContainer}">${this._renderSubMenu(this.menuItem.submenu)}</div></li>`;
        } else {
            return `<li><a href="${this.menuItem.href}">${this.menuItem.title}</a></li>`;
        }
    }
    
    _renderSubMenu(subMenu) {
        let result = `<ul>`;
        for (let i = 0; i < subMenu.length; i++) {
            if (!subMenu[i].hasOwnProperty("href")) {
                result += `</ul><ul><li><h3">${subMenu[i].title}</h3></li>`;
            }
            result += `<li><a href="${subMenu[i].href}">${subMenu[i].title}</a></li>`;
        }
        result += '</ul>';
        return result;
    }
}

class Menu {
    constructor(container, subContainer, items) {
        this.container = container;
        this.subContainer =subContainer;
        this.items = items;
    }
    
    render() {
        let result = `<ul class="${this.container}">`;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] instanceof MenuItem) {
                result += this.items[i].render(this.subContainer);
            }
        }
        result += '</ul>';
        return result;
    }
}

