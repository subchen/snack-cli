/* jshint freeze: false */

/**
 * An iterator over a collection.
 *
 * @class
 */
function Iterator(items) {
    this.index = 0;
    this.length = items.length;
    this.items = items;
}

Iterator.prototype.hasNext = function() {
    return this.index < this.length;
};

Iterator.prototype.next = function() {
    if (this.index < this.length) {
        return this.items[this.index++];
    }
    return null;
};

Iterator.prototype.peek = function() {
    if (this.index < this.length) {
        return this.items[this.index];
    }
    return null;
};

Iterator.prototype.size = function() {
    return this.length;
};

Iterator.prototype.remove = function() {
    var item = this.items.splice(this.index, 1);
    this.length = this.items.length;
    return item;
};

Iterator.prototype.reset = function() {
    this.index = 0;
};

module.exports = Iterator;
