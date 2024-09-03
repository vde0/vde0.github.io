export default class PrivateProperties {



    constructor () {

        setInterval(_ => {
            
        }, 500);
    }

    objects = {}

    init () {
        const accKey    = Symbol();
        const del       = Symbol("DEL");
        const delTimer  = Symbol("DelTimer")
        const global    = this.objects;
        this.objects[accKey] = {
            [del]: false,
            [delTimer] () {
                if (this[del]) { delete global[accKey]; return; }
                this[del]   = true;

                
            },
        };

        return accKey;
    }

    setProperty (accKey, props) {
        Object.assign(this.objects[accKey], ...props);
    }
    getProperty (accKey, propName) {
        return this.objects[accKey][propName];
    }
    delProperty (accKey, propName) {
        return delete this.objects[accKey][propName];
    }
}