const whitespaceRegex = /\s+/g;
const sentenceRegex = /[?!.]/;

export class AsyncMarkov {
  /** @type {Map<string, MarkovDescriptor>} */
  #words = new Map();
  #hasSentences = false;
  #edges = 0;

  add(string: string) {
    if (!this.#hasSentences) {
      this.#hasSentences = sentenceRegex.test(string);
    }

    const data = string
      .trim()
      .replace(whitespaceRegex, ' ')
      .split(' ')
      .filter(Boolean);

    const length = data.length;
    if (length < 2) {
      return;
    }

    for (let i = 1; i < length; i++) {
      const first = data[i - 1];
      const second = data[i];

      if (!this.#words.has(first)) {
        this.#words.set(first, {
          total: 0,
          mapped: false,
          sums: null,
          related: {}
        });
      }

      const word = this.#words.get(first);
      if (typeof word.related[second] === "undefined") {
        word.related[second] = 0;
      }

      this.#edges++;
      word.total++;
      word.mapped = false;
      word.related[second]++;
    }
    return this;
  }

  generateWord(root: any) {
    if (this.#words.size === 0) {
      throw new Error("Can't generate words, this model has no processed data.");
    }

    if (!root) {
      const keys = [...this.#words.keys()];
      const index = Math.trunc(Math.random() * keys.length);
      root = keys[index];
    }

    const object = this.#words.get(root);
    return (object) ? AsyncMarkov.selectWeighted(object) : null;
  }

  generateWords(amount: number, root = null, options = { stop: false }) {
    if (amount <= 0 || Math.trunc(amount) !== amount || Number.isFinite(amount)) {
      throw new Error("Input amount must be a positive finite integer");
    }

    let current = root;
    const output = [];
    if (current) {
      output.push(current);
    }

    const stop = Boolean(options.stop);
    while (amount--) {
      current = this.generateWord(current);
      if (!current) {
        if (stop) {
          break;
        } else {
          current = this.generateWord(null);
        }
      }
      output.push(current);
    }
    return output.join(" ");
  }

  generateSentences(amount: number, root = null) {
    if (!this.#hasSentences) {
      throw new Error('Model data does not contain delimiters - sentences cannot be generated');
    }
    else if (amount <= 0 || Math.trunc(amount) !== amount || !Number.isFinite(amount)) {
      throw new Error("Amount of sentences must be a positive finite integer");
    }

    let current: string | null = root;
    const output = [];
    if (current) {
      output.push(current);
    }

    while (amount > 0) {
      current = this.generateWord(current);
      output.push(current);

      if (sentenceRegex.test((current) ? current : '')) {
        amount--;
      }
    }
    return output.join(" ");
  }

  finalize() {
    const keys = [...this.#words.keys()];
    for (let i = keys.length - 1; i >= 0; i--) {
      AsyncMarkov.calculateWeights(this.#words.get(keys[i]));
    }
  }

  has(word: string) {
    return this.#words.has(word);
  }

  toJSON() {
    this.finalize();
    return {
      edges: this.#edges,
      words: [this.#words.entries()],
      hasSentences: this.#hasSentences
    };
  }

  load(input: string) {
    const data = (typeof input === "string") ? JSON.parse(input) : input;

    this.reset();
    this.#hasSentences = data.hasSentences;
    this.#words = new Map(data.words);

    if (typeof data.edges === "number") {
      this.#edges = data.edges;
    } else {
      const iterator = this.#words.values();
      let it = iterator.next();

      while (!it.done) {
        this.#edges += it.value.total ?? 0;
        it = iterator.next();
      }
    }

    return this;
  }

  reset() {
    for (const value of this.#words.values()) {
      value.related = {};
    }

    this.#words.clear();
  }

  destroy() {
    this.reset();
    this.#words = null as any;
  }
  
  get size() {
    return this.#words.size;
  }

  get keys() {
    return [...this.#words.keys()];
  }

  get edges() {
    return this.#edges;
  }

  static create(input: string) {
    const instance = new AsyncMarkov();
    instance.load(input);

    return instance;
  }

  static selectWeighted(object: any) {
    if (!object.sums || !object.mapped) {
      AsyncMarkov.calculateWeights(object);
    }

    const roll = Math.trunc(Math.random() * object.total);
    const keys = Object.keys(object.sums);
    for (let i = 0; i < keys.length; i++) {
      const pick: any = keys[i];
      if (roll < pick) {
        return object.sums[pick];
      }
    }
  }

  static calculateWeights(object: any, force = false) {
    if (object.mapped === true && force === false) {
      return;
    }

    let total = 0;
    object.sums = {};


    const keys = Object.keys(object.related);
    const length = keys.length;
    for (let i = 0; i < length; i++) {
      const key = keys[i];
      const value = object.related[key];

      total += value;
      object.sums[total] = key;
    }

    object.mapped = true;
  }
}