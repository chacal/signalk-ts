export interface SKSourceJSON {
  label: string
  type: string
  src: string
  pgn?: number
}

/**
 * Source of data in delta format, a record of where the data was received from.
 * An object containing at least the properties defined in 'properties', but can contain anything beyond that.
 */
export class SKSource {
  /**
   * A label to identify the source bus, eg serial-COM1, eth-local,etc .
   * Can be anything but should follow a predicatable format.
   */
  public label: string
  public pgn?: number
  public src?: string
  public type?: string

  constructor(label: string, opts?: { pgn?: number, src?: string, type?: string }) {
    this.label = label

    if (opts) {
      this.pgn = opts.pgn
      this.src = opts.src
      this.type = opts.type
    }
  }

  static fromJSON(json: string|SKSourceJSON): SKSource {
    if (typeof json === 'string') {
      return JSON.parse(json, SKSource.reviver)
    }
    else {
      const s = Object.create(SKSource)
      s.label = json.label
      return s
    }
  }

  static reviver(key: string, value: any): any {
    return key === "" ? SKSource.fromJSON(value) : value;
  }
}