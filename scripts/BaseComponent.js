
// abstract class simulation 
class BaseComponent {
    constructor() {
        if(this.constructor === BaseComponent) {
            throw new Error(`It's not allowed to create object from abstract class`);
        }
    }

    getProxyState(state) {
        return new Proxy(state, {
            get: (target, key) => {
                return target[key];
            },
            set: (target, key, value) => {
                const oldValue = target[key];
                target[key] = value
                if(oldValue !== value) {
                    console.log(2);
                    this.updateUI();
                }
                return true;
            }
        })
    }
    
    updateUI() {
        throw new Error('updateUI() method has to be implemented');
    }
}

export default BaseComponent;