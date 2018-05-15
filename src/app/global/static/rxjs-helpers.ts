
export class RxjsHelpers {

    /**
     * @param  {any[]=[]} arr
     * @returns any
     */
    public static mapArrayAttributes(arr: any[] = []): any[] {
        return arr.map((el) => {
            if (el instanceof Array) {
                return el.map((e) => e.attributes);
            } else if (el instanceof Object) {
                return el.attributes;
            } else {
                return el;
            }
        })
    }

    /**
     * @param  {any[]|object|any} el
     * @returns any
     */
    public static mapAttributes(el: any[] | object | any): any[] | object | any {
        if (el instanceof Array) {
            return RxjsHelpers.mapArrayAttributes(el);
        } else if (el instanceof Object) {
            return (el as any).attributes || el;
        } else {
            return el;
        }
    }

    /**
     * @param  {any[]} relationshipArray
     * @param  {string} relatedProperty
     * @returns {object}
     * @description This is for attack patterns by indicator and intrusion sets by attack pattern unwrapping
     */
    public static relationshipArrayToObject(relationshipArray: any[], relatedProperty: string): object {
        const mapObj: any = {};
        relationshipArray.forEach((item) => {
            mapObj[item._id] = item[relatedProperty];
            if (mapObj[item._id] === undefined) {
                console.log('WARNING:', relatedProperty, 'not found on relationhip array');
            }
        });
        return mapObj;
    }
}
