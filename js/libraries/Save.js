export class Save {
    constructor() {
        this.prefix = "merchantsofdeath"
    }

    _get() {
        return JSON.parse(localStorage.getItem(`${this.prefix}-savedata`) || "{}")
    }

    _set(value) {
        localStorage.setItem(`${this.prefix}-savedata`, JSON.stringify(value))
    }

    setKey(key, value) {
        let saveData = this._get()
        saveData[key] = value
        this._set(saveData)
    }

    appendKey(key, value) {
        let saveData = this._get()
        if(!saveData[key]) {
            saveData[key] = []
        }
        saveData[key].push(value)
        this._set(saveData)
    }

    incrementKey(key, value) {
        let saveData = this._get()
        if(!saveData[key]) {
            saveData[key] = 0
        }
        saveData[key]+= value
        this._set(saveData)
    }

    getKey(key) {
        let saveData = this._get()
        return saveData[key]
    }

    delete() {
        localStorage.removeItem(`${this.prefix}-savedata`)
    }
}